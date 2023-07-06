import { createAsyncThunk } from '@reduxjs/toolkit';
import { poolAddressesContracts } from '../products/products.contracts';
import { promiseObject } from '../../utils/promiseObject';
import { isEmpty } from 'lodash';
import { EIP1193Provider } from '@web3-onboard/core';
import { toBalance } from '../../utils/formatBalance';
import { BigNumber, BigNumberish } from 'ethers';
import { Epoch, STEPS, Steps, TX_STATES } from './lending.types';
import { calculatePriceInUSD, zeroBalance } from '../../utils/balances';
import { findProductByAddress } from '../../utils/findProductByAddress';
import { fetchPrice } from '../../hooks/useCoingecko';
import { BigNumberReference } from '../products/products.types';
import { Erc20Abi, LendingPoolAbi } from '@shared/util-blockchain';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { setLendingStep, setTx, setTxHash } from './lending.slice';
import { PREFERENCES } from '../../utils/constants';

const createEpochObject = (epoch: Epoch, decimals: number) => ({
  rate: toBalance(epoch.rate.mul(BigNumber.from(100)), 18),
  state: epoch.state,
  maxBorrow: toBalance(epoch.maxBorrow, decimals),
  totalBorrow: toBalance(epoch.totalBorrowed, decimals),
  available: toBalance(epoch.available, decimals),
  forClaims: toBalance(epoch.forClaims, decimals),
  forWithdrawal: toBalance(epoch.forWithdrawal, decimals),
});

export const THUNKS = {
  GET_LENDING_DATA: 'app/getLendingData',
  GET_USER_LENDING_DATA: 'app/getUserLendingData',
  APPROVE_LENDING_TOKEN: 'app/approveLendingToken',
  LEND_DEPOSIT: 'app/lendDeposit',
  CLAIM_REWARDS: 'app/claimRewards',
  UNLOAN: 'app/unloan',
  REQUEST_WITHDRAWAL: 'app/requestWithdrawal',
  WITHDRAW: 'app/withdraw',
};

export const thunkGetLendingData = createAsyncThunk(
  THUNKS.GET_LENDING_DATA,
  async (_, { rejectWithValue }) => {
    try {
      const lendingPoolsDataResults = await Promise.allSettled(
        poolAddressesContracts.map((wrappedPool) => {
          const results = promiseObject({
            poolAddress: wrappedPool.address,
            principal: wrappedPool.principalToken(),
            isLocked: wrappedPool.isLocked(),
            lastEpoch: wrappedPool.getPendingEpoch(),
            lastActiveEpoch: wrappedPool.getLastActiveEpoch(),
            epochs: wrappedPool.getEpochs(),
            // canDeposit: wrappedPool.isPoolAcceptingDeposits()
          });
          return results;
        }),
      );
      const lendingPoolsData = lendingPoolsDataResults.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        if (result.status === 'rejected') {
          rejectWithValue(result.reason);
        }
      });
      let totalDeposited = 0;
      try {
        for (const pool of lendingPoolsData) {
          const decimals = findProductByAddress(pool.principal).decimals;
          const price = await fetchPrice(pool.principal, 'usd');
          totalDeposited += calculatePriceInUSD(
            toBalance(pool.lastEpoch.totalBorrowed, decimals),
            decimals,
            price,
          );
        }
      } catch (err) {
        console.error(err);
      }

      return {
        totalDeposited,
        pools: Object.fromEntries(
          lendingPoolsData.map((pool) => {
            const decimals = findProductByAddress(pool.principal).decimals;
            return [
              pool.poolAddress,
              {
                address: pool.poolAddress,
                principal: pool.principal,
                isLocked: pool.isLocked,
                lastEpoch: !isEmpty(pool?.lastEpoch)
                  ? createEpochObject(pool.lastEpoch, decimals)
                  : null,
                lastActiveEpoch: !isEmpty(pool?.lastActiveEpoch)
                  ? createEpochObject(pool?.lastActiveEpoch, decimals)
                  : null,
                epochs: pool.epochs.map((epoch) => {
                  return createEpochObject(epoch, decimals);
                }),
                // canDeposit: pool?.canDeposit,
              },
            ];
          }),
        ),
      };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export type ThunkUserLendingData = {
  account: string;
  provider: EIP1193Provider;
};

export const thunkGetUserLendingData = createAsyncThunk(
  THUNKS.GET_USER_LENDING_DATA,
  async ({ account, provider }: ThunkUserLendingData, { rejectWithValue }) => {
    console.log('new data should be fetched');
    if (!account || !provider) {
      return rejectWithValue('No account or provider');
    }
    try {
      const lendingPoolsDataResults = await Promise.allSettled(
        poolAddressesContracts.map((wrappedPool) => {
          const results = promiseObject({
            poolAddress: wrappedPool.address,
            principal: wrappedPool.principalToken(),
            claimableRewards: wrappedPool.claimable(account),
            loan: wrappedPool.getLoan(account),
            canWithdraw: wrappedPool.canWithdraw(account),
            unlendableAmount: wrappedPool.getUnlendableAmount(account),
          });
          return results;
        }),
      );
      const lendingPoolsData = lendingPoolsDataResults.map((result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        if (result.status === 'rejected') {
          rejectWithValue(result.reason);
        }
      });

      let totalDeposited = 0;
      let totalClaimableRewards = 0;

      try {
        for (const pool of lendingPoolsData) {
          const decimals = findProductByAddress(pool.principal).decimals;
          const price = await fetchPrice(pool.principal, 'usd');
          totalClaimableRewards += calculatePriceInUSD(
            toBalance(pool.claimableRewards, decimals),
            decimals,
            price,
          );
          totalDeposited += calculatePriceInUSD(
            toBalance(pool.loan.amount, decimals),
            decimals,
            price,
          );
        }
      } catch (err) {
        console.error(err);
      }

      return {
        userTotalDeposited: totalDeposited,
        userTotalClaimable: totalClaimableRewards,
        pools: Object.fromEntries(
          lendingPoolsData.map((pool) => {
            return [
              pool.poolAddress,
              {
                userData: {
                  balance: toBalance(
                    pool.loan.amount,
                    findProductByAddress(pool.principal).decimals,
                  ),
                  yield: toBalance(
                    pool.claimableRewards,
                    findProductByAddress(pool.principal).decimals,
                  ),
                  canWithdraw: pool?.canWithdraw,
                  unlendableAmount: pool?.unlendableAmount
                    ? toBalance(
                        pool.unlendableAmount,
                        findProductByAddress(pool.principal).decimals,
                      )
                    : zeroBalance,
                  preference: pool?.loan?.preference,
                },
              },
            ];
          }),
        ),
      };
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export type ThunkApproveTokenProps = {
  deposit: BigNumberReference;
  token: Erc20Abi | undefined;
  spender: string;
  nextStep: Steps;
};

export const thunkApproveToken = createAsyncThunk(
  THUNKS.APPROVE_LENDING_TOKEN,
  async (
    { deposit, token, spender, nextStep }: ThunkApproveTokenProps,
    { rejectWithValue, dispatch },
  ) => {
    if (!token || !spender)
      return rejectWithValue('Missing token or staking contract');
    dispatch(setTxHash(null));
    const tx = await token.approve(spender, deposit.value);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `approveTokenPending`,
      id: 'approveToken',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setTxHash(null));
      dispatch(setLendingStep(nextStep));
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Approval Failed');
  },
);

export type ThunkLendDeposit = {
  deposit: BigNumberReference;
  lendingPool: LendingPoolAbi;
  preference: BigNumberish;
};

export const thunkLendDeposit = createAsyncThunk(
  THUNKS.LEND_DEPOSIT,
  async (
    { deposit, lendingPool, preference }: ThunkLendDeposit,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.lend(deposit.value, preference);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `lendDepositPending`,
      id: 'lendDeposit',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.LEND_DEPOSIT_COMPLETED));
    }

    return receipt.status === 1
      ? { deposit }
      : rejectWithValue('Deposit Failed');
  },
);

