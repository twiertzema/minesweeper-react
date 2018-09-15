import { CONFIG_EASY } from "./lib/constants";
import { configureBoard } from "./logic/board";

export default store => {
  store.dispatch(configureBoard(CONFIG_EASY));
};
