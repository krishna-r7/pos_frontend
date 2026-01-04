import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import store, { persistor } from "./redux/store";

import "antd/dist/reset.css";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "hsla(208, 83%, 37%, 1)",
              borderRadius: 3,
            },
          }}
        >
          <App />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
