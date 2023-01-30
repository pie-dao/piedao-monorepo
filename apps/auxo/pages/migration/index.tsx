import Heading from '../../components/Heading/Heading';
import useTranslation from 'next-translate/useTranslation';
import { ReactElement, useEffect } from 'react';
import { Layout } from '../../components';
import { wrapper } from '../../store';
import Image from 'next/image';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ThunkGetVeDOUGHStakingData } from '../../store/migration/migration.thunks';
import MigrationBanner from '../../components/MigrationBanner/MigrationBanner';
import AUXOtoVeAUXOxAUXO from '../../public/images/migration/AUXOtoVeAUXOxAUXO.png';
import DOUGHtoAUXO from '../../public/images/migration/DOUGHtoAUXO.png';
import veDOUGHtoDOUGH from '../../public/images/migration/veDOUGHtoDOUGH.png';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/solid';
import MigrationBackground from '../../components/MigrationBackground/MigrationBackground';
import MigrationFAQ from '../../components/MigrationFAQ/MigrationFAQ';

export default function Migration() {
  const { t } = useTranslation('migration');
  const { isMigrationDeployed } = useAppSelector((state) => state.migration);

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  useEffect(() => {
    if (account) {
      dispatch(ThunkGetVeDOUGHStakingData({ account }));
    }
  }, [account, dispatch]);

  const lifecycleColumns = [
    {
      icon: <Image src={veDOUGHtoDOUGH} alt="veDOUGHtoDOUGH" />,
      title: t('veDOUGHtoDOUGH'),
    },
    {
      icon: <Image src={DOUGHtoAUXO} alt="DOUGHtoAUXO" />,
      title: t('DOUGHtoAUXO'),
    },
    {
      icon: <Image src={AUXOtoVeAUXOxAUXO} alt="AUXOtoVeAUXOxAUXO" />,
      title: t('AUXOtoVeAUXOxAUXO'),
    },
  ];

  return (
    <div className="flex flex-col isolate relative">
      <MigrationBackground />
      <MigrationBanner />
      <Heading
        title={t('timeToMigrate')}
        subtitle={t('timeToMigrateArrived')}
      />
      <div className="bg-white px-4 py-5 sm:px-6 max-w-4xl mx-auto shadow-md rounded-lg w-full">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <h3 className="w-full text-lg font-medium leading-6 text-primary text-center">
            {t('lifecycle')}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-custom-border">
          {lifecycleColumns.map((column, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center rounded-full max-w-[96px] mx-auto">
                {column.icon}
              </div>
              <h3 className="mt-4 text-sm font-medium text-primary text-center">
                {column.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-center mt-12">
          <Link href="/migration/start" passHref>
            <button
              disabled={!isMigrationDeployed}
              className="w-fit flex items-center gap-x-2 px-8 py-2 text-md font-medium text-white bg-secondary rounded-full ring-inset ring-2 ring-secondary enabled:hover:bg-transparent hover:text-secondary disabled:opacity-70 disabled:text-sub-light disabled:ring-sub-light disabled:bg-transparent"
            >
              {t('startMigration')}
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
      <MigrationFAQ />
    </div>
  );
}

Migration.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getStaticProps = wrapper.getStaticProps(() => () => {
  return {
    props: {
      title: 'migration',
    },
  };
});
