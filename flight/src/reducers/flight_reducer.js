import {
    SEARCHING_FLIGHT,
    SEARCH_FLIGHT_SUCCESS,
    SEARCH_FLIGHT_FAIL
} from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    error: '',
    departFlights: [],
    returnFlights: [],
    roundTrip: false
};

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case SEARCHING_FLIGHT:
            return { ...state, error: '', loading: true };
        case SEARCH_FLIGHT_SUCCESS:
            const { departFlights, returnFlights, roundTrip } = action.payload;
            return { ...INITIAL_STATE, departFlights: departFlights, returnFlights: returnFlights, roundTrip: roundTrip };
        case SEARCH_FLIGHT_FAIL:
            return { ...INITIAL_STATE, loading: false, error: action.payload };
        default:
            return state;
    }
};