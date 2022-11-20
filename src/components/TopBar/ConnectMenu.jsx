import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useAddress, useWeb3Context } from "../../context/web3Context";
import Button from "../../components/Button";
import { Box } from "@mui/material";
import { BiWallet } from "react-icons/bi";

function ConnectMenu({ setNotification }) {
  const { connect, disconnect, connected, web3 } = useWeb3Context();
  const address = useAddress();
  const [isConnected, setConnected] = useState(connected);

  const sm = useMediaQuery("(max-width : 880px)");
  const xs = useMediaQuery("(max-width : 500px)");

  let ellipsis = address
    ? sm
      ? "Connected"
      : (address.slice(0, 10) + "...").toUpperCase()
    : sm
    ? "Wallet Connect"
    : "Wallet Connect";

  let buttonText = ellipsis;

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  if (isConnected) {
    buttonText = ellipsis;
  }

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div>
      <Button
        type={"primary"}
        width={xs ? "150px" : "222px"}
        height={xs ? "45px" : "54px"}
        fontSize={xs ? "13px" : "16px"}
        onClick={() => (isConnected ? disconnect() : onConnect())}
      >
        <Box display={"flex"} alignItems={"center"}>
          <Box mr={"8px"} mt={"-3px"}>
            <BiWallet fontSize={"20px"} />
          </Box>
          <Box>{buttonText}</Box>
        </Box>
      </Button>
    </div>
  );
}

export default ConnectMenu;
