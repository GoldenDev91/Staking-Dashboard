/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { SSL_ADDR, SSL_LOCK } from "../abis/address";
import TokenABI from "../abis/GroveToken.json";
import LockABI from "../abis/LockABI.json";
import { useAddress, useWeb3Context } from "../context/web3Context";
import { multicall } from "../utils/contracts";
import { WORKING_NETWORK_ID } from "./../abis/address";

const defaultVal = {
  lockinfo: {},
  lockallow: false,
  accountlockinfo: {},
  accounthistory: [],
  fetchLockData: () => {},
  fetchAccountLockData: () => {},
  fetchAccountHistory: () => {},
  fetchAllowance: () => {},
};

export const LockInfoContext = React.createContext(defaultVal);

export default function useLockInfo() {
  return React.useContext(LockInfoContext);
}
let timerid = null,
  historyTimer = null,
  lockid = null;
export function LockInfoProvider({ children }) {
  const account = useAddress();
  const [lockinfo, setLockInfo] = useState({});
  const [accountlockinfo, setAccountLockInfo] = useState({});
  const [accounthistory, setAccountHistory] = useState({});
  const [lockallow, setLockAllow] = useState(false);

  const { chainID } = useWeb3Context();

  async function fetchLockData() {
    try {
      let calls = [
        {
          address: SSL_LOCK[chainID],
          name: "totalStaked",
          params: [],
        },
        {
          address: SSL_LOCK[chainID],
          name: "interest",
          params: [],
        },
        {
          address: SSL_LOCK[chainID],
          name: "fee",
          params: [],
        },
      ];

      const result = await multicall(LockABI, calls, chainID);
      console.log(result);
      const temp = {
        totalStaked: result[0],
        interest: result[1],
        fee: result[2],
      };
      setLockInfo(temp);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAccountLockData() {
    try {
      let calls = [
        {
          address: SSL_LOCK[chainID],
          name: "balances",
          params: [account],
        },
        {
          address: SSL_LOCK[chainID],
          name: "emissions",
          params: [account],
        },
        {
          address: SSL_LOCK[chainID],
          name: "maxIds",
          params: [account],
        },
        {
          address: SSL_LOCK[chainID],
          name: "depositDates",
          params: [account],
        },
        // {
        //   address: SSL_LOCK[chainID],
        //   name: "stakeInfos",
        //   params: [account],
        // },
      ];

      const result = await multicall(LockABI, calls, chainID);
      console.log(result);
      const temp = {
        balance: result[0][0],
        emission: result[1][0],
        maxId: result[2][0],
        depositDate: result[3][0],
      };
      console.log("acountlockinfo", temp);
      setAccountLockInfo(temp);
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchAccountHistory() {
    try {
      if (accountlockinfo.maxId === 0) return;
      let calls = [];
      for (let i = 0; i < accountlockinfo.maxId; i++) {
        calls[i] = {
          address: SSL_LOCK[chainID],
          name: "stakeInfos",
          params: [account, i],
        };
      }

      const result = await multicall(LockABI, calls, chainID);
      const tmp = [];
      for (let i = 0; i < accountlockinfo.maxId; i++) {
        tmp[i] = {
          amount: result[i][0],
          timestamp: result[i][1],
          isDeposit: result[i][2],
        };
      }
      console.log("accounthistory", tmp);
      setAccountHistory(tmp);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchAllowance() {
    try {
      let calls = [
        {
          name: "allowance",
          address: SSL_ADDR[chainID],
          params: [account, SSL_LOCK[chainID]],
        },
      ];
      const result = await multicall(TokenABI, calls, chainID);
      setLockAllow(result[0][0] > ethers.utils.parseUnits("10000", 4));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (chainID !== WORKING_NETWORK_ID) return;
    fetchLockData();
    if (lockid) clearInterval(lockid);
    lockid = setInterval(() => {
      fetchLockData();
    }, 20000);
  }, [chainID]);

  useEffect(() => {
    if (chainID !== WORKING_NETWORK_ID) return;
    if (!account) return;
    fetchAccountLockData();
    fetchAllowance();
    if (timerid) clearInterval(timerid);
    timerid = setInterval(() => {
      fetchAccountLockData();
      fetchAllowance();
    }, 20000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainID]);

  useEffect(() => {
    if (chainID !== WORKING_NETWORK_ID) return;
    if (!account) return;
    fetchAccountHistory();
    if (historyTimer) clearInterval(historyTimer);
    historyTimer = setInterval(() => {
      fetchAccountHistory();
    }, 20000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, accountlockinfo.maxId]);

  return (
    <LockInfoContext.Provider
      value={{
        lockinfo: lockinfo,
        lockallow,
        accountlockinfo: accountlockinfo,
        accounthistory: accounthistory,
        fetchLockData,
        fetchAccountLockData,
        fetchAccountHistory,
        fetchAllowance,
      }}
      children={children}
    />
  );
}
