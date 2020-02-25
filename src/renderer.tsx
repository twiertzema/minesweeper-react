import React from "react";
import ReactDOM from "react-dom";

import "./module-fix";
import "./index.css";

import App from "./App";

console.log("Renderer checking in.")

ReactDOM.render(<App />, document.getElementById("root"));
