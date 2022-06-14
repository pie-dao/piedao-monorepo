import { useMemo } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useWeb3React } from '@web3-react/core';
import { motion } from 'framer-motion';
import { useCopyToClipboard } from 'usehooks-ts';
import {
  ClipboardIcon,
  ClipboardCheckIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/solid';
import { useENSName } from '@shared/ui-library';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useFindUserQuery } from '../../api/generated/graphql';
import { setHideBalance } from '../../store/preferences/preferences.slice';
import trimAccount from '../../utils/trimAccount';
import styles from './UserCard.module.scss';
import classNames from '../../utils/classnames';

export default function UserCard() {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const ensName = useENSName(library, account);
  const { data } = useFindUserQuery({ userId: account });
  const [copied, copy] = useCopyToClipboard();
  const { hideBalance, defaultCurrency, defaultLocale } = useAppSelector(
    (state) => state.preferences,
  );
  const dispatch = useAppDispatch();

  const balance = useMemo(() => {
    const balanceAmount = data?.user?.balances.find(
      (b) => b.currency === defaultCurrency,
    ).amount;
    if (typeof balanceAmount !== 'undefined') {
      const number = new Intl.NumberFormat(defaultLocale, {
        style: 'currency',
        currency: defaultCurrency,
      }).format(balanceAmount);
      return number;
    }
    return null;
  }, [data?.user?.balances, defaultCurrency, defaultLocale]);

  const twentyFourHourVolume = useMemo(() => {
    const volume = data?.user?.twentyFourHourChange;
    if (data?.user?.twentyFourHourChange > 0) {
      return `+${volume}%`;
    } else if (data?.user?.twentyFourHourChange < 0) {
      return `${volume}%`;
    }
    return null;
  }, [data?.user?.twentyFourHourChange]);

  return (
    <div
      className={`flex flex-col w-96 h-56 sm:w-96 space-y-12 bg-dashboard-card dashboard-card bg-cover rounded-xl relative text-white shadow-md p-6 ${styles.dashboardCard}`}
    >
      <div className="w-full flex justify-between items-center">
        <div className={`font-medium text-base ${styles.dashboardAddress}`}>
          {ensName ? (
            <div>{ensName}</div>
          ) : account ? (
            <div>{trimAccount(account, true)}</div>
          ) : (
            <div>{t('Your Address')}</div>
          )}
        </div>
        {account && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="h-5 w-5 cursor-pointer"
          >
            {account !== copied ? (
              <ClipboardIcon onClick={() => copy(account)} />
            ) : (
              <ClipboardCheckIcon />
            )}
          </motion.button>
        )}
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="w-full flex-col items-center">
          <h2
            className={classNames(
              'text-4xl',
              hideBalance ? 'hidden-balance' : styles.dashboardAddress,
            )}
          >
            {balance}
          </h2>
          {twentyFourHourVolume && (
            <p>
              {t('24h')}{' '}
              <span
                className={classNames(
                  data?.user?.twentyFourHourChange > 0
                    ? 'text-secondary'
                    : 'text-red',
                  hideBalance && 'hidden-balance',
                )}
              >
                {twentyFourHourVolume}
              </span>
            </p>
          )}
        </div>
        <motion.button
          className="h-5 w-5 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {!hideBalance ? (
            <EyeIcon onClick={() => dispatch(setHideBalance(true))} />
          ) : (
            <EyeOffIcon onClick={() => dispatch(setHideBalance(false))} />
          )}
        </motion.button>
      </div>
    </div>
  );
}
