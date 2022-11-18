import { useEffect, useState } from "react";
import { Box, Dialog, useMediaQuery, Checkbox } from "@mui/material";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import { BsChevronUp, BsChevronDown } from "react-icons/bs";

const ROIModal = ({ open, setOpen, balance, price, rate, compound }) => {
  const [active, setActive] = useState(1);

  const sm = useMediaQuery("(max-width : 450px)");
  const [amount, setAmount] = useState(0);
  const [compoundday, setCompoundDay] = useState(-1);
  const [stakeday, setStakeDay] = useState(0);
  const [showdetail, setShowDetail] = useState(false);
  const [compoundcalc, setCompoundCalc] = useState(false);
  const [calctype, setCalcType] = useState(false);

  const date = [1, 7, 30, 365, 365 * 5];

  const CalculateRate = () => {
    if (compoundcalc)
      return Number((date[stakeday] * rate * compound[compoundday]) / 36500);
    return Number((date[stakeday] * rate) / 36500);
  };

  useEffect(() => {
    setAmount(0);
    setCompoundDay(-1);
    setStakeDay(0);
    setShowDetail(false);
    setCompoundCalc(false);
    setCalcType(false);
  }, [open]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogPanel>
        <DialogHeader>
          <Box>ROI CALCULATOR</Box>
          <AiOutlineClose cursor={"pointer"} onClick={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <InputPanel mt={"12px"}>
            <Box width={"calc(100% - 52px)"}>
              <input
                type="text"
                placeholder={"0.0"}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setActive(0);
                }}
              />
              <Box mt={"8px"} textAlign={"right"}>
                -{Number(calctype ? amount / price : amount * price).toFixed(0)}{" "}
                {calctype ? "GVR" : "USD"}
              </Box>
            </Box>
            <ExchangeButton>
              <CgArrowsExchangeAlt onClick={() => setCalcType(!calctype)} />
            </ExchangeButton>
          </InputPanel>
          <Box mt={"9px"} fontSize={sm ? "13px" : "15px"} textAlign={"right"}>
            Balance: {Number(balance).toFixed(2)}
          </Box>

          <SelectPanel mt={"20px"} active={active}>
            <Box
              onClick={() => {
                setActive(1);
                setAmount(
                  Number(
                    (calctype ? balance * 1 * price : balance) / 4
                  ).toFixed(10)
                );
              }}
            >
              25%
            </Box>
            <Box
              onClick={() => {
                setActive(2);
                setAmount(
                  Number(
                    (calctype ? balance * 2 * price : balance * 2) / 4
                  ).toFixed(10)
                );
              }}
            >
              50%
            </Box>
            <Box
              onClick={() => {
                setActive(3);
                setAmount(
                  Number(
                    (calctype ? balance * 3 * price : balance * 3) / 4
                  ).toFixed(10)
                );
              }}
            >
              75%
            </Box>
            <Box
              onClick={() => {
                setActive(4);
                setAmount(
                  Number(calctype ? balance * price : balance).toFixed(10)
                );
              }}
            >
              100%
            </Box>
          </SelectPanel>
          <Box mt={"20px"}>STAKED FOR</Box>
          <DaySelectPanel active={stakeday + 1}>
            <Box onClick={() => setStakeDay(0)}>1D</Box>
            <Box onClick={() => setStakeDay(1)}>7D</Box>
            <Box onClick={() => setStakeDay(2)}>30D</Box>
            <Box onClick={() => setStakeDay(3)}>1Y</Box>
            <Box onClick={() => setStakeDay(4)}>5Y</Box>
          </DaySelectPanel>
          <Box mt={"20px"}>COMPOUNDING EVERY</Box>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box>
              <Checkbox
                color="secondary"
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                onChange={() => {
                  if (!compoundcalc) setCompoundDay(0);
                  else setCompoundDay(-1);
                  setCompoundCalc(!compoundcalc);
                }}
              />
            </Box>
            <DaySelectPanel
              active={compoundday + 1}
              width={"calc(100% - 40px)"}
            >
              <Box onClick={() => compoundcalc && setCompoundDay(0)}>1D</Box>
              <Box onClick={() => compoundcalc && setCompoundDay(1)}>7D</Box>
              <Box onClick={() => compoundcalc && setCompoundDay(2)}>14D</Box>
              <Box onClick={() => compoundcalc && setCompoundDay(3)}>30D</Box>
            </DaySelectPanel>
          </Box>
          <Box
            borderRadius={"10px"}
            mt={sm ? "20px" : "40px"}
            border={"1px solid #E6E3EA"}
            padding={sm ? "20px" : "30px"}
            mx={sm ? 0 : "20px"}
            mb={"20px"}
          >
            <Box fontSize={"18px"}>ROI AT CURRENT RATES</Box>
            <Box fontSize={"28px"} mt={"10px"} fontWeight={"bold"}>
              $
              {(calctype
                ? amount * CalculateRate()
                : amount * CalculateRate() * price
              ).toFixed(4)}
            </Box>
            <Box mt={"10px"} fontWeight={"bold"}>
              {" "}
              ~ {(CalculateRate() * 100).toFixed(6)}%
            </Box>
          </Box>
          <Box display={"flex"} justifyContent={"center"} padding={"10px 0"}>
            <Box
              display={"flex"}
              alignItems={"center"}
              style={{ cursor: "pointer" }}
              onClick={() => setShowDetail(!showdetail)}
            >
              <Box mr={"20px"} fontSize={"21px"}>
                {showdetail ? "Hide" : "Details"}
              </Box>
              {showdetail ? <BsChevronUp /> : <BsChevronDown />}
            </Box>
          </Box>

          {showdetail ? (
            <Box px={sm ? 0 : "20px"} fontSize={"18px"} mt={"20px"}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box>APR</Box>
                <Box>{Number(rate).toFixed(2)}%</Box>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                mt={"10px"}
              >
                <Box>APY (1x daily compound)</Box>
                <Box>{Number(rate * compound[0] * 365).toFixed(2)}%</Box>
              </Box>
              <Box fontSize={"16px"} my={"20px"}>
                Calculated based on current rates.
                <br />
                All figures are estimates provided for your convenience only,
                and by no means represent guaranteed returns.
              </Box>
            </Box>
          ) : (
            ""
          )}
        </DialogBody>
      </DialogPanel>
    </Dialog>
  );
};

