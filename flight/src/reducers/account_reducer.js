import {
    LOGGING_IN,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    REGISTERING,
    LOGGING_OUT,
    LOGOUT_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
    currentUser: null,
    authorized: false,
    loading: false,
    error: ''
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case LOGGING_IN:
        case REGISTERING:
            return { ...INITIAL_STATE, loading: true };
        case LOGIN_FAIL:
        case REGISTER_FAIL:
            return { ...INITIAL_STATE, error: action.payload };
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            return { ...INITIAL_STATE, currentUser: action.payload, authorized: true };
        case LOGGING_OUT:
            return { ...state, loading: true };
        case LOGOUT_SUCCESS:
            return INITIAL_STATE;
        default:
            return state;
    }
};