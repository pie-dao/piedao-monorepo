import { useAppSelector } from '.';
import { calculatePriceInUSD, zeroBalance } from '../utils/balances';
import { findProductByAddress } from '../utils/findProductByAddress';
import { useCoinGeckoTokenPrice } from './useCoingecko';

export const useUserPoolBalanceInUSD = (address: string) => {
  const pool = useAppSelector((state) => state?.lending?.pools?.[address]);
  const princpalAddress = pool?.principal;
  const userAmount = pool?.userData?.balance;
  const principalDecimals = findProductByAddress(princpalAddress).decimals;
  const { data, isError, isLoading } = useCoinGeckoTokenPrice(
    princpalAddress,
    'usd',
  );

  const usdPrice = calculatePriceInUSD(
    userAmount,
    principalDecimals,
    isError || isLoading ? 1 : (data as number),
  );

  return {
    data: usdPrice,
    isError,
    isLoading,
  };
};

export const UseMaxWithdrawableAmountFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.userData?.unlendableAmount ??
      zeroBalance,
  );
};

export const UseCanUserWithdrawFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.canWithdraw,
  );
};

export const UseUserPreference = (poolAddress: string) => {
  return useAppSelector(
    (state) => state?.lending?.pools?.[poolAddress]?.userData?.preference,
  );
};

export const UseMaxBorrowableAmountFromPool = (poolAddress: string) => {
  return useAppSelector(
    (state) =>
      state?.lending?.pools?.[poolAddress]?.lastEpoch?.maxBorrow ?? zeroBalance,
  );
};