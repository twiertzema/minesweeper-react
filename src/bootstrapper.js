import { CONFIG_EASY, configureBoard } from "./logic/board";

export default (store) => {
    store.dispatch(configureBoard(CONFIG_EASY));
};