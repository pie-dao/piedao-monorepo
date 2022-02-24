import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo } from "react";
import { useAppDispatch } from ".";
import {
  Erc20,
  MerkleAuth,
  Mono,
  Vault as VaultCapped,
} from "../types/artifacts/abi";
import { useContracts } from "./useContract";
import { Balance, Vault } from "../store/vault/Vault";
import { AwaitedReturn, fromScale, toBalance } from "../utils";
import { setVaults } from "../store/vault/vault.slice";
import { BigNumber } from "@ethersproject/bignumber";
import { chainMap } from "../utils/networks";
import { useProxySelector } from "../store";
import hash from "object-hash";
import { useWeb3Cache } from "./useCachedWeb3";
import { useBlock } from "./useBlock";
import { zeroBalance } from "../utils/balances";

type BalancesProps = {
  token: Erc20 | undefined;
  mono: Mono | undefined;
  auth: MerkleAuth | undefined;
  cap: VaultCapped | undefined;
  batchBurnRound?: number;
  account?: string | null;
};

const getAllBalances = async ({
  token,
  mono,
  auth,
  cap,
  batchBurnRound,
  account,
}: BalancesProps) => {
  if (mono && auth && cap && token) {
    const calls: Promise<BigNumber | BigNumber[] | boolean>[] = [
      mono.totalUnderlying(), // 0
      mono.lastHarvest(), // 1
      mono.estimatedReturn(), // 2
      mono.batchBurnRound(), // 3
      cap.userDepositLimit(), // 4
    ];

    if (account) {
      [
        token.balanceOf(account), // 5
        mono.balanceOf(account), // 6
        mono.balanceOfUnderlying(account), // 7
        token.allowance(account, mono.address), // 8
        mono.userBatchBurnReceipts(account), // 9
        auth.isDepositor(mono.address, account), // 10
      ].forEach((call) => calls.push(call));
    }

    if (batchBurnRound && batchBurnRound > 0) {
      calls.push(mono.batchBurns(batchBurnRound - 1)); // 11
    }

    calls.push(mono.exchangeRate()); // 12

    return await Promise.all(calls);
  } else {
    console.warn("Missing contracts");
    return await Promise.all([]);
  }
};

const calculateAvailable = (
  shares: BigNumber,
  amountPerShare: BigNumber,
  decimals: number,
  batchBurnRound: number,
  userBatchBurnRound: number
): Balance => {
  /**
   * Amount available depends on the batch burn round
   * If the BBR === UserBBR, available === 0, else it's amount per share * shares
   */
  if (userBatchBurnRound === batchBurnRound) {
    return zeroBalance();
  }
  const _amountPerShare = fromScale(amountPerShare, decimals);
  const bigAvailable = shares.mul(_amountPerShare);
  return toBalance(bigAvailable, decimals);
};

const toState = ({
  existing,
  decimals,
  data,
  account,
}: {
  existing: Vault;
  address: string;
  decimals: number;
  data: AwaitedReturn<typeof getAllBalances>;
  account?: string | null;
}): Vault => {
  /**
   * Rebuilds the entire vault before making a dispatch call
   * This allows us to check we actually have changes before triggering
   * a state update. Useful for controlling re-renders and preventing
   * hammering of the node
   *
   * @dev - clean this up a bit for multichain.
   * It works, but it's big and not easy to maintain
   */
  const toNumber = (n: BigNumber | BigNumber[] | boolean): number =>
    (n as BigNumber).toNumber();
  let returnValue: Vault = {
    ...existing,
    stats: {
      deposits: toBalance(data[0] as BigNumber, decimals),
      lastHarvest: toNumber(data[1]),
      currentAPY: toBalance(data[2] as BigNumber, decimals, 2),
      batchBurnRound: toNumber(data[3]),
      exchangeRate: toBalance(
        (data[12] as BigNumber) ?? BigNumber.from(0),
        decimals,
        6
      ),
    },
    cap: {
      ...existing.cap,
      underlying: toBalance(data[4] as BigNumber, decimals),
    },
  };
  if (account)
    returnValue = {
      ...returnValue,
      auth: {
        ...returnValue.auth,
        isDepositor: data[10] as boolean,
      } as Vault["auth"],
      userBalances: {
        wallet: toBalance(data[5] as BigNumber, decimals),
        vault: toBalance(data[6] as BigNumber, decimals),
        vaultUnderlying: toBalance(data[7] as BigNumber, decimals),
        allowance: toBalance(data[8] as BigNumber, decimals),
        batchBurn: {
          round: (data[9] as BigNumber[])[0].toNumber(),
          shares: toBalance((data[9] as BigNumber[])[1], decimals),
          available:
            returnValue.userBalances?.batchBurn.available ??
            toBalance(0, decimals),
        },
      },
    };
  if (data[11]) {
    returnValue = {
      ...returnValue,
      userBalances: {
        ...returnValue.userBalances!,
        batchBurn: {
          ...returnValue.userBalances?.batchBurn!,
          available: calculateAvailable(
            (data[9] as BigNumber[])[1],
            (data[11] as BigNumber[])[1],
            decimals,
            toNumber(data[3]),
            (data[9] as BigNumber[])[0].toNumber()
          ),
        },
      },
    };
  }
  return returnValue;
};

