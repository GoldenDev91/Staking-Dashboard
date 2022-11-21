import { Box, useMediaQuery, Checkbox, Skeleton } from "@mui/material";

import styled from "styled-components";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useState, useEffect } from "react";
import useLockInfo from "../../hooks/useLockInfo";
import { useAddress } from "../../context/web3Context";
import { useWeb3Context } from "../../context/web3Context";

const History = () => {
  const {
    accountlockinfo,
    accounthistory,
    fetchAccountLockData,
    fetchAccountHistory,
  } = useLockInfo();
  const [detailopen, setDetailOpen] = useState([]);
  const account = useAddress();
  // useEffect(() => fetchAccountHistory(), [accountlockinfo.maxId]);

  const sm = useMediaQuery("(max-width : 575px)");
  return (
    <StyledContainer>
      <ColumnLayout zIndex={3} position={"relative"}>
        {/* <Label>
          History
        </Label> */}
        <ColumnLayout width="100%">
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
          {accounthistory &&
          Array.isArray(accounthistory) &&
          accounthistory.length
            ? accounthistory.map((history, idx) => (
                <GTableRow>
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
            : [1, 2, 3, 4, 5].map((history, idx) => (
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
              ))}
        </ColumnLayout>
      </ColumnLayout>
    </StyledContainer>
  );
};
const StyledCheckbox = styled(Checkbox)`
  background-color: transparent !important;
  color: #b5b5be !important;
  margin: -9px !important;
  margin-right: 20px !important;
`;
const GTableHead = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: rgba(41, 41, 53, 0.74);
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
  background: #16182d;
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

const ClearResistors = styled.img`
  position: fixed;
  /* width: 21.94px;
  height: 67.46px; */
  left: 76%;
  top: 30%;
  z-index: 0;
`;

const Label = styled(Box)`
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-size: 21px;
  line-height: 17px;
  /* identical to box height, or 82% */

  color: #e5e5e5;
  margin: 0 0 37px 0;
  @media screen and (max-width: 700px) {
    margin-bottom: 20px;
  }
`;
const RowLayout = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const RowToColumnLayout = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;
const ColumnLayout = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledContainer = styled(Box)`
  font-family: "Inter";
  user-select: none;
  > div {
    max-width: 1000px;
    padding: 0 40px;
    margin: 30px auto;
    > div:nth-child(1) {
      /* cursor: pointer; */
    }
  }
  position: relative;
  z-index: 10;
  padding: 120px 0 300px 0;
  @media screen and (max-width: 800px) {
    padding: 120px 0;
    > div {
      padding: 0 20px;
    }
  }
`;

export default History;
