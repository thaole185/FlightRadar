import {
    ADD_USER_ADDRESS_FAIL,
    ADD_USER_ADDRESS_SUCCESS,
    ADDING_USER_ADDRESS,
    LOAD_USER_ADDRESS_FAIL,
    LOAD_USER_ADDRESS_SUCCESS,
    LOADING_USER_ADDRESS,
    DELETE_USER_ADDRESS_FAIL,
    DELETING_USER_ADDRESS,
    DELETE_USER_ADDRESS_SUCCESS,
    MODIFY_ADDRESS_SUCCESS,
    MODIFYING_ADDRESS,
    MODYFI_ADDRESS_FAIL
} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: '',
    addresses: [],
    uploaded: false,
    deleted: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADDING_USER_ADDRESS:
        case LOADING_USER_ADDRESS:
        case DELETING_USER_ADDRESS:
        case MODIFYING_ADDRESS:
            return { ...state, loading: true, uploaded: false, error: '', deleted: false };
        case ADD_USER_ADDRESS_SUCCESS:
            return { ...state, loading: false, uploaded: true, addresses: [...state.addresses, action.payload] };
        case MODIFY_ADDRESS_SUCCESS:
            const { address, index } = action.payload;
            let addresses = state.addresses;
            addresses[index] = address;
            return { ...state, loading: false, uploaded: true, addresses: addresses };
        case ADD_USER_ADDRESS_FAIL:
        case LOAD_USER_ADDRESS_FAIL:
        case DELETE_USER_ADDRESS_FAIL:
        case MODYFI_ADDRESS_FAIL:
            return { ...state, loading: false, uploaded: false, error: action.payload };
        case LOAD_USER_ADDRESS_SUCCESS:
            return { ...state, loading: false, addresses: action.payload };
        case DELETE_USER_ADDRESS_SUCCESS:
            return { ...state, loading: false, addresses: action.payload, deleted: true };
        default:
            return state;
    }
};