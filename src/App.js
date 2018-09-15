import React from "react";

import Board from "./components/Board";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Minesweeper!</h1>
        <Board />
      </div>
    );
  }
}

export default App;
