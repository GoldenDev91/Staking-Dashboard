import { bridgeConfig } from "../config/networks";

export const getMediatorAddress = (chainId) => {
  if (!chainId) return null;
  const { homeChainId, homeMediatorAddress, foreignMediatorAddress } =
    bridgeConfig;
  return homeChainId === chainId
    ? homeMediatorAddress.toLowerCase()
    : foreignMediatorAddress.toLowerCase();
};
