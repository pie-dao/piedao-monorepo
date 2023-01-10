import { createAsyncThunk } from '@reduxjs/toolkit';
import { promiseObject } from '../../utils/promiseObject';
import { veDOUGHSharesTimeLock } from '../../store/products/products.contracts';
import { toBalance } from '../../utils/formatBalance';
import { UpgradoorAbi } from '@shared/util-blockchain';
import { pendingNotification } from '../../components/Notifications/Notifications';
import { ContractTransaction } from 'ethers';
import { setCurrentStep, setTx, setTxState } from './migration.slice';
import { STEPS_LIST, TX_STATES } from './migration.types';

export const THUNKS = {
  GET_VEDOUGH_STAKING_DATA: 'migration/getVeDOUGHStakingData',
  MIGRATE_VEDOUGH: 'migration/migrateVeDOUGH',
  GET_MIGRATION_PREVIEW: 'migration/getMigrationPreview',
};

export const ThunkGetVeDOUGHStakingData = createAsyncThunk(
  THUNKS.GET_VEDOUGH_STAKING_DATA,
  async ({
    account,
    upgradoor,
  }: {
    account: string;
    upgradoor: UpgradoorAbi;
  }) => {
    if (!account || !upgradoor) return;
    const numberOfLocks = promiseObject({
      locksLength: veDOUGHSharesTimeLock.getLocksOfLength(account),
      latestLock: upgradoor.getNextLongestLock(account),
    });

    const { locksLength, latestLock } = await numberOfLocks;

    const locks = await Promise.all(
      Array.from(Array(locksLength.toNumber())).map((_, i) => {
        return veDOUGHSharesTimeLock.locksOf(account, i);
      }),
    );

    const locksFormatted = locks.map((lock) => {
      const [amount, lockedAt, lockDuration] = lock;
      return {
        amount,
        lockDuration,
        lockedAt,
      };
    });

    const latestLockFormatted = {
      amount: toBalance(latestLock[0], 18),
      lockDuration: latestLock[2],
      lockedAt: latestLock[1],
    };

    return [latestLockFormatted].concat(
      locksFormatted
        .filter((lock) => lock.lockedAt !== latestLock[1])
        .sort((a, b) => {
          if (a.lockDuration === b.lockDuration) return 1;
          return b.lockDuration - a.lockDuration;
        })
        .map((lock) => {
          const { amount, lockDuration, lockedAt } = lock;
          return {
            amount: toBalance(amount, 18),
            lockDuration,
            lockedAt,
          };
        }),
    );
  },
);

export type ThunkMigrateVeDOUGHProps = {
  upgradoor: UpgradoorAbi;
  boost: boolean;
  destinationWallet: string;
  token: 'veAUXO' | 'xAUXO';
  isSingleLock: boolean;
  sender: string;
};

export const ThunkMigrateVeDOUGH = createAsyncThunk(
  THUNKS.MIGRATE_VEDOUGH,
  async (
    {
      upgradoor,
      boost,
      destinationWallet,
      token,
      isSingleLock,
      sender,
    }: ThunkMigrateVeDOUGHProps,
    { rejectWithValue, dispatch },
  ) => {
    if (
      !upgradoor ||
      typeof boost !== 'boolean' ||
      !destinationWallet ||
      !token ||
      typeof isSingleLock !== 'boolean'
    ) {
      return rejectWithValue(
        'Missing Contract, Boost, Destination Wallet, Token to migrate to or single lock definition',
      );
    }

    dispatch(
      setTx({
        hash: null,
        status: null,
      }),
    );

    const {
      aggregateAndBoost,
      aggregateToVeAuxo,
      upgradeSingleLockVeAuxo,
      aggregateToXAuxo,
      upgradeSingleLockXAuxo,
    } = upgradoor;

    let tx: ContractTransaction;
    if (token === 'veAUXO') {
      if (isSingleLock) {
        tx = await upgradeSingleLockVeAuxo(destinationWallet);
      } else if (boost) {
        tx = await aggregateAndBoost();
        pendingNotification({
          title: `aggregateAndBoostVeDOUGHPending`,
          id: 'aggregateVeDOUGH',
        });
      } else {
        tx = await aggregateToVeAuxo();
        pendingNotification({
          title: `aggregateVeDOUGHPending`,
          id: 'aggregateVeDOUGH',
        });
      }
    } else {
      if (isSingleLock) {
        tx = await upgradeSingleLockXAuxo(destinationWallet);
        pendingNotification({
          title: `aggregateVeDOUGHPending`,
          id: 'aggregateVeDOUGH',
        });
      } else {
        tx = await aggregateToXAuxo();
        pendingNotification({
          title: `aggregateveDOUGHPending`,
          id: 'aggregateVeDOUGH',
        });
      }
    }

    dispatch(
      setTx({
        hash: tx.hash,
        status: TX_STATES.PENDING,
      }),
    );

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      setTxState(TX_STATES.COMPLETE);
      dispatch(setCurrentStep(STEPS_LIST.MIGRATE_SUCCESS));
      dispatch(ThunkGetVeDOUGHStakingData({ account: sender, upgradoor }));
    }

    if (receipt.status !== 1) {
      setTxState(TX_STATES.FAILED);
      return rejectWithValue('Migration Failed');
    }
  },
);

export const ThunkPreviewMigration = createAsyncThunk(
  THUNKS.GET_MIGRATION_PREVIEW,
  async (
    {
      upgradoor,
      boost,
      token,
      isSingleLock,
      sender,
      destinationWallet,
    }: ThunkMigrateVeDOUGHProps,
    { rejectWithValue },
  ) => {
    if (
      !upgradoor ||
      typeof boost !== 'boolean' ||
      !token ||
      typeof isSingleLock !== 'boolean' ||
      !sender ||
      !destinationWallet
    ) {
      return rejectWithValue(
        'Missing Contract, Boost, Destination Wallet, Token to migrate to or single lock definition',
      );
    }

    const previews = promiseObject({
      veAUXOAggregateAndBoost: upgradoor.previewAggregateAndBoost(sender),
      veAUXOAggregate: upgradoor.previewAggregateVeAUXO(sender),
      veAUXOSingleLock: upgradoor.previewUpgradeSingleLockVeAuxo(
        sender,
        destinationWallet,
      ),
      xAUXOAggregate: upgradoor.previewAggregateToXAUXO(sender),
      xAUXOSingleLock: upgradoor.previewUpgradeSingleLockXAUXO(sender),
    });

    const {
      veAUXOAggregateAndBoost,
      veAUXOAggregate,
      veAUXOSingleLock,
      xAUXOAggregate,
      xAUXOSingleLock,
    } = await previews;

    return {
      veAUXO: {
        aggregateAndBoost: toBalance(veAUXOAggregateAndBoost, 18),
        aggregate: toBalance(veAUXOAggregate, 18),
        singleLock: toBalance(veAUXOSingleLock, 18),
      },
      xAUXO: {
        aggregate: toBalance(xAUXOAggregate, 18),
        singleLock: toBalance(xAUXOSingleLock, 18),
      },
    };
  },
);