export type ThunkLendClaimRewards = {
  lendingPool: LendingPoolAbi;
};

export const thunkLendClaimRewards = createAsyncThunk(
  THUNKS.CLAIM_REWARDS,
  async (
    { lendingPool }: ThunkLendClaimRewards,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.claim();

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `claimLendRewardsPending`,
      id: 'claimLendRewards',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.LEND_REWARDS_CLAIM_COMPLETED));
    }

    return receipt.status === 1
      ? { lendingPool }
      : rejectWithValue('Claim Failed');
  },
);

export type ThunkRequestWithdrawal = {
  lendingPool: LendingPoolAbi;
};

export const thunkRequestWithdrawal = createAsyncThunk(
  THUNKS.REQUEST_WITHDRAWAL,
  async (
    { lendingPool }: ThunkRequestWithdrawal,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.setWithdrawalPreference(PREFERENCES.WITHDRAW);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `requestWithdrawalPending`,
      id: 'requestWithdrawal',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.WITHDRAW_REQUEST_COMPLETED));
    }

    return receipt.status === 1
      ? { lendingPool }
      : rejectWithValue('Unlend Failed');
  },
);

export type ThunkWithdraw = {
  lendingPool: LendingPoolAbi;
};

export const thunkWithdraw = createAsyncThunk(
  THUNKS.WITHDRAW,
  async ({ lendingPool }: ThunkWithdraw, { rejectWithValue, dispatch }) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.withdraw();

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `withdrawalPending`,
      id: 'withdraw',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.WITHDRAW_CONFIRM_COMPLETED));
    }

    return receipt.status === 1
      ? { lendingPool }
      : rejectWithValue('Unlend Failed');
  },
);

export type ThunkUnloan = {
  lendingPool: LendingPoolAbi;
  amount: BigNumberReference;
};

export const thunkUnlend = createAsyncThunk(
  THUNKS.UNLOAN,
  async (
    { lendingPool, amount }: ThunkUnloan,
    { rejectWithValue, dispatch },
  ) => {
    if (!lendingPool) return rejectWithValue('Missing staking contract');
    dispatch(setTxHash(null));
    const tx = await lendingPool.unlend(amount.value);

    const { hash } = tx;
    dispatch(setTxHash(hash));

    pendingNotification({
      title: `unlendPending`,
      id: 'unlend',
    });

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      dispatch(setLendingStep(STEPS.LEND_DEPOSIT_COMPLETED));
    }

    return receipt.status === 1
      ? { lendingPool }
      : rejectWithValue('Unlend Failed');
  },
);