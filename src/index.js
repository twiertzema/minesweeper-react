import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import globalStyles from "./index.css";

import { mainReducer } from "./logic/board";

import bootstrapper from "./bootstrapper";
import Board from "./components/board";

const store = createStore(mainReducer);

bootstrapper(store);

render(
    <Provider store={store}>
        <div>
            <h1>Minesweeper!</h1>
            <Board/>
        </div>
    </Provider>,
    document.getElementById("root")
);