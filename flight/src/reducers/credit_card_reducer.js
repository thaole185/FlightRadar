import {
    ADDING_CREDIT_CARD,
    ADD_CREDIT_CARD_SUCCESS,
    ADD_CREDIT_CARD_FAIL,
    LOADING_CREDIT_CARD,
    LOAD_CREDIT_CARD_SUCCESS,
    LOAD_CREDIT_CARD_FAIL,
    DELETING_CREDIT_CARD,
    DELETE_CREDIT_CARD_SUCCESS,
    DELETE_CREDIT_CARD_FAIL,
    MODIFY_CREDIT_CARD_FAIL,
    MODIFY_CREDIT_CARD_SUCCESS,
    MODIFYING_CREDIT_CARD
} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: '',
    payments: [],
    uploaded: false,
    deleted: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case ADDING_CREDIT_CARD:
        case LOADING_CREDIT_CARD:
        case DELETING_CREDIT_CARD:
        case MODIFYING_CREDIT_CARD:
            return { ...state, loading: true, uploaded: false, error: '', deleted: false };
        case ADD_CREDIT_CARD_SUCCESS:
            return { ...state, loading: false, uploaded: true, payments: [...state.payments, action.payload] };
        case ADD_CREDIT_CARD_FAIL:
        case LOAD_CREDIT_CARD_FAIL:
        case DELETE_CREDIT_CARD_FAIL:
        case MODIFY_CREDIT_CARD_FAIL:
            return { ...state, loading: false, uploaded: false, error: action.payload };
        case LOAD_CREDIT_CARD_SUCCESS:
            return { ...state, loading: false, payments: action.payload };
        case MODIFY_CREDIT_CARD_SUCCESS:
            const { card, index } = action.payload;
            let cards = state.payments;
            cards[index] = card;
            return { ...state, loading: false, uploaded: true, payments: cards };
        case DELETE_CREDIT_CARD_SUCCESS:
            return { ...state, loading: false, payments: action.payload, deleted: true };
        default:
            return state;
    }
};