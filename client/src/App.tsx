import React from "react";
import "./App.css";
import { Route, Switch } from "wouter";
import { Dashboard } from "./pages/dashboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={Dashboard} />
        {/* Default route in a switch */}
        <Route>404: No such page!</Route>
      </Switch>
    </div>
  );
}

export default App;
