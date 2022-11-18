/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { useWeb3Context, useAddress } from "../context/web3Context";
import { getPairContract, getTokenContract } from "../utils/contracts";
import axios from "axios";

const defaultVal = {
  price: 0,
  balance: 0,
  fetchPrice: () => {},
  fetchAccountTokenInfo: () => {},
};

export const TokenInfoContext = React.createContext(defaultVal);

export default function useTokenInfo() {
  return React.useContext(TokenInfoContext);
}

let timerid = null;

export function TokenInfoProvider({ children }) {
  const account = useAddress();
  const { chainID } = useWeb3Context();
  const [price, setPrice] = useState(0);
  const [balance, setBalance] = useState(0);

  async function fetchPrice() {
    try {
      // let result = await axios.get(
      //   `https://api.pancakeswap.info/api/v2/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56`
      // );
      // result = result.data.data;
      // const _ethPrice = result.price / result.price_BNB;
      // const pairContract = getPairContract(WORKING_NETWORK_ID);
      // const reserves = await pairContract.getReserves();
      // const price =
      //   (reserves[1] * Number(_ethPrice)) / reserves[0] / Math.pow(10, 18);
      setPrice(0);
      console.log(price);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAccountTokenInfo() {
    try {
      const tokenContract = getTokenContract(chainID);
      const _balance = await tokenContract.balanceOf(account);
      setBalance(_balance);
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    // if (!(chainID === 1 || chainID === 56)) return;
    // fetchData();
    // if (dataid) clearInterval(dataid);
    // dataid = setInterval(() => {
    //   fetchData();
    // }, 60000);
  }, [chainID]);

  useEffect(() => {
    if (!account) return;
    fetchAccountTokenInfo();
    fetchPrice();
    if (timerid) clearInterval(timerid);
    timerid = setInterval(() => {
      fetchAccountTokenInfo();
      fetchPrice();
    }, 20000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainID]);

  return (
    <TokenInfoContext.Provider
      value={{
        price,
        balance,
        fetchPrice,
        fetchAccountTokenInfo,
      }}
      children={children}
    />
  );
}
