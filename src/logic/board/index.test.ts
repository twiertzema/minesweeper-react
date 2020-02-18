/* eslint-env jest */
import {
  CONFIG_DEFAULT,
  CONFIG_EASY,
  CONFIG_INTERMEDIATE,
  CONFIG_EXPERT
} from "../../lib/constants";
import { init, reconfigureBoard, reducer } from "./index";

it("should return the current state if action type is unrecognized", () => {
  const stateBefore = init(CONFIG_DEFAULT);
  const action = {
    type: "bogus_action"
  };
  const result = reducer(stateBefore, action as any);
  expect(result).toBe(stateBefore);
});

describe("RECONFIGURE_BOARD", () => {
  it("should configure for CONFIG_DEFAULT", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_DEFAULT);
    const result = reducer(stateBefore, action);
    expect(result).toEqual({
      ...stateBefore,
      config: CONFIG_DEFAULT,
      board: []
    });
  });

  it("should configure for CONFIG_EASY", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_EASY);
    const result = reducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });

  it("should configure for CONFIG_INTERMEDIATE", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_INTERMEDIATE);
    const result = reducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });

  it("should configure for CONFIG_EXPERT", () => {
    const stateBefore = init(CONFIG_DEFAULT);
    const action = reconfigureBoard(CONFIG_EXPERT);
    const result = reducer(stateBefore, action);
    expect(result).toMatchSnapshot();
  });
});

// TODO: REVEAL_CELL
// TODO: TURN_CELL_STATE

// TODO: modifyCell
