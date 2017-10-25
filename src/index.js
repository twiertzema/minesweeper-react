import React from "react";
import { render } from "react-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";

import { mainReducer } from "./logic/main";

const store = createStore(mainReducer);

render(
    <Provider store={store}>
        <div>
            <h1>Minesweeper!</h1>
        </div>
    </Provider>,
    document.getElementById("root")
);