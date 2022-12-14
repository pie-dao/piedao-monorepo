import { useAppSelector } from '../../hooks';
import { CONVERSION_CURVE } from '../../utils/constants';
import { formatBalance } from '../../utils/formatBalance';
import { ethers } from 'ethers';
import Trans from 'next-translate/Trans';
import { Fragment } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import useTranslation from 'next-translate/useTranslation';

export type MigrationRecapProps = {
  migrationType: string;
  locks: {
    numberOfLocks: number;
    totalMigrating: string;
    migratingTo: string | number;
  };
  preview: {
    from: string;
    to: string;
  };
  newLockDuration?: number;
  willReceive: {
    AUXO: string;
    estimatedOutput: string;
  };
  receiver: string;
  newLockEnd?: string;
  token: 'veAUXO' | 'xAUXO';
  oldLockDuration: number;
};

export const MigrationRecap: React.FC<MigrationRecapProps> = ({
  migrationType,
  locks,
  preview,
  newLockDuration,
  willReceive,
  receiver,
  newLockEnd,
  oldLockDuration,
  token,
}) => {
  const { t } = useTranslation('migration');
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const textLabels = [
    <p className="text-primary font-normal" key={5}>
      <Trans
        key={0}
        i18nKey="recap"
        values={{ migrationType }}
        components={{ migrationType: <span className="font-bold" /> }}
        ns="migration"
      />
    </p>,
    <p className="text-primary font-normal" key={5}>
      <Trans
        key={1}
        i18nKey="locks"
        values={{
          numberOfLocks: locks.numberOfLocks,
          totalMigrating: locks.totalMigrating,
          migratingTo: locks.migratingTo,
        }}
        components={{
          numberOfLocks: <span className="font-bold" />,
          totalMigrating: <span className="font-bold" />,
          migratingTo: <span className="font-bold" />,
        }}
        ns="migration"
      />
    </p>,
    <p className="text-primary font-normal" key={5}>
      <Trans
        key={2}
        i18nKey="preview"
        values={{ from: preview.from, to: preview.to }}
        components={{
          from: <span className="font-bold" />,
          to: <span className="font-bold" />,
        }}
        ns="migration"
      />
    </p>,
    token === 'veAUXO' && (
      <p className="text-primary font-normal">
        <Trans
          key={3}
          i18nKey="newLockDuration"
          values={{ newLockDuration }}
          components={{ newLockDuration: <span className="font-bold" /> }}
          ns="migration"
        />
      </p>
    ),
    <p className="text-primary font-normal" key={4}>
      <Trans
        key={4}
        i18nKey="willReceive"
        values={{
          AUXO: willReceive.AUXO,
          estimatedOutput: willReceive.estimatedOutput,
        }}
        components={{
          AUXO: <span className="font-bold" />,
          estimatedOutput: <span className="font-bold" />,
        }}
        ns="migration"
      />
    </p>,
    <p className="text-primary font-normal" key={5}>
      <Trans
        i18nKey="receiver"
        values={{ receiver }}
        components={{ receiver: <span className="font-bold" /> }}
        ns="migration"
      />
    </p>,
    token === 'veAUXO' && oldLockDuration && (
      <Fragment key={6}>
        <p className="text-primary font-normal" key={6}>
          <Trans
            i18nKey="newLockEnd"
            values={{ newLockEnd }}
            components={{ newLockEnd: <span className="font-bold" /> }}
            ns="migration"
          />
        </p>
        <Tooltip>
          <p className="font-medium text-primary">
            {willReceive?.AUXO} AUXO *{' '}
            {formatBalance(
              Number(
                ethers.utils.formatEther(CONVERSION_CURVE[oldLockDuration]),
              ),
              defaultLocale,
              4,
              'standard',
            )}{' '}
          </p>
          <p className="font-normal text-primary">
            {t('monthMultiplier', {
              multiplier: oldLockDuration,
            })}
          </p>
        </Tooltip>
      </Fragment>
    ),
  ];

  return (
    <div className="flex flex-col w-full gap-y-2">
      {textLabels
        .filter((textLabels) => textLabels)
        .map((el, index) => (
          <div
            key={index}
            className="text-left bg-background px-2 py-1 justify-between flex"
          >
            {el}
          </div>
        ))}
    </div>
  );
};

export default MigrationRecap;