const hasStateChanged = (old: Vault[], change: Vault[]): boolean => {
  const hasChanged =
    hash(old, { encoding: "base64" }) !== hash(change, { encoding: "base64" });
  return hasChanged;
};

export const useChainData = (): { loading: boolean } => {
  const { account, active } = useWeb3React();
  const { chainId } = useWeb3Cache();
  const { block, firstLoad, refreshFrequency } = useBlock();

  const dispatch = useAppDispatch();
  const vaults = useProxySelector((state) => state.vault.vaults);
  const { monoContracts, tokenContracts, authContracts, capContracts } =
    useContracts(chainId);

  const shouldUpdate = useMemo(() => {
    // do not update state if vital data missing
    if (!chainId || !block || !block.number) return false;

    // Ensure we always fetch data when the user loads the page for the first time
    if (firstLoad) return true;

    // repeated state updates can cause rpc throttling with lower block times
    const blockFrequencyConditionMet = block.number % refreshFrequency === 0;

    // No point updating state if any of the contracts are missing
    const contractsExist =
      tokenContracts.length > 0 &&
      monoContracts.length > 0 &&
      authContracts.length > 0 &&
      capContracts.length > 0;

    return (
      active &&
      contractsExist &&
      chainMap[chainId] &&
      blockFrequencyConditionMet
    );
  }, [
    active,
    tokenContracts,
    monoContracts,
    authContracts,
    capContracts,
    firstLoad,
    block,
    chainId,
    refreshFrequency,
  ]);

  useEffect(() => {
    if (shouldUpdate) {
      // Multicall contract executes promise all as a batch request
      Promise.all(
        tokenContracts.map(async (token) => {
          const vault = vaults.find(
            (v) => v.token.address.toLowerCase() === token.address.toLowerCase()
          );
          const mono = monoContracts.find(
            (m) => m.address.toLowerCase() === vault?.address.toLowerCase()
          )!;
          const auth = authContracts.find(
            (a) => a.address.toLowerCase() === vault?.auth.address.toLowerCase()
          )!;
          const cap = capContracts.find(
            (c) => c.address.toLowerCase() === vault?.cap.address.toLowerCase()
          )!;
          if (mono && vault) {
            const data = {
              vault,
              address: mono.address,
              data: await getAllBalances({
                token,
                mono,
                auth,
                cap,
                batchBurnRound: vault.stats?.batchBurnRound,
                account,
              }),
            };
            return data;
          }
        })
      )
        .then((payload) => {
          const newVaults = payload.filter(Boolean).map((p) => {
            return (
              p &&
              toState({
                existing: p.vault,
                address: p.address,
                decimals: p.vault.token.decimals,
                data: p.data,
                account,
              })
            );
          }) as Vault[];

          if (newVaults && hasStateChanged(vaults, newVaults)) {
            dispatch(setVaults(newVaults));
          }
        })
        .catch((err) => {
          console.warn("Problem fetching on chain data", err);
        });
    }
  }, [
    account,
    shouldUpdate,
    active,
    chainId,
    block.number,
    dispatch,
    monoContracts,
    capContracts,
    authContracts,
    tokenContracts,
    vaults,
  ]);
  return { loading: false };
};
