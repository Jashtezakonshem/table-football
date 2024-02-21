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
import { Compare } from "./pages/compare";

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
          {/* in a real scenario I would have mapped string with an ENUM*/}
          <Route path="/" component={Dashboard} />
          <Route path="/participants" component={Participants} />
          <Route path="/new-game/:id" component={NewGame} />
          <Route path="/teams/:id" component={TeamDetails} />
          <Route path="/players/:id" component={PlayerDetails} />
          <Route path="/compare/:id/:id2" component={Compare} />
          <Route>404: No such page!</Route>
        </Switch>
      </ConfigProvider>
    </div>
  );
}

export default App;
