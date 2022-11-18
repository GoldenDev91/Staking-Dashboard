/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Box, Dialog, useMediaQuery, Slider } from "@mui/material";
import styled from "styled-components";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../Button";

const StakingModal = ({
  open,
  setOpen,
  type,
  balance,
  onClick,
  amount,
  setAmount,
  maxpressed,
  setMaxPressed,
  pending,
  price,
}) => {
  const [active, setActive] = useState(1);
  const [insufficient, setInsufficient] = useState(false);

  const sm = useMediaQuery("(max-width : 450px)");

  useEffect(() => {
    if (amount > balance && !maxpressed) setInsufficient(true);
    else setInsufficient(false);
  }, [amount, maxpressed]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogPanel>
        <DialogHeader>
          <Box>{type === 1 ? "Stake in Pool" : "Unstake"}</Box>
          <AiOutlineClose cursor={"pointer"} onClick={() => setOpen(false)} />
        </DialogHeader>
        <DialogBody>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            fontSize={sm ? "16px" : "18px"}
          >
            <Box>{type === 1 ? "Stake" : "Unstake"}</Box>
            <Box fontWeight={"bold"}>SSL</Box>
          </Box>
          <InputPanel mt={"12px"}>
            <input
              type="text"
              placeholder={"0.0"}
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setActive(0);
                setMaxPressed(false);
              }}
            />
            <Box mt={"8px"} textAlign={"right"}>
              -{Number(amount * price).toFixed(5)} USD
            </Box>
          </InputPanel>
          {insufficient ? (
            <Box
              mt={"9px"}
              fontSize={sm ? "13px" : "15px"}
              textAlign={"right"}
              color={"tomato"}
            >
              Insufficient Amount
            </Box>
          ) : (
            ""
          )}
          <Box mt={"9px"} fontSize={sm ? "13px" : "15px"} textAlign={"right"}>
            Balance: {Number(balance).toFixed(2)}
          </Box>
          <Box mt={"15px"} width={"calc(100% - 18px)"} ml={"12px"}>
            <Slider
              aria-label="Temperature"
              defaultValue={0}
              value={(amount / balance) * 100}
              onChange={(e, val) => {
                if (val === 100) {
                  setMaxPressed(true);
                  console.log(val);
                } else setMaxPressed(false);
                setAmount(Number((balance * val) / 100).toFixed(10));
                setActive(0);
              }}
              color="primary"
              size={"medium"}
            />
          </Box>
          <Box
            mt={sm ? "-3px" : "3px"}
            fontSize={sm ? "13px" : "16px"}
            marginLeft={
              (amount / balance) * 100 > 97
                ? sm
                  ? `calc(100% - 32px)`
                  : `calc(100% - 36px)`
                : sm
                ? `calc((100% - 20px) / 100 * ${(amount / balance) * 100}) `
                : `calc((100% - 24px) / 100 * ${(amount / balance) * 100}) `
            }
          >
            {Number(balance / 1 ? (amount / balance) * 100 : 0).toFixed(0)}%
          </Box>
          <SelectPanel mt={"14px"} active={active}>
            <Box
              onClick={() => {
                setActive(1);
                setAmount(Number(balance / 4).toFixed(10));
                setMaxPressed(false);
              }}
            >
              25%
            </Box>
            <Box
              onClick={() => {
                setActive(2);
                setAmount(Number((balance * 2) / 4).toFixed(10));
                setMaxPressed(false);
              }}
            >
              50%
            </Box>
            <Box
              onClick={() => {
                setActive(3);
                setAmount(Number((balance * 3) / 4).toFixed(10));
                setMaxPressed(false);
              }}
            >
              75%
            </Box>
            <Box
              onClick={() => {
                setActive(4);
                setAmount(Number(balance).toFixed(10));
                setMaxPressed(true);
              }}
            >
              100%
            </Box>
          </SelectPanel>
          <Box mt={"32px"}>
            <Button
              type={"primary"}
              width={"100%"}
              height={sm ? "28px" : "50px"}
              fontSize={sm ? "12px" : "16px"}
              onClick={onClick}
              disabled={pending || !(amount / 1) || insufficient}
            >
              Confirm
            </Button>
          </Box>
        </DialogBody>
      </DialogPanel>
    </Dialog>
  );
};

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
  border-radius: 10px;
  padding: 20px 20px 25px 0px;
  > input {
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
  background: linear-gradient(to bottom, rgb(96 193 184), rgba(0, 0, 0, 0));
  border-radius: 10px;
`;

export default StakingModal;
