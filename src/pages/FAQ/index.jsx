import { Box, useMediaQuery } from "@mui/material";

import styled from "styled-components";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useState } from "react";

const FAQ = () => {
  const texts = [
    {
      title:
        "How does the lock period work on the ShibaSoccerLeague  locked pools?",
      detail:
        "When you stake your tokens in a locked pool, your tokens are locked for the period disclosed. For example, if you have selected the 30-day staking pool, you will not be able to unstake your tokens for a duration of 30 days. You do not need to unstake your tokens after the lock period, as you can keep generating staking rewards and reflections until the pool has finished (most pools run for 365 days).",
    },
    {
      title:
        "Does staking more tokens after an expired stake reset the lock period?",
      detail:
        "Staking more tokens after an expired stake period will only lock the newly added staked tokens for the period of the locking pool. Any staked tokens that have exceeded the original lock are free to be unstaked.",
    },
    {
      title:
        "Does staking more tokens during the initial lock period reset the lock period?",
      detail:
        "No, staking more tokens during the initial lock period does not reset the time that your tokens are locked. Any additional tokens added to your staked amount will be locked for the duration of the pool lock, this is considered a “new stake.",
    },
    {
      title: "Does compounding your staking rewards reset the lock period?",
      detail:
        "When you stake your tokens in a locked pool, your tokens are locked for the period disclosed. For example, if you have selected the 30-day staking pool, you will not be able to unstake your tokens for a duration of 30 days. You do not need to unstake your tokens after the lock period, as you can keep generating staking rewards and reflections until the pool has finished (most pools run for 365 days).",
    },
    {
      title:
        "What does compounding and harvesting mean on the ShibaSoccerLeague  staking platform?",
      detail: (
        <Box>
          As you are staking your ShibaSoccerLeague on our platform, you will
          see two amounts being generated in a pool, these are
          “ShibaSoccerLeague Earned” and “BUSD Reflected”. The ShibaSoccerLeague
          earned is the amount of rewards you are generating from the pool
          itself. <br />
          <br />
          The BUSD Reflected is how much you have earned as part of the
          reflections tax and is separate to the staking pool. When you
          “compound” either of these amounts, they will increase your
          ShibaSoccerLeague Staked amount, which will in turn increase the
          amount of ShibaSoccerLeague you will earn as rewards from the pool.
          When you “harvest” your BUSD reflections, they will be sent to your
          wallet.
        </Box>
      ),
    },
    {
      title: "What are the fees for staking?",
      detail: (
        <Box>
          Each pool has deposit, withdraw and performance fees. The
          deposit/withdraw fees are set by the projects pools and are gross fees
          charged on the amount deposited or withdrawn from the staking pool.
          The deposit/withdraw fee is paid in the project token to an allocated
          wallet by the project. <br />
          <br />
          The performance fee is a small fee charged by ShibaSoccerLeague on
          each compound or harvest event. This fee is approximately $0.10 per
          executing of any harvest/compound event. The fee is paid in Ether and
          is integrated into the gas for the compound/harvest transaction.
          Performance fees fall under the fee buy back revenue model which you
          can.
        </Box>
      ),
    },
  ];

  const [detailopen, setDetailOpen] = useState([]);

  const sm = useMediaQuery("(max-width : 800px)");
  return (
    <StyledContainer>
      {texts.map((data, i) => {
        return (
          <Box key={i}>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              onClick={() => {
                let temp = [...detailopen];
                temp[i] = !temp[i];
                setDetailOpen(temp);
              }}
              fontSize={sm ? "13px" : "16px"}
            >
              <Box>{data.title}</Box>
              <Box>{detailopen[i] ? <BsChevronUp /> : <BsChevronDown />}</Box>
            </Box>
            <Box
              fontSize={sm ? "11px" : "14px"}
              fontWeight={"200x"}
              mt={"5px"}
              color={"wheat"}
              display={detailopen[i] ? "block" : "none"}
            >
              {data.detail}
            </Box>
          </Box>
        );
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  > div {
    max-width: 800px;
    padding: 0 40px;
    margin: 30px auto;
    > div:nth-child(1) {
      cursor: pointer;
    }
  }
  position: relative;
  z-index: 10;
  padding: 140px 0 300px 0;
  @media screen and (max-width: 800px) {
    padding: 140px 0;
    > div {
      padding: 0 20px;
    }
  }
`;

export default FAQ;
