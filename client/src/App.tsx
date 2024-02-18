import React from "react";
import "./App.css";
import { Route, Switch } from "wouter";
import { ConfigProvider } from "antd";
import { Dashboard } from "./pages/dashboard";
import { Participants } from "./pages/participants";

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: "#005AEE",
            colorInfo: "#00B8D9",
            borderRadius: 8,
          },
        }}
      >
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/participants" component={Participants} />
          <Route>404: No such page!</Route>
        </Switch>
      </ConfigProvider>
    </div>
  );
}

export default App;
