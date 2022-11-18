/* eslint-disable jsx-a11y/alt-text */
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";

function RightSideBar({ theme, setNotification, setShowFilter }) {
  const md = useMediaQuery("(max-width : 1500px)");
  const sm = useMediaQuery("(max-width : 1000px)");

  return (
    <StyledContainer>
      <Vector />
      <Box display={md ? "none" : "flex"} alignItems={"center"}>
        <img src={"/images/vector.png"} width={"46px"} height={"73px"} />
        <Box fontSize={"20px"} fontWeight={"bold"} ml={"12px"}>
          WPT Details
        </Box>
      </Box>
      <Box>
        <Box
          mt={sm ? 0 : "38px"}
          fontWeight={"bold"}
          lineHeight={sm ? "142%" : "187%"}
        >
          <Box>Name:</Box>
          <Box>WPT Investing Corp</Box>
        </Box>
        <Box mt={sm ? 0 : "38px"} lineHeight={sm ? "142%" : "187%"}>
          <Box fontWeight={"bold"}>Symbol:</Box>
          <Box>WPT</Box>
        </Box>
      </Box>
      <Box>
        <Box mt={"26px"} fontWeight={"bold"} lineHeight={sm ? "142%" : "187%"}>
          <Box>Decimal:</Box>
          <Box>18</Box>
        </Box>
        <Box
          mt={"26px"}
          lineHeight={sm ? "142%" : "187%"}
          zIndex={5}
          position={"relative"}
        >
          <Box fontWeight={"bold"}>ETH Contract:</Box>
          <a
            href={
              "https://etherscan.io/token/0x4fd51cb87ffefdf1711112b5bd8ab682e54988ea"
            }
            style={{ color: "#8ED4AE" }}
            target={"_blank"}
            rel="noreferrer"
          >
            Visit Etherscan
          </a>
        </Box>
      </Box>
    </StyledContainer>
  );
}

const StyledContainer = styled(Box)`
  min-width: 543px;
  background: linear-gradient(
    to bottom,
    rgba(16, 53, 83, 0.5),
    rgba(0, 0, 0, 0)
  );
  padding: 77px 0 0 59px;
  color: white;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 1900px) {
    min-width: 480px;
  }
  @media screen and (max-width: 1780px) {
    min-width: 350px;
  }
  @media screen and (max-width: 1500px) {
    overflow-y: hidden;
    background: linear-gradient(to bottom, #000c2700, #00334a);
    > div:nth-child(3) {
      display: flex;
      justify-content: space-between;
      width: 100%;
      > div:nth-child(2) {
        width: 115px;
      }
    }
    > div:nth-child(4) {
      display: flex;
      justify-content: space-between;
      width: 100%;
      > div:nth-child(2) {
        width: 115px;
      }
    }
    padding: 26px 80px 36px 80px;
  }
  @media screen and (max-width: 1000px) {
    padding: 26px 40px 36px 40px;
    > div:nth-child(4) {
      font-size: 14px;
    }
    > div:nth-child(3) {
      font-size: 14px;
    }
    margin: 0;
  }
  @media screen and (max-width: 880px) {
    margin: 0 20px;
    min-width: unset;
  }
  @media screen and (max-width: 400px) {
    padding: 26px 20px 36px 20px;
  }
  @media screen and (max-width: 340px) {
    margin: 0;
  }
  @media screen and (max-height: 810px) {
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

const Vector = styled(Box)`
  position: absolute;
  background: url("/images/vector.png");
  background-size: 100% 100%;
  width: 441px;
  height: 700px;
  right: 0;
  bottom: -250px;
  opacity: 0.07;
  @media screen and (max-width: 1500px) {
    display: none;
  }
`;

export default RightSideBar;
