import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3React } from "@web3-react/core";
import {
  SUPPORTED_CHAIN_ID,
  SUPPORTED_CHAIN_NAMES,
  NetworkDetail,
} from "../types/types";
import { NetworkSwitcher } from "./NetworkSwitcher";
import { logoSwitcher } from "./ChainIcons/ChainIcons";
import { isChainSupported, filteredChainMap } from "../utils/network";
import Icon from "../ui-atoms/Icon";
import { classNames } from "../utils/class-names";
import { useConnectedWallet } from "../hooks/use-connected-wallet";

interface Props {
  allowedChains?: SUPPORTED_CHAIN_NAMES[];
  showNetworkIcon?: boolean;
  showNetworkName?: boolean;
  className?: string;
}

interface ChainProps {
  chain: NetworkDetail | null | undefined;
}

export const ChainAndLogo: FunctionComponent<ChainProps> = ({
  chain,
}: ChainProps) => {
  return (
    <span className="h-6 w-6 block mr-2">
      {logoSwitcher(chain?.nativeCurrency?.symbol)}
    </span>
  );
};

export const ChainSwitcher: FunctionComponent<Props> = ({
  className,
  showNetworkIcon = true,
  showNetworkName = true,
  allowedChains = ["MAINNET"],
}: Props) => {
  useConnectedWallet();
  let { chainId } = useWeb3React();

  const availableChains = useMemo(() => {
    return filteredChainMap(allowedChains);
  }, [allowedChains]);

  const supportedChain = useMemo(() => {
    return isChainSupported(chainId)
      ? availableChains[chainId as SUPPORTED_CHAIN_ID]
      : null;
  }, [chainId]);

  const [chain, setChain] = useState(supportedChain);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (supportedChain) {
      setChain(supportedChain);
    } else {
      setChain(null);
    }
    setLoading(false);
  }, [supportedChain]);

  if (loading) {
    return <SkeletonUI />;
  }

  return (
    <div className={classNames(className, showNetworkName ? "w-60" : "w-20")}>
      <NetworkSwitcher value={chain} onChange={setChain}>
        {({ open }) => (
          <div className="relative">
            <NetworkSwitcher.Button className="flex justify-start items-center relative w-full py-2 px-4 text-left bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-primary focus-visible:ring-offset-2 focus-visible:border-primary sm:text-sm">
              {showNetworkIcon && <ChainAndLogo chain={chain} />}
              {showNetworkName && (
                <span className="block truncate font-bold text-primary">
                  {chain ? chain.chainName : "Unsupported Chain"}
                </span>
              )}
              <motion.span
                className="ml-auto flex pointer-events-none"
                animate={{ rotate: open ? 180 : 0 }}
              >
                <Icon
                  width="20px"
                  height="20px"
                  icon="arrow_dropdown"
                  aria-hidden="true"
                  className="fill-primary"
                />
              </motion.span>
            </NetworkSwitcher.Button>
            <NetworkSwitcher.Options
              as={motion.ul}
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.1 }}
              static
              className={`flex flex-col absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${
                open ? "" : "pointer-events-none"
              }`}
            >
              {Object.entries(availableChains).map(([, chain]) => (
                <NetworkSwitcher.Option
                  key={chain.chainId}
                  className={({ active }) =>
                    `cursor-default flex justify-start space-x-2 relative w-full py-2 pl-3 text-left items-center ${
                      active ? "text-white bg-secondary" : ""
                    }`
                  }
                  value={chain}
                >
                  {({ selected }) => {
                    return (
                      <>
                        {showNetworkIcon && <ChainAndLogo chain={chain} />}
                        {showNetworkName && (
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {chain.chainName}
                          </span>
                        )}
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600"></span>
                        ) : null}
                      </>
                    );
                  }}
                </NetworkSwitcher.Option>
              ))}
            </NetworkSwitcher.Options>
          </div>
        )}
      </NetworkSwitcher>
    </div>
  );
};

const SkeletonUI = () => {
  return (
    <AnimatePresence>
      <motion.section exit={{ opacity: 0 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative overflow-hidden"
        >
          <div className="w-60 h-10 bg-gray-200 rounded-lg shadow-md"></div>
          <motion.div
            initial={{ x: -200 }}
            animate={{ x: 400 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            className="absolute bg-primary bg-opacity-20 top-0 rotate-12 left-0 w-[30%] h-full"
          ></motion.div>
        </motion.div>
      </motion.section>
    </AnimatePresence>
  );
};