import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../components';
import GradientBox from '../components/GradientBox/GradientBox';
import {
  BaseSubDarkTextSkeleton,
  BoldSubDarkTextSkeleton,
} from '../components/Skeleton';
import { defaultLocale } from '../i18n';
import { wrapper } from '../store';
import { formatBalance } from '../utils/formatBalance';
import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';
import { MERKLE_TREES_BY_USER_URL } from '../utils/constants';
import { useAppDispatch, useAppSelector } from '../hooks';
import { MerkleTreesByUser } from '../types/merkleTree';
import { thunkGetUserRewards } from '../store/rewards/rewards.thunks';
import TotalRewards from '../components/TotalRewards/TotalRewards';
import RewardsHistory from '../components/RewardsHistory/RewardsHistory';
import RewardsHistoryChart from '../components/RewardsHistoryChart/RewardsHistoryChart';
import { useConnectWallet } from '@web3-onboard/react';
import { useTokenBalance, useUserStakedPRV } from '../hooks/useToken';
import {
  thunkGetUserProductsData,
  thunkGetUserStakingData,
} from '../store/products/thunks';

export default function Rewards() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [{ wallet }] = useConnectWallet();
  const account = wallet?.accounts[0]?.address;
  const ArvBalance = useTokenBalance('ARV');
  const StakedPrvBalance = useUserStakedPRV();
  const allTimeTotal = useAppSelector(
    (state) => state?.rewards?.data?.metadata?.allTimeTotal,
  );

  const { data: merkleTreesByUser } = useSWR<MerkleTreesByUser>(
    MERKLE_TREES_BY_USER_URL,
    fetcher,
  );

  useEffect(() => {
    if (merkleTreesByUser && account) {
      dispatch(
        thunkGetUserRewards({
          account,
          rewards: merkleTreesByUser[account],
        }),
      );
    }
  }, [account, dispatch, merkleTreesByUser]);

  useEffect(() => {
    if (account && wallet?.provider) {
      dispatch(
        thunkGetUserProductsData({ account, provider: wallet?.provider }),
      );
      dispatch(
        thunkGetUserStakingData({ account, provider: wallet?.provider }),
      );
    }
  }, [account, dispatch, wallet?.provider]);

  return (
    <div className="flex flex-col">
      <section className="flex flex-wrap justify-between gap-4 text-xs md:text-inherit mt-6">
        <div className="flex gap-x-4 items-center w-full sm:w-fit flex-wrap">
          <div className="flex flex-col py-1">
            {!ArvBalance ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-bold text-sub-dark text-base sm:text-xl">
                  {formatBalance(
                    ArvBalance.label,
                    defaultLocale,
                    2,
                    'standard',
                  )}
                </p>
                <p className="flex text-base text-sub-dark font-medium gap-x-1">
                  {t('compactTokenBalance', { token: 'ARV' })}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col py-1">
            {!StakedPrvBalance ? (
              <>
                <BoldSubDarkTextSkeleton />
                <BaseSubDarkTextSkeleton />
              </>
            ) : (
              <>
                <p className="font-bold text-sub-dark text-base sm:text-xl">
                  <span>
                    {formatBalance(
                      StakedPrvBalance.label,
                      defaultLocale,
                      2,
                      'standard',
                    )}
                  </span>
                </p>
                <p className="flex text-base text-sub-dark font-medium gap-x-1">
                  {t('compactStakedBalance', { token: 'PRV' })}
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-x-2 items-center w-full sm:w-fit">
          {/* <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  ETH{' '}
                  {formatBalance(
                    lastDistributionAmount.label,
                    defaultLocale,
                    4,
                    'standard',
                  )}
                </span>
              </p>
              <div className="flex text-base text-sub-dark font-medium gap-x-1">
                {t('lastMonthEarnings')}
                <Tooltip>{t('lastMonthEarningsTooltip')}</Tooltip>
              </div>
            </>
          </GradientBox> */}
          <GradientBox>
            <>
              <p className="font-bold text-primary text-xl">
                <span>
                  ETH{' '}
                  {formatBalance(
                    allTimeTotal?.label,
                    defaultLocale,
                    4,
                    'standard',
                  )}
                </span>
              </p>
              <div className="flex text-base text-sub-dark font-medium gap-x-1">
                {t('allTimeTotal')}
              </div>
            </>
          </GradientBox>
        </div>
      </section>
      <TotalRewards />
      <RewardsHistory />
      <RewardsHistoryChart />
    </div>
  );
}

Rewards.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    // does not seem to work with key `initialState`
    props: {
      title: 'Rewards',
    },
  };
});
