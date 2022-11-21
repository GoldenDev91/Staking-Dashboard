/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Box, useMediaQuery, Skeleton } from "@mui/material";
import { ethers } from "ethers";
import {
  AiOutlineCalculator,
  AiFillCaretDown,
  AiFillCaretUp,
} from "react-icons/ai";
import styled from "styled-components";

import { SSL_LOCK } from "../../abis/address";
import Button from "../../components/Button";
import ROIModal from "../../components/ROIModal";
import StakingModal from "../../components/StakingModal";
import { useAddress } from "../../context/web3Context";
import { useWeb3Context } from "../../context/web3Context";
import useLockInfo from "../../hooks/useLockInfo";
import useTokenInfo from "../../hooks/useTokenInfo";
import { getLockContract, getTokenContract } from "../../utils/contracts";
import { figureError } from "../../utils/functions";
import { numberWithCommas } from "../../utils/functions";
import { FaExternalLinkAlt } from "react-icons/fa";

// const lockcompound = [
//   [38.65 / 32.69, 38.53 / 32.69, 38.39 / 32.69, 38.07 / 32.69],
//   [55.75 / 44.33, 55.5 / 44.33, 55.21 / 44.33, 54.56 / 44.33],
//   [64.84 / 50.01, 64.5 / 50.01, 64.11 / 50.01, 63.25 / 50.01],
//   [67.6 / 51.68, 67.24 / 51.68, 66.82 / 51.68, 65.88 / 51.68],
// ];

