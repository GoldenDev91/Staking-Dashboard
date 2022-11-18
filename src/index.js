import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";

import { GlobalProvider } from "./context/GlobalContext";
import { Web3ContextProvider } from "./context/web3Context";
import { TokenInfoProvider } from "./hooks/useTokenInfo";
import { LockInfoProvider } from "./hooks/useLockInfo";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <Web3ContextProvider>
        <TokenInfoProvider>
          <LockInfoProvider>
            <App />
          </LockInfoProvider>
        </TokenInfoProvider>
      </Web3ContextProvider>
    </GlobalProvider>
  </React.StrictMode>
);
