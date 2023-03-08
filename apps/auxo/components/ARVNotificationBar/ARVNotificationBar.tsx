import Image from 'next/image';
import CoinImage from '../../public/images/icons/coin.svg';
import useTranslation from 'next-translate/useTranslation';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  useIsUserMaxLockDuration,
  useUserLockAmount,
} from '../../hooks/useToken';
import { useStakingTokenContract } from '../../hooks/useContracts';
import { setStep, setSwap, setIsOpen } from '../../store/modal/modal.slice';
import { STEPS } from '../../store/modal/modal.types';
import { useWeb3React } from '@web3-react/core';

const ARVNotificationBar = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { defaultLocale } = useAppSelector((state) => state.preferences);
  const isMaxxed = useIsUserMaxLockDuration('ARV');

  const userLockAmount = useUserLockAmount('ARV');
  const tokenLocker = useStakingTokenContract('ARV');
  const dispatch = useAppDispatch();

  const boostToMax = () => {
    dispatch(setStep(STEPS.BOOST_STAKE_VEAUXO));
    dispatch(
      setSwap({
        swap: {
          from: {
            token: 'AUXO',
            amount: userLockAmount,
          },
          to: {
            token: 'ARV',
            amount: userLockAmount,
          },
          stakingTime: 36,
          spender: tokenLocker.address,
        },
      }),
    );
    dispatch(setIsOpen(true));
  };

  if (!isMaxxed && account)
    return (
      <div className="flex gap-x-2 flex-wrap gap-y-4">
        <div className="flex md:flex-1 p-[1px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-full">
          <div className="px-4 py-2 rounded-full w-full flex gap-x-4 items-center">
            <div className="flex shrink-0">
              <Image
                src={CoinImage}
                alt="Coin"
                width={24}
                height={24}
                priority
              />
            </div>
            <h2 className="font-medium text-white text-base">
              {t('restakeBefore', {
                date: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0,
                ).toLocaleDateString(defaultLocale, {
                  month: 'long',
                  day: 'numeric',
                }),
              })}
            </h2>
          </div>
        </div>
        <div className="flex">
          <button
            onClick={boostToMax}
            className="px-4 py-1 text-base font-medium bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-full text-white hover:bg-white"
          >
            {t('restake')}
          </button>
        </div>
      </div>
    );
  return null;
};

export default ARVNotificationBar;