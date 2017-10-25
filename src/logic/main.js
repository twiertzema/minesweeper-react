const initialState = {
    helloWorld: "Minesweeper!"
};

const DERP = "DERP";

export const derp = (helloWorld) => {
    return {
        type: DERP,
        helloWorld: helloWorld
    };
};

export function mainReducer(state = initialState, action) {
    switch(action.type) {
        case DERP:
            return {
                helloWorld: action.helloWorld
            };
        default:
            return state;
    }
}