import { ethers } from "ethers";
import { MULTICALL_ADDR, SSL_ADDR, SSL_LOCK, SSL_PAIR } from "../abis/address";
import MultiCallABI from "../abis/MultiCallABI.json";
import TokenABI from "../abis/GroveToken.json";
import LockABI from "../abis/LockABI.json";
import PancakePairABI from "../abis/PancakePairABI.json";

export const RPC_ENDPOINT = {
  1: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  5: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  56: "https://bsc-dataseed1.binance.org",
  97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
  5777: "HTTP://127.0.0.1:8545",
};

export const getContract = (abi, address, chainID, signer) => {
  const simpleRpcProvider = new ethers.providers.JsonRpcProvider(
    RPC_ENDPOINT[chainID]
  );
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const getTokenContract = (chainID, signer) => {
  return getContract(TokenABI, SSL_ADDR[chainID], chainID, signer);
};

export const getLockContract = (chainID, signer) => {
  return getContract(LockABI, SSL_LOCK[chainID], chainID, signer);
};

export const getPairContract = (chainID, signer) => {
  return getContract(PancakePairABI, SSL_PAIR[chainID], chainID, signer);
};

export const getMulticallContract = (chainID, signer) => {
  return getContract(MultiCallABI, MULTICALL_ADDR[chainID], chainID, signer);
};

export const multicall = async (abi, calls, chainID) => {
  try {
    const itf = new ethers.utils.Interface(abi);
    const multi = getMulticallContract(chainID);
    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);

    const { returnData } = await multi.aggregate(calldata);
    const res = returnData.map((call, i) =>
      itf.decodeFunctionResult(calls[i].name, call)
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};
