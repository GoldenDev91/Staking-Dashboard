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
import ConnectMenu from "../../components/TopBar/ConnectMenu";
import { useEffect } from "react";
import { fontSize } from "@mui/system";

const Home = ({ setNotification }) => {
  const {
    lockinfo,
    lockallow,
    accountlockinfo,
    accounthistory,
    fetchAccountLockData,
    fetchLockData,
    fetchAllowance,
    fetchAccountHistory,
  } = useLockInfo();

  const { price, balance, fetchAccountTokenInfo } = useTokenInfo();

  const { connect, provider, chainID } = useWeb3Context();

  const account = useAddress();

  const [pending, setPending] = useState(false);
  const [maxpressed, setMaxPressed] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [activeDay, setActiveDay] = useState(0);

  const [claimable, setClaimable] = useState(0);

  const calcClaimable = () => {
    if (accountlockinfo.depositDate === undefined) return;
    const timePassed = Date.now() / 1000 - accountlockinfo.depositDate;
    const claim =
      (accountlockinfo.balance * lockinfo.interest * timePassed) /
      365 /
      86400 /
      Math.pow(10, 18);
    if (!isNaN(claim) && claim > 0) setClaimable(claim);
  };

  useEffect(
    () => calcClaimable(),
    [accountlockinfo, accountlockinfo.depositDate]
  );

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
    setClaimable(0);
    accountlockinfo.depositDate = Date.now() + 30000;
  };

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

  const sm = useMediaQuery("(max-width : 500px)");
  const xs = useMediaQuery("(max-width : 450px)");
  const mw950 = useMediaQuery("(max-width : 950px)");
  const mw650 = useMediaQuery("(max-width : 650px)");
  const mw1150 = useMediaQuery("(max-width : 1150px)");

  return (
    <StyledContainer>
      <Background position={"fixed"}></Background>
      <HomeTopBar position={"relative"}>
        <Box display={"flex"} alignItems={"center"}>
          <LogoSVG />
          <Box
            ml={mw950 ? "0px" : mw1150 ? "10px" : "20px"}
            fontSize={mw650 ? "20px" : mw950 ? "28px" : "36px"}
            fontWeight="800"
            textAlign={"center"}
            width={mw950 ? "min-content" : "fit-content"}
          >
            TRUMP & WORLDCUP
          </Box>
        </Box>
        <ConnectMenu setNotification={setNotification} />
      </HomeTopBar>

      <Mainpage
        fontFamily={"Montserrat,sans-serif"}
        gap={"20px"}
        position={"relative"}
      >
        <RowLayout width={"100%"} gap={"20px"}>
          <Panel>
            <Box fontSize={"12px"} color={"#CCC"}>
              Holder Amount staked
            </Box>
            <RowLayout
              fontSize={"25px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              <LogoSVG width={"30px"} height={"30px"} mr={"10px"}></LogoSVG>
              $TWC
            </RowLayout>
            <Box fontSize={"25px"} fontWeight={"800"}>
              {!account ? (
                "0.0000000000"
              ) : accountlockinfo.balance !== undefined ? (
                (accountlockinfo.balance / Math.pow(10, 18)).toFixed(10)
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
            <Box fontSize={"12px"} color={"#CCC"}>
              {!account ? (
                "USDT Value: $0.00"
              ) : accountlockinfo.balance !== undefined ? (
                `USDT Value: $${(
                  (accountlockinfo.balance / Math.pow(10, 18)) *
                  price
                ).toFixed(2)}`
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"80px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
          </Panel>
          <Panel>
            <Box fontSize={"12px"} color={"#CCC"}>
              Holder Amount Earned
            </Box>
            <RowLayout
              fontSize={"25px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              <LogoSVG width={"30px"} height={"30px"} mr={"10px"}></LogoSVG>
              $TWC
            </RowLayout>
            <Box fontSize={"25px"} fontWeight={"800"}>
              {!account ? (
                "0.0000000000"
              ) : accountlockinfo.emission !== undefined ? (
                (accountlockinfo.emission / Math.pow(10, 18)).toFixed(10)
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
            <Box fontSize={"12px"} color={"#CCC"}>
              {!account ? (
                "USDT Value: $0.00"
              ) : accountlockinfo.emission !== undefined ? (
                `USDT Value: $${(
                  (accountlockinfo.emission / Math.pow(10, 18)) *
                  price
                ).toFixed(2)}`
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"80px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
          </Panel>
          <Panel>
            <Box fontSize={"12px"} color={"#CCC"}>
              Claimable (estimated)
            </Box>
            <RowLayout
              fontSize={"25px"}
              fontWeight={"800"}
              display={"flex"}
              justifyContent={"flex-start"}
            >
              <LogoSVG width={"30px"} height={"30px"} mr={"10px"}></LogoSVG>
              $TWC
            </RowLayout>
            <Box fontSize={"25px"} fontWeight={"800"}>
              {!account ? (
                "0.0000000000"
              ) : accountlockinfo.depositDate !== undefined ? (
                (claimable / Math.pow(10, 18)).toFixed(10)
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"100px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
            <Box fontSize={"12px"} color={"#CCC"}>
              {!account ? (
                "USDT Value: $0.0000000000"
              ) : accountlockinfo.depositDate !== undefined ? (
                `USDT Value: $${(
                  (claimable * price) /
                  Math.pow(10, 18)
                ).toFixed(2)}`
              ) : (
                <Skeleton
                  variant={"text"}
                  width={"80px"}
                  style={{ transform: "unset" }}
                />
              )}
            </Box>
          </Panel>
        </RowLayout>
        <RowLayout alignItems={"unset"}>
          <Panel flex={"1 0 0"}>
            <RowLayout justifyContent={"space-between"}>
              <Box fontSize={"30px"} fontWeight={"800"}>
                Stake
              </Box>
              <RowLayout>
                <Box fontSize={"14px"}>Balance:</Box>
                <Box ml={"10px"}>
                  {!account ? (
                    "0.000000"
                  ) : accountlockinfo.balance !== undefined ? (
                    (balance / Math.pow(10, 18)).toFixed(6)
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={"100px"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              </RowLayout>
            </RowLayout>
            <Box
              width={"100%"}
              backgroundColor={"white"}
              height={"4px"}
              my={"15px"}
            ></Box>
            <Box my={"24px"}>
              <InputPanel>
                <InputField>
                  <input
                    type={"text"}
                    placeholder={"0.00"}
                    value={depositAmount}
                    onChange={(e) => {
                      setMaxPressed(false);
                      setDepositAmount(e.target.value);
                    }}
                  />
                  <Button
                    type={"max"}
                    width={"64px"}
                    height={"46px"}
                    onClick={() => {
                      setDepositAmount((balance / Math.pow(10, 18)).toFixed(6));
                      setMaxPressed(true);
                    }}
                  >
                    Max
                  </Button>
                </InputField>
                {lockallow ? (
                  <Button
                    type={"primary"}
                    width={sm ? "100%" : "143px"}
                    height={"50px"}
                    disabled={
                      pending || !Number(balance) || !Number(depositAmount)
                    }
                    onClick={() => onDeposit()}
                  >
                    DEPOSIT
                  </Button>
                ) : (
                  <Button
                    type={"primary"}
                    width={sm ? "100%" : "143px"}
                    height={"50px"}
                    disabled={pending}
                    onClick={() => {
                      !account ? onConnect() : onApproveContract();
                    }}
                  >
                    {!account ? "Connect" : "Approve"}
                  </Button>
                )}
              </InputPanel>
              <InputPanel mt={"16px"}>
                <InputField>
                  <input
                    type={"text"}
                    placeholder={"0.00"}
                    value={withdrawAmount}
                    onChange={(e) => {
                      setMaxPressed(false);
                      setWithdrawAmount(e.target.value);
                    }}
                  />
                  <Button
                    type={"max"}
                    width={"64px"}
                    height={"46px"}
                    onClick={() => {
                      setMaxPressed(true);
                      setWithdrawAmount(
                        (accountlockinfo.balance / Math.pow(10, 18)).toFixed(6)
                      );
                    }}
                  >
                    Max
                  </Button>
                </InputField>
                <Button
                  type={"primary"}
                  width={sm ? "100%" : "143px"}
                  height={"50px"}
                  disabled={
                    pending ||
                    !Number(accountlockinfo.balance) ||
                    !Number(withdrawAmount)
                  }
                  onClick={() => onWithdraw()}
                >
                  WITHDRAW
                </Button>
              </InputPanel>
            </Box>
            {true || Number(accountlockinfo.balance) ? (
              <Button
                type={"secondary"}
                width={"100%"}
                height={"50px"}
                disabled={pending || !Number(accountlockinfo.balance)}
                onClick={() => onHarvestReward()}
              >
                CLAIM REWARDS
              </Button>
            ) : (
              ""
            )}
          </Panel>
          <ColumnLayout flex={"1 0 0"} width={"100%"}>
            <Panel>
              <Box fontSize={"20px"} color={"#fff"} fontWeight={"600"}>
                Total $TWC Staked By All Holders
              </Box>
              <RowLayout
                fontSize={"32px"}
                fontWeight={"800"}
                display={"flex"}
                justifyContent={"flex-start"}
              >
                <LogoSVG width={"30px"} height={"30px"} mr={"10px"}></LogoSVG>
                {!lockinfo ? (
                  "0.0000000000"
                ) : lockinfo.totalStaked !== undefined ? (
                  (lockinfo.totalStaked / Math.pow(10, 18)).toFixed(6)
                ) : (
                  <Skeleton
                    variant={"text"}
                    width={"100px"}
                    style={{ transform: "unset" }}
                  />
                )}
              </RowLayout>
              <Box fontSize={"12px"} color={"#CCC"}>
                {!lockinfo ? (
                  "USDT Value: $0.0000000000"
                ) : lockinfo.totalStaked !== undefined ? (
                  `USDT Value: $${(
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
            </Panel>
            <Panel color={"#EEE"}>
              <RowLayout justifyContent={"space-between"}>
                <Box fontSize={"20px"}>$TWC</Box>
                <Box fontSize={"15px"}>
                  <a href="https://testnet.bscscan.com/address/0x959719Be58e4B18d4C650C0D265cE08846501C91">
                    <RowLayout>
                      View on Etherscan
                      <FaExternalLinkAlt></FaExternalLinkAlt>
                    </RowLayout>
                  </a>
                </Box>
              </RowLayout>
              <RowLayout justifyContent={"space-between"}>
                <Box fontSize={"20px"}>Staking</Box>
                <Box fontSize={"15px"}>
                  <a href="https://testnet.bscscan.com/address/0xf3F0cB29eCDAE58C9975f537400ed08fD0e0C0fC">
                    <RowLayout>
                      View on Etherscan
                      <FaExternalLinkAlt></FaExternalLinkAlt>
                    </RowLayout>
                  </a>
                </Box>
              </RowLayout>
              <Box fontSize={"20px"} fontWeight={"800"}>
                <RowLayout justifyContent={"space-between"}>
                  <Box>$TWC APR</Box>
                  <Box
                    fontSize={"18px"}
                    color={"#00FF31"}
                    // border={"1px #eaaf0e solid"}
                    // borderBottom={"0"}
                    borderRadius={"10px"}
                    boxShadow={
                      "#eaaf0e 0px -1px 0px, #eaaf0e -1px -2px 0px, #eaaf0e 1px -2px 0px"
                    }
                    padding={"4px"}
                  >
                    {!lockinfo ? (
                      "0.00%"
                    ) : lockinfo.totalStaked !== undefined ? (
                      (lockinfo.interest / Math.pow(10, 16)).toFixed(2) + "%"
                    ) : (
                      <Skeleton
                        variant={"text"}
                        width={"70px"}
                        style={{ transform: "unset" }}
                      />
                    )}
                  </Box>
                </RowLayout>
              </Box>
            </Panel>
          </ColumnLayout>
        </RowLayout>
      </Mainpage>

      <ColumnLayout
        zIndex={3}
        position={"relative"}
        alignSelf={"center"}
        mt={"50px"}
      >
        <Label>History</Label>
        <ColumnLayout maxWidth={mw1150 ? "650px" : "1130px"} width={"98%"}>
          {!sm ? (
            <GTableHead>
              {/* <StyledCheckbox flex={"1 0 0"}></StyledCheckbox> */}
              <GTableHeadItem flex={"2 0 0"}>#</GTableHeadItem>
              <GTableHeadItem flex={"3 0 0"}>Date</GTableHeadItem>
              <GTableHeadItem flex={"2 0 0"}>Amount</GTableHeadItem>
              <GTableHeadItem flex={"2 0 0"}>Action</GTableHeadItem>
            </GTableHead>
          ) : (
            ""
          )}
          {account ? (
            accounthistory &&
            Array.isArray(accounthistory) &&
            accounthistory.length ? (
              accounthistory.map((history, idx) => (
                <GTableRow key={"idx"}>
                  {/* <StyledCheckbox flex={"1 0 0"}></StyledCheckbox> */}
                  <GTableRowItem flex={"1 0 0"} color={"#E2E2EA"}>
                    {sm ? "#" + (idx + 1) : idx + 1}
                  </GTableRowItem>
                  <GTableRowItem flex={"3 0 0"} whiteSpace={"nowrap"}>
                    {new Date(history.timestamp * 1000).toLocaleString()}
                  </GTableRowItem>
                  <GTableRowItem
                    flex={"2 0 0"}
                    dotafter={history.isDeposit ? "blue" : "red"}
                    whiteSpace={"nowrap"}
                  >
                    {(history.amount / Math.pow(10, 18)).toFixed(6)}
                  </GTableRowItem>
                  <GTableRowItem flex={"2 0 0"}>
                    {history.isDeposit ? "Deposit" : "Withdraw"}
                  </GTableRowItem>
                  {/* <GTableRowItem flex={"2 0 0"} color={"#89F8FF"}>
                Success
              </GTableRowItem>
              <GTableRowItem flex={"2 0 0"}>0x234...c03</GTableRowItem>
              <GTableRowItem flex={"0.5 0 0"} alignSelf={"flex-end"}>
                <RowLayout justifyContent={"space-between"}>
                  <Box />
                </RowLayout>
              </GTableRowItem> */}
                </GTableRow>
              ))
            ) : (
              [1, 2, 3, 4, 5].map((history, idx) => (
                <GTableRow>
                  {/* <StyledCheckbox flex={"1 0 0"}></StyledCheckbox> */}
                  <GTableRowItem flex={"1 0 0"} color={"#E2E2EA"}>
                    <Skeleton />
                  </GTableRowItem>
                  <GTableRowItem flex={"3 0 0"} whiteSpace={"nowrap"}>
                    <Skeleton />
                  </GTableRowItem>
                  <GTableRowItem flex={"2 0 0"}>
                    <Skeleton />
                  </GTableRowItem>
                  <GTableRowItem flex={"2 0 0"}>
                    <Skeleton />
                  </GTableRowItem>
                </GTableRow>
              ))
            )
          ) : (
            <Box m={"30px"} fontSize={"20px"} textAlign={"center"}>
              There is no record to show.
              <br /> Please connect wallet.
            </Box>
          )}
        </ColumnLayout>
      </ColumnLayout>
    </StyledContainer>
  );
};

const HomeTopBar = styled(Box)`
  padding: 36px 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  @media screen and (max-width: 1150px) {
    padding: 36px 60px;
  }
  @media screen and (max-width: 950px) {
    padding: 36px 20px;
  }
  @media screen and (max-width: 450px) {
    padding: 36px 10px;
  }
`;

const GTableHead = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #741e47;
  backdrop-filter: blur(3.5px);
  border-radius: 10px;
  width: 100%;
  justify-content: space-between;
  padding: 17.5px 19px;
  position: relative;
  z-index: 3;
  margin-bottom: 5px;
`;
const GTableHeadItem = styled(Box)`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0.103232px;
  color: #92929d;
`;

const GTableRow = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  /* background: rgba(11, 11, 16, 0.72); */
  /* background: rgba(21, 21, 33, 0.74); */
  //?background: #16182d;
  background: #ffffff0d;
  backdrop-filter: blur(3.5px);
  border-radius: 10px;
  padding: 16.5px 19px;
  position: relative;
  z-index: 3;
  width: 100%;
  justify-content: space-between;
  margin: 5.5px 0;
  > div:last-child {
    margin: 0 !important;
  }
`;
const GTableRowItem = styled(Box)`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 162%;
  letter-spacing: 0.103232px;
  color: #b5b5be;
  margin: 0 20px 0 0;
  /* padding: 0 20px; */
  ${(props) => {
    if (props.dotafter === "red")
      return "::after { content: ''; background-color: #ff5050; width: 10px; height: 10px; border: 0; border-radius: 10px; display: inline-block; margin-left: 10px; }";
    if (props.dotafter === "blue")
      return "::after { content: ''; background-color: #50b5ff; width: 10px; height: 10px; border: 0; border-radius: 10px; display: inline-block; margin-left: 10px; }";
  }}
`;

const Label = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 30px;

  color: #e5e5e5;
  margin: 0 0 37px 0;
  @media screen and (max-width: 700px) {
    margin-bottom: 20px;
  }
`;

const LogoSVG = styled(Box)`
  background: url("/logo.png");
  background-size: 100% 100%;
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media screen and (max-width: 650px) {
    background: url("/logo.png");
    background-size: 100% 100%;
    width: 60px;
    height: 60px;
  }
`;

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
    border: 0;import History from './../History/index';


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

const RowLayout = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ColumnLayout = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Mainpage = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 12px 12px;
  justify-content: center;
  align-items: center;
  > div {
    display: flex;
    width: 100%;
    max-width: 1130px;
    justify-content: space-between;
    @media screen and (max-width: 1150px) {
      flex-direction: column;
      align-items: center;
      > div:nth-child(1) {
        /* margin-bottom: 24px; */
      }
      > div {
        max-width: 650px;
      }
    }
  }
`;

const StyledContainer = styled(Box)`
  min-height: 100vh;
  width: 100vw;
  text-shadow: #741e47 0 0 6px;
`;

const Background = styled(Box)`
  width: 100vw;
  min-height: 100vh;
  background-image: url("/background.png");
  /* filter: blur(4px) grayscale(0); */
  /* filter: brightness(0.9); */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

const Panel = styled(Box)`
  padding: 3rem;
  border-radius: 2rem;
  //background: #16182ddd;
  /* background: #11364CD0; */
  //background: #56182dcc;
  background: #00000030;
  box-shadow: 0 -4px 0 0 #eee, 0 4px 0 0 #111;
  /* box-shadow:0 0 10px 4px #0000FF , 0 0 20px 30px #008000, 30px 0 20px 30px #FF1493, -30px -30px 20px 30px #FF4500; */
  width: 100%;
  @media screen and (max-width: 615px) {
    padding: 2rem 1.5rem;
  }
  margin: 20px;
  &:hover {
    transform: scale(1.05);
    /* transform: translate(0px, -20px); */
    /* animation-play-state: paused; */
  }
  transition: all 0.2s ease-out;
  /* animation: pulse 3s infinite;

@keyframes pulse {
  0% {
    transform: translate(0px, 0px);
  }

  50% {
    transform: translate(0px, -10px);
  }

  100% {
    transform: translate(0px, 0px);
  }
} */
`;

export default Home;
