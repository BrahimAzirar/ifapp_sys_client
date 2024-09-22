import Types from "./Types";

const defaultState = { AdminAuth: false, StudentAuth: false };

const AuthReducer = (state = defaultState, action) => {
    if (action.type === Types.ISAUTH) {
        return { ...state, AdminAuth: true };
    }
    else if (action.type === Types.ISNOTAUTH) {
        return { ...state, AdminAuth: false };
    }
    else if (action.type === Types.STUDENTISAUTH) {
        return { ...state, StudentAuth: true };
    }
    else if (action.type === Types.STUDENTISNOTAUTH) {
        return { ...state, StudentAuth: false };
    };

    return state;
};

export default AuthReducer;