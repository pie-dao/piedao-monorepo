import {
  MultiChainWrapperConfig,
  MultiChainContractWrapper,
} from '@sdk-utils/multichain';
import { MultiCallWrapper } from '@sdk-utils/multicall';
import {
  Erc20Abi__factory,
  YieldvaultAbi__factory,
  MerkleauthAbi__factory,
  TokenLockerAbi__factory,
  XAUXOAbi__factory,
  StakingManagerAbi__factory,
  VeAUXOAbi__factory,
  SharesTimeLockAbi__factory,
} from '@shared/util-blockchain';
import { ethers } from 'ethers';
import { config, SUPPORTED_CHAINS } from '../../utils/networks';
import products from '../../config/products.json';
import migration from '../../config/migration.json';
import { vaults } from '../../config/auxoVaults';
import { FTM } from '../../config/auxoVaults/FTM';
import { Polygon } from '../../config/auxoVaults/POLYGON';

const localRPC = 'http://bore.pub:36241';

const selectedNetwork = 1;

const _config = config as MultiChainWrapperConfig;

const mcw = new MultiChainContractWrapper(_config);

const FTMmulticall = new MultiCallWrapper(
  _config[SUPPORTED_CHAINS.FANTOM.toString()].provider,
);
const PolygonMulticall = new MultiCallWrapper(
  _config[SUPPORTED_CHAINS.POLYGON.toString()].provider,
);

export const productContracts = Object.entries(products).map(
  ([, value]) => value.addresses,
);

export const vaultContracts = Object.entries(vaults).map(
  ([, value]) => value.address,
);

export const FTMContracts = Object.entries(FTM).map(
  ([, value]) => value.address,
);

export const PolygonContracts = Object.entries(Polygon).map(
  ([, value]) => value.address,
);

export const underlyingContractsFTM = Object.entries(FTM).map(
  ([, value]) => value.token.address,
);

export const underlyingContractsPolygon = Object.entries(Polygon).map(
  ([, value]) => value.token.address,
);

export const contractWrappers = productContracts.map((addresses) => {
  const contract = Erc20Abi__factory.connect(
    addresses[selectedNetwork].address,
    new ethers.providers.JsonRpcProvider(localRPC),
  );
  return mcw.wrap(contract, addresses);
});

export const stakingContract = TokenLockerAbi__factory.connect(
  products['veAUXO'].addresses[selectedNetwork].stakingAddress,
  new ethers.providers.JsonRpcProvider(localRPC),
);

export const veAUXOContract = VeAUXOAbi__factory.connect(
  products['veAUXO'].addresses[selectedNetwork].address,
  new ethers.providers.JsonRpcProvider(localRPC),
);

export const xAUXOContract = XAUXOAbi__factory.connect(
  products['xAUXO'].addresses[selectedNetwork].address,
  new ethers.providers.JsonRpcProvider(localRPC),
);

export const xAUXOStakingManager = StakingManagerAbi__factory.connect(
  products['xAUXO'].addresses[selectedNetwork].stakingAddress,
  new ethers.providers.JsonRpcProvider(localRPC),
);

export const veDOUGHSharesTimeLock = SharesTimeLockAbi__factory.connect(
  migration['veDOUGH'].addresses[selectedNetwork].stakingAddress,
  new ethers.providers.JsonRpcProvider(localRPC),
);

export const FTMContractWrappers = FTMContracts.map((address) => {
  const contract = YieldvaultAbi__factory.connect(
    address,
    ethers.getDefaultProvider(),
  );
  return FTMmulticall.wrap(contract);
});

export const PolygonContractWrappers = PolygonContracts.map((address) => {
  const contract = YieldvaultAbi__factory.connect(
    address,
    ethers.getDefaultProvider(),
  );
  return PolygonMulticall.wrap(contract);
});

export const underlyingContractsFTMWrappers = underlyingContractsFTM.map(
  (address) => {
    const contract = Erc20Abi__factory.connect(
      address,
      ethers.getDefaultProvider(),
    );
    return FTMmulticall.wrap(contract);
  },
);

export const underlyingContractsPolygonWrappers =
  underlyingContractsPolygon.map((address) => {
    const contract = Erc20Abi__factory.connect(
      address,
      ethers.getDefaultProvider(),
    );
    return PolygonMulticall.wrap(contract);
  });

export const FTMAuthContractWrapper = (authAddress: string) => {
  const contract = MerkleauthAbi__factory.connect(
    authAddress,
    ethers.getDefaultProvider(),
  );
  return FTMmulticall.wrap(contract);
};

export const PolygonAuthContractWrapper = (authAddress: string) => {
  const contract = MerkleauthAbi__factory.connect(
    authAddress,
    ethers.getDefaultProvider(),
  );
  return PolygonMulticall.wrap(contract);
};
