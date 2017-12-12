import {
    BOOK_FLIGHT_FAIL,
    BOOK_FLIGHT_SUCCESS,
    BOOKING_FLIGHT,
    LOADING_BOOKINGS,
    LOAD_BOOKINGS_SUCCESS,
    LOAD_BOOKINGS_FAIL,
    CANCEL_BOOKING_FAIL,
    CANCEL_BOOKING_SUCCESS,
    CANCELING_BOOKING
} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: '',
    bookings: [],
    booked: false,
    canceled: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case BOOKING_FLIGHT:
        case LOADING_BOOKINGS:
        case CANCELING_BOOKING:
            return { ...state, loading: true, booked: false, canceled: false, error: '' };
        case BOOK_FLIGHT_SUCCESS:
            return { ...state, loading: false, booked: true, bookings: [...state.bookings, action.payload] };
        case LOAD_BOOKINGS_SUCCESS:
            return { ...state, loading: false, bookings: action.payload };
        case CANCEL_BOOKING_SUCCESS:
            return { ...state, loading: false, canceled: true, bookings: action.payload };
        case BOOK_FLIGHT_FAIL:
        case LOAD_BOOKINGS_FAIL:
        case CANCEL_BOOKING_FAIL:
            return { ...state, loading: false, booked: false, error: action.payload };
        default:
            return state;
    }
};