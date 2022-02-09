import { InjectedConnector } from "@web3-react/injected-connector";
import { SafeAppConnector } from "@gnosis.pm/safe-apps-web3-react";
import { WalletConnectConnector } from "./walletConnect";
import { Web3Provider } from "@ethersproject/providers";
import { NetworkConnector } from "@web3-react/network-connector";

export const RPC_URLS = [
  "https://mainnet.infura.io/v3/9ee4b6a28d1c4016981930ed7a8d7122",
  "https://rpc.ftm.tools/",
];

export const network = new NetworkConnector({
  urls: {
    1: RPC_URLS[0],
    250: RPC_URLS[1],
  },
  defaultChainId: 250,
});

export const injected = new InjectedConnector({
  supportedChainIds: [1, 250],
});

export default function getLibrary(provider: any): Web3Provider {
  /**
   * Pass in the root of the application to make the Web3-react
   * hook available to the application
   */
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === "number"
      ? provider.chainId
      : typeof provider.chainId === "string"
      ? parseInt(provider.chainId)
      : "any"
  );
  library.pollingInterval = 12000;
  return library;
}

export const gnosisSafe = new SafeAppConnector();

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
  },
  chainId: 1,
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});