import React from "react";
import "./App.css";
import { Route, Switch } from "wouter";
import { ConfigProvider } from "antd";
import { Dashboard } from "./pages/dashboard";
import { Participants } from "./pages/participants";
import { PRIMARY } from "./style/colors";
import { NewGame } from "./pages/new-game";
import { TeamDetails } from "./pages/team-details";
import { PlayerDetails } from "./pages/player-details";

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            // Seed Token
            colorPrimary: PRIMARY,
            colorInfo: "#00B8D9",
            borderRadius: 8,
          },
        }}
      >
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/participants" component={Participants} />
          <Route path="/new-game/:id" component={NewGame} />
          <Route path="/teams/:id" component={TeamDetails} />
          <Route path="/players/:id" component={PlayerDetails} />
          <Route>404: No such page!</Route>
        </Switch>
      </ConfigProvider>
    </div>
  );
}

export default App;