const Dashboard = ({ setNotification }) => {
  const {
    lockinfo,
    lockallow,
    accountlockinfo,
    fetchAccountLockData,
    fetchLockData,
    fetchAllowance,
  } = useLockInfo();

  const { price, balance, fetchAccountTokenInfo } = useTokenInfo();

  const { connect, provider, chainID } = useWeb3Context();

  const account = useAddress();

  const [pending, setPending] = useState(false);
  const [maxpressed, setMaxPressed] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [activeDay, setActiveDay] = useState(0);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const onApproveContract = async (type, address) => {
    setPending(true);
    try {
      const tokenContract = getTokenContract(chainID, provider.getSigner());
      const estimateGas = await tokenContract.estimateGas.approve(
        SSL_LOCK[chainID],
        maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18)
      );
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approvetx = await tokenContract.approve(
        SSL_LOCK[chainID],
        maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18),
        tx
      );
      await approvetx.wait();
      fetchAllowance();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onDeposit = async () => {
    setPending(true);
    try {
      let ttx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());

        const estimateGas = await LockContract.estimateGas.deposit(
          maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18)
        );
        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await LockContract.deposit(
          maxpressed ? balance : ethers.utils.parseUnits(depositAmount, 18),
          tx
        );
      }

      await ttx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  const onWithdraw = async () => {
    setPending(true);
    console.log(accountlockinfo);
    try {
      let ttx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());

        estimateGas = await LockContract.estimateGas.withdraw(
          maxpressed
            ? accountlockinfo.balance
            : ethers.utils.parseUnits(withdrawAmount, 18)
        );

        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        ttx = await LockContract.withdraw(
          maxpressed
            ? accountlockinfo.balance
            : ethers.utils.parseUnits(withdrawAmount, 18),
          tx
        );
      }

      await ttx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  // const onCompoundReward = async (i) => {
  //   setPending(true);
  //   try {
  //     let harvestTx, estimateGas;
  //     console.log(lockinfo, i);

  //     {
  //       const LockContract = getLockContract(chainID, provider.getSigner());
  //       estimateGas = await LockContract.estimateGas.compoundReward(i, {
  //         value: lockinfo[i].performanceFee,
  //       });
  //       console.log(estimateGas.toString(), "Lock", i);
  //       const tx = {
  //         gasLimit: Math.ceil(estimateGas.toString() * 1.2),
  //         value: lockinfo[i].performanceFee,
  //       };
  //       harvestTx = await LockContract.compoundReward(i, tx);
  //     }
  //     await harvestTx.wait();
  //     fetchAccountLockData();
  //     fetchLockData();
  //   } catch (error) {
  //     console.log(error);
  //     figureError(error, setNotification);
  //   }
  //   setPending(false);
  // };

  // const onCompoundReflection = async (i) => {
  //   setPending(true);
  //   try {
  //     let harvestTx, estimateGas;
  //     {
  //       const LockContract = getLockContract(chainID, provider.getSigner());
  //       estimateGas = await LockContract.estimateGas.compoundDividend(i, {
  //         value: lockinfo[i].performanceFee,
  //       });
  //       console.log(estimateGas.toString(), "Lock", i);
  //       const tx = {
  //         gasLimit: Math.ceil(estimateGas.toString() * 1.2),
  //         value: lockinfo[i].performanceFee,
  //       };
  //       harvestTx = await LockContract.compoundDividend(i, tx);
  //     }
  //     await harvestTx.wait();
  //     fetchAccountLockData();
  //     fetchLockData();
  //   } catch (error) {
  //     console.log(error);
  //     figureError(error, setNotification);
  //   }
  //   setPending(false);
  // };

  const onHarvestReward = async () => {
    setPending(true);
    try {
      let harvestTx, estimateGas;
      {
        const LockContract = getLockContract(chainID, provider.getSigner());
        let i = 0;
        estimateGas = await LockContract.estimateGas.claim();
        const tx = {
          gasLimit: Math.ceil(estimateGas.toString() * 1.2),
        };
        harvestTx = await LockContract.claim(tx);
      }
      await harvestTx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error, setNotification);
    }
    setPending(false);
  };

  // const onHarvestReflection = async (i) => {
  //   setPending(true);
  //   try {
  //     let harvestTx, estimateGas;
  //     {
  //       const LockContract = getLockContract(chainID, provider.getSigner());
  //       estimateGas = await LockContract.estimateGas.claimDividend(i, {
  //         value: lockinfo[i].performanceFee,
  //       });
  //       console.log(estimateGas.toString(), "Lock", i);
  //       const tx = {
  //         gasLimit: Math.ceil(estimateGas.toString() * 1.2),
  //         value: lockinfo[i].performanceFee,
  //       };
  //       harvestTx = await LockContract.claimDividend(i, tx);
  //     }
  //     await harvestTx.wait();
  //     fetchAccountLockData();
  //     fetchLockData();
  //   } catch (error) {
  //     console.log(error);
  //     figureError(error, setNotification);
  //   }
  //   setPending(false);
  // };

  // const days = ["7 Days", "30 Days", "90 Days", "180 Days"];
  // const infos = [
  //   {
  //     text: "Lock Period",
  //     value: `${lockinfo[activeDay].duration} days`,
  //   },
  //   {
  //     text: "Deposit Fee",
  //     value: `${Number(lockinfo[activeDay].depositFee).toFixed(2)}%`,
  //   },
  //   {
  //     text: "Withdraw Fee",
  //     value: `${Number(lockinfo[activeDay].withdrawFee).toFixed(2)}%`,
  //   },
  //   {
  //     text: "Total Staked Amount",
  //     value: `${Number(lockinfo[activeDay].totalStaked).toFixed(2)}`,
  //   },
  // ];

  const sm = useMediaQuery("(max-width : 500px)");
  const xs = useMediaQuery("(max-width : 450px)");

  return (
    <StyledContainer>
      <Box>
        <Panel maxWidth={"650px"}>
          <Box fontSize={"32px"} fontWeight={"600"}>
            STAKE AND EARN
          </Box>

          <Box color={"#9ca0d2"} mt={"16px"}>
            Staking is a way of earning rewards for holding certain
            cryptocurrencies. The reason your crypto earns rewards while staked
            is because the blockchain puts it to work. Cryptocurrencies that
            allow staking use a “consensus mechanism” called Proof of Stake,
            which is the way they ensure that all transactions are verified and
            secured without a bank or payment processor in the middle. Your
            crypto, if you choose to stake it, becomes part of that process.
          </Box>
          <Box mt={"16px"} fontWeight={"bold"} color={"#ece0e2"}>
            *No claim restriction.
          </Box>
          <Box mt={"16px"} color={"#ece0e2"}>
            <Box display={"flex"} alignItems={"center"}>
              <Box>Smart Contract: 0xf3F0...C0fC</Box>
              <Box ml="10px">
                <a href="https://testnet.bscscan.com/address/0xf3F0cB29eCDAE58C9975f537400ed08fD0e0C0fC">
                  <FaExternalLinkAlt></FaExternalLinkAlt>
                </a>
              </Box>
            </Box>
          </Box>
        </Panel>
        <Box maxWidth={"450px"} width={"100%"}>
          <Panel my={"24px"}>
            <RewardPanel>
              <Box>
                <Box fontWeight={"500"}>Total Tokens Staked </Box>
                <Box
                  fontWeight={"bold"}
                  fontSize={"32px"}
                  color={"white"}
                  lineHeight={"130%"}
                >
                  {!account ? (
                    "0.000000"
                  ) : lockinfo.totalStaked !== undefined ? (
                    (lockinfo.totalStaked / Math.pow(10, 18)).toFixed(6)
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"100px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
                <Box fontWeight={"600"} mt={"3px"}>
                  {" "}
                  {!account ? (
                    "$0.000"
                  ) : lockinfo.totalStaked !== undefined ? (
                    `$${(
                      (lockinfo.totalStaked * price) /
                      Math.pow(10, 18)
                    ).toFixed(6)}`
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"80px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              </Box>
            </RewardPanel>
          </Panel>
          {/* <Panel my={"24px"}>
            <RewardPanel>
              <Box>
                <Box fontWeight={"500"}>ERC20 Reflected </Box>
                <Box
                  fontWeight={"bold"}
                  fontSize={"32px"}
                  color={"white"}
                  lineHeight={"130%"}
                >
                  {!account ? (
                    "0.000000"
                  ) : accountlockinfo[activeDay].pendingDividends !==
                    undefined ? (
                    accountlockinfo[activeDay].pendingDividends.toFixed(3)
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"100px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
                <Box fontWeight={"600"} mt={"3px"}>
                  {" "}
                  {!account ? (
                    "$0.000"
                  ) : accountlockinfo[activeDay].pendingDividends !==
                    undefined ? (
                    `$${(
                      accountlockinfo[activeDay].pendingDividends * price
                    ).toFixed(3)}`
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"80px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              </Box>
              <Box>
                <Button
                  type={"secondary"}
                  width={"120px"}
                  height={"40px"}
                  fontSize={"14px"}
                  disabled={
                    pending ||
                    !Number(accountlockinfo[activeDay].pendingDividends)
                  }
                  onClick={() => onHarvestReflection(activeDay)}
                >
                  Harvest
                </Button>
                <Box mb={"8px"} />
                <Button
                  type={"secondary"}
                  width={"120px"}
                  height={"40px"}
                  fontSize={"14px"}
                  disabled={
                    pending ||
                    !Number(accountlockinfo[activeDay].pendingDividends)
                  }
                  onClick={() => onCompoundReflection(activeDay)}
                >
                  Compound
                </Button>
              </Box>
            </RewardPanel>
          </Panel> */}
          <Panel my={"24px"}>
            <Box fontWeight={"500"} color={"#9ca0d2"}>
              APY{" "}
            </Box>
            <Box
              fontWeight={"bold"}
              fontSize={"32px"}
              color={"white"}
              lineHeight={"130%"}
            >
              {!account ? (
                "0.000000"
              ) : lockinfo.totalStaked !== undefined ? (
                (lockinfo.interest / Math.pow(10, 16)).toFixed(2) + "%"
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
            <Box fontWeight={"600"} mt={"3px"} color={"#9ca0d2"}>
              {"You can stake and withdraw anytime."}
            </Box>
          </Panel>
        </Box>
      </Box>
    </StyledContainer>
  );
};

const RewardPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #9ca0d2;
`;

const InputField = styled(Box)`
  display: flex;
  > input {
    background: transparent;
    border: none;
    width: calc(100% - 64px);
    font-family: "Poppins";
    padding: 11px 16px;
  }
  border: 2px solid #9ca0d2;
  border-radius: 10px;
  overflow: hidden;
  width: 100%;
  max-width: 384px;
  margin-right: 16px;
  height: 50px;
  :focus-within {
    border-color: white;
  }
`;

const InputPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    > div {
      max-width: 100%;
      margin: 0;
    }
    > button {
      margin-top: 8px;
      width: 100%;
    }
  }
`;

const InfoPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #9ca0d2;
  > div:nth-child(1) > div {
    display: flex;
    margin: 0.5rem 0;
    font-size: 16px;
  }
  @media screen and (max-width: 550px) {
    flex-direction: column;
    align-items: unset;
    > div:nth-child(2) {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      > div:nth-child(2) {
        margin-right: 16px;
      }
    }
  }
`;

const ButtonGroup = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin: 24px 0;
  > button {
    margin: 0.25rem 0.5rem 0.25rem 0;
    font-size: 15px;
    font-weight: 500;
    background-color: #2c2f4c;
    color: white !important;
    border: 0;import { useEffect } from 'react';
import { useEffect } from 'react';

    border-radius: 10px;
    :hover:not([disabled]) {
      background: #0047ffb2;
    }
    transition: all 0.3s;
    padding: 12px 24px;
  }
  > button:nth-child(${({ active }) => active}) {
    background: #0047ff;
    :hover {
      :hover:not([disabled]) {
        background: #0047ff;
      }
    }
  }
`;

const Panel = styled(Box)`
  padding: 3rem;
  border-radius: 2rem;
  background: #16182d;
  width: 100%;
  @media screen and (max-width: 615px) {
    padding: 2rem 1.5rem;
  }
`;

const StyledContainer = styled(Box)`
  display: flex;
  padding: 150px 12px 50px 12px;
  justify-content: center;
  > div {
    display: flex;
    width: 100%;
    max-width: 1130px;
    justify-content: space-between;
    @media screen and (max-width: 1150px) {
      flex-direction: column;
      align-items: center;
      > div:nth-child(1) {
        margin-bottom: 24px;
      }
      > div:nth-child(2) {
        max-width: 650px;
      }
    }
  }
`;

export default Dashboard;
