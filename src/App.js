import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useWeb3Context } from "./context/web3Context";

import { Box } from "@mui/material";
import styled from "styled-components";
import Dashboard from "./pages/Dashboard";
import Staking from "./pages/Staking";
import History from "./pages/History";
import FAQ from "./pages/FAQ";
import Home from "./pages/Home";
import TopBar from "./components/TopBar/TopBar";

import "./App.css";
import Notification from "./components/Notification";

function App() {
  const { connect, hasCachedProvider } = useWeb3Context();

  const [notification, setNotification] = useState(null);
  const [curpage, setCurPage] = useState(0);

  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      console.log("hasCachedProvider");
      connect().then((msg) => {
        if (msg.type === "error") {
          setNotification(msg);
        }
      });
    } else {
      // then user DOES NOT have a wallet
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <StyledContainer>
        {/* <TopBar
          setNotification={setNotification}
          curpage={curpage}
          setCurPage={setCurPage}
        /> */}
        <Routes>
          <Route
            exact
            path="/"
            element={<Home setNotification={setNotification} />}
            // element={<Navigate to={"/dashboard"}
          />
          <Route
            exact
            path="/dashboard"
            element={<Dashboard setNotification={setNotification} />}
          />
          <Route
            exact
            path="/staking"
            element={<Staking setNotification={setNotification} />}
          />
          <Route
            exact
            path="/history"
            element={<History setNotification={setNotification} />}
          />
          <Route
            exact
            path="/faq"
            element={<FAQ setNotification={setNotification} />}
          />
        </Routes>
      </StyledContainer>

      <Notification data={notification} />
    </BrowserRouter>
  );
}

const StyledContainer = styled(Box)`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;
`;

export default App;
