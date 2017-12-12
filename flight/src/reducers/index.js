import { combineReducers } from 'redux';
import account from './account_reducer';
import userAddress from './user_address_reducer';
import creditCard from './credit_card_reducer';
import flight from './flight_reducer';
import booking from './booking_reducer';

export default combineReducers({
    account, userAddress, creditCard, flight, booking
});