const DaySelectPanel = styled(Box)`
  display: flex;
  border-radius: 10px;
  border: 1px solid #e6e3ea;
  padding: 5px;
  > div {
    flex: 1;
    text-align: center;
    background: transparent;
    padding: 10px 0;
    transition: all 0.3s;
    border-radius: 10px;
    cursor: pointer;
    margin: 5px 10px;
    @media screen and (max-width: 450px) {
      margin: 2px 0px;
    }
  }
  > div:nth-child(${({ active }) => active}) {
    background: #76ed10;
  }
`;

const ExchangeButton = styled(Box)`
  transform: rotate(90deg);
  cursor: pointer;
  font-size: 26px;
  margin-left: 20px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  opacity: 0.6;
  :hover {
    opacity: 1;
  }
`;

const SelectPanel = styled(Box)`
  display: flex;
  justify-content: space-between;
  > div {
    width: 61px;
    height: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: 500;
    color: #040722;
    background: #ebebeb;
    border-radius: 50px;
    :hover {
      background: #76ed10;
      color: white;
    }
    @media screen and (max-width: 450px) {
      height: 25px;
      font-size: 13px;
    }
  }
  > div:nth-child(${({ active }) => active}) {
    color: white;
    background: #76ed10;
  }
`;

const InputPanel = styled(Box)`
  background: #181a1c;
  padding: 20px 20px 25px 0px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  > div > input {
    font-family: "Poppins";
    background: transparent;
    border: none;
    font-size: 24px;
    font-weight: 500;
    color: white;
    text-align: right;
    width: 100%;
  }
`;

const DialogBody = styled(Box)`
  padding: 15px 20px 30px 20px;
`;

const DialogHeader = styled(Box)`
  padding: 20px 20px 17px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  @media screen and (max-width: 450px) {
    font-size: 17px;
  }
`;

const DialogPanel = styled(Box)`
  width: calc(100vw - 40px);
  max-width: 620px;
  color: white;
  border-radius: 10px;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none !important;
  }
  background: linear-gradient(to bottom, rgb(96 193 184), rgba(0, 0, 0, 0));
`;

export default ROIModal;
