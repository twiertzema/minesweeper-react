import { CONFIG_EASY, configureBoard } from "./logic/main";

export default (store) => {
    store.dispatch(configureBoard(CONFIG_EASY));
};