import Axios from 'axios';
import _ from 'lodash';
import JWT from 'jsonwebtoken';
import moment from 'moment';

import {
    LOGGING_IN,
    LOGIN_FAIL,
    LOGIN_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    REGISTERING,
    LOGGING_OUT,
    LOGOUT_SUCCESS,
    ADD_USER_ADDRESS_FAIL,
    ADD_USER_ADDRESS_SUCCESS,
    ADDING_USER_ADDRESS,
    LOAD_USER_ADDRESS_FAIL,
    LOAD_USER_ADDRESS_SUCCESS,
    LOADING_USER_ADDRESS,
    DELETE_USER_ADDRESS_SUCCESS,
    DELETE_USER_ADDRESS_FAIL,
    DELETING_USER_ADDRESS,
    ADDING_CREDIT_CARD,
    ADD_CREDIT_CARD_SUCCESS,
    ADD_CREDIT_CARD_FAIL,
    LOADING_CREDIT_CARD,
    LOAD_CREDIT_CARD_SUCCESS,
    LOAD_CREDIT_CARD_FAIL,
    DELETING_CREDIT_CARD,
    DELETE_CREDIT_CARD_SUCCESS,
    DELETE_CREDIT_CARD_FAIL,
    SEARCH_FLIGHT_FAIL,
    SEARCH_FLIGHT_SUCCESS,
    SEARCHING_FLIGHT,
    BOOK_FLIGHT_FAIL,
    BOOK_FLIGHT_SUCCESS,
    BOOKING_FLIGHT,
    LOAD_BOOKINGS_FAIL,
    LOAD_BOOKINGS_SUCCESS,
    LOADING_BOOKINGS,
    CANCEL_BOOKING_FAIL,
    CANCEL_BOOKING_SUCCESS,
    CANCELING_BOOKING,
    MODIFY_ADDRESS_SUCCESS,
    MODIFYING_ADDRESS,
    MODYFI_ADDRESS_FAIL,
    MODIFY_CREDIT_CARD_FAIL,
    MODIFY_CREDIT_CARD_SUCCESS,
    MODIFYING_CREDIT_CARD
} from './types';
import { isArray } from 'util';

const REGISTER_URL = 'http://localhost/flight/register.php';
const LOGIN_URL = 'http://localhost/flight/login.php';
const ADD_USER_ADDRESS_URL = 'http://localhost/flight/add_user_address.php';
const LOAD_USER_ADDRESS_URL = 'http://localhost/flight/load_user_address.php';
const DELETE_USER_ADDRESS_URL = 'http://localhost/flight/delete_user_address.php';
const ADD_CREDIT_CARD_URL = 'http://localhost/flight/add_credit_card.php';
const LOAD_CREDIT_CARD_URL = 'http://localhost/flight/load_credit_card.php';
const DELETE_CREDIT_CARD_URL = 'http://localhost/flight/delete_credit_card.php';
const SEARCH_FLIGHTS_URL = 'http://localhost/flight/search_flights.php';
const BOOK_FLIGHT_URL = 'http://localhost/flight/book_flight.php';
const LOAD_BOOKING_URL = 'http://localhost/flight/load_booking.php';
const CANCEL_BOOKING_URL = 'http://localhost/flight/cancel_booking.php';
const MODIFY_ADDRESS_URL = 'http://localhost/flight/modify_address.php';
const MODIFY_CREDIT_CARD_URL = 'http://localhost/flight/modify_credit_card.php';

const airportList = require('../assets/data/airports.json');

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const accountRegister = (email, password, firstName, lastName, homeAirport) => {
    return (dispatch) => {
        dispatch({ type: REGISTERING });

        _.delay(() => {
            Axios.post(REGISTER_URL, {
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                homeAirport: homeAirport
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;

                    if (status === 'fail') {
                        dispatch({
                            type: REGISTER_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { uid, email, firstName, lastName, homeAirport } = data;

                        // Should be done on server side but I'm using localhost,
                        // which doesn't provide JWT token, so, I'll do it on client side
                        const token = generateJWT({
                            uid: uid,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            homeAirport: homeAirport
                        });

                        sessionStorage.setItem('jwt', token);

                        dispatch({
                            type: REGISTER_SUCCESS,
                            payload: {
                                uid: uid,
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                homeAirport: homeAirport
                            }
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: REGISTER_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const accountLogin = (email, password) => {
    return (dispatch) => {
        dispatch({ type: LOGGING_IN });

        _.delay(() => {
            Axios.post(LOGIN_URL, {
                email: email,
                password: password
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;

                    if (status === 'fail') {
                        dispatch({
                            type: LOGIN_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { uid, email, firstName, lastName, homeAirport } = data;
                        const token = generateJWT({
                            uid: uid,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            homeAirport: homeAirport
                        });

                        sessionStorage.setItem('jwt', token);

                        dispatch({
                            type: LOGIN_SUCCESS,
                            payload: {
                                uid: uid,
                                email: email,
                                firstName: firstName,
                                lastName: lastName,
                                homeAirport: homeAirport
                            }
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: LOGIN_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const accountLogout = () => {
    return (dispatch) => {
        dispatch({ type: LOGGING_OUT });

        sessionStorage.clear();
        dispatch({ type: LOGOUT_SUCCESS });
    };
};

export const generateJWT = (user) => {
    const { uid, email, firstName, lastName, homeAirport } = user;
    const u = {
        uid: uid,
        email: email,
        firstName: firstName,
        lastName: lastName,
        homeAirport: homeAirport
    };

    return JWT.sign(u, 'secret', {
        expiresIn: 60 * 60 * 24
    });
};

export const decodeJWT = (token) => {
    return JWT.decode(token);
};

export const addUserAddress = (uid, street, city, state, zipcode, country) => {
    return (dispatch) => {
        dispatch({ type: ADDING_USER_ADDRESS });

        _.delay(() => {
            Axios.post(ADD_USER_ADDRESS_URL, {
                uid: uid,
                street: street,
                city: city,
                state: state,
                zipcode: zipcode,
                country: country
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;
                    if (status === 'fail') {
                        dispatch({
                            type: ADD_USER_ADDRESS_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { address_id, street, city, state, zipcode, country } = data;
                        const address = {
                            address_id: address_id,
                            street: street,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                            country: country
                        };

                        dispatch({
                            type: ADD_USER_ADDRESS_SUCCESS,
                            payload: JSON.stringify(address)
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: ADD_USER_ADDRESS_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const loadUserAddress = (uid) => {
    return (dispatch) => {
        dispatch({ type: LOADING_USER_ADDRESS });

        _.delay(() => {
            Axios.post(LOAD_USER_ADDRESS_URL, { uid: uid })
                .then((results) => {
                    const { data } = results;
                    if (data.status === 'success') {
                        dispatch({
                            type: LOAD_USER_ADDRESS_SUCCESS,
                            payload: data.addresses
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: LOAD_USER_ADDRESS_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const deleteUserAddress = (addresses, address_id, index) => {
    return (dispatch) => {
        dispatch({ type: DELETING_USER_ADDRESS });

        _.delay(() => {
            Axios.post(DELETE_USER_ADDRESS_URL, { address_id: address_id })
                .then((results) => {
                    const { data } = results;
                    if (data.status === 'fail') {
                        dispatch({
                            type: DELETE_USER_ADDRESS_FAIL,
                            payload: data.message
                        });
                    } else {
                        dispatch({
                            type: DELETE_USER_ADDRESS_SUCCESS,
                            payload: _.pull(addresses, addresses[index])
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: DELETE_USER_ADDRESS_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const addCreditCard = (uid, expirationDate, cardNumber, addressId) => {
    return (dispatch) => {
        dispatch({ type: ADDING_CREDIT_CARD });

        _.delay(() => {
            Axios.post(ADD_CREDIT_CARD_URL, {
                uid: uid,
                expirationDate: expirationDate,
                cardNumber: cardNumber,
                addressId: addressId
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;
                    if (status === 'fail') {
                        dispatch({
                            type: ADD_CREDIT_CARD_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { cid, expirationDate, cardNumber, billingAddress } = data;
                        const card = {
                            cid: cid,
                            expirationDate: expirationDate,
                            cardNumber: cardNumber,
                            billingAddress: billingAddress
                        };

                        dispatch({
                            type: ADD_CREDIT_CARD_SUCCESS,
                            payload: JSON.stringify(card)
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: ADD_CREDIT_CARD_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const loadCreditCard = (uid) => {
    return (dispatch) => {
        dispatch({ type: LOADING_CREDIT_CARD });

        _.delay(() => {
            Axios.post(LOAD_CREDIT_CARD_URL, { uid: uid })
                .then((results) => {
                    const { data } = results;
                    if (data.status === 'success') {
                        dispatch({
                            type: LOAD_CREDIT_CARD_SUCCESS,
                            payload: data.cards
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: LOAD_CREDIT_CARD_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const deleteCreditCard = (cards, cid, index) => {
    return (dispatch) => {
        dispatch({ type: DELETING_CREDIT_CARD });

        _.delay(() => {
            Axios.post(DELETE_CREDIT_CARD_URL, { cid: cid })
                .then((results) => {
                    const { data } = results;
                    if (data.status === 'fail') {
                        dispatch({
                            type: DELETE_CREDIT_CARD_FAIL,
                            payload: data.message
                        });
                    } else {
                        dispatch({
                            type: DELETE_CREDIT_CARD_SUCCESS,
                            payload: _.pull(cards, cards[index])
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: DELETE_CREDIT_CARD_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const searchFlights = (departingAirport, destinationAirport, departingDate, returningDate, ticketCount, maxPrice, maxConnections, maxDuration) => {
    return (dispatch) => {
        dispatch({ type: SEARCHING_FLIGHT });

        const url = `${SEARCH_FLIGHTS_URL}?depart_airport=${departingAirport}&dest_airport=${destinationAirport}&depart_date=${departingDate}&return_date=${returningDate}&tickets=${ticketCount}&max_price=${maxPrice}&max_stops=${maxConnections}&max_duration=${maxDuration}`;

        _.delay(() => {
            Axios.get(url)
                .then((results) => {
                    const { depart_flights, return_flights } = results.data;

                    dispatch({
                        type: SEARCH_FLIGHT_SUCCESS,
                        payload: {
                            roundTrip: returningDate !== 'none',
                            departFlights: JSON.parse(depart_flights),
                            returnFlights: JSON.parse(return_flights)
                        }
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: SEARCH_FLIGHT_FAIL,
                        payload: error
                    });
                });
        }, 2000);
    };
};

export const findAirports = (query) => {
    const inputValue = query.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : airportList.filter(airport =>
        airport.code.toLowerCase().slice(0, inputLength) === inputValue);
};

export const getFlightsArray = (maxStops, flights) => {
    let flightsArray = [];
    if (maxStops === 0) {
        flightsArray = [...flights.non_stop];
    } else if (maxStops === 1) {
        const { non_stop, one_stop } = flights;
        flightsArray = [...non_stop];
        for (var i = 0; i < one_stop.length; ++i) {
            const { first_flight, second_flight } = one_stop[i];
            flightsArray.push([first_flight, second_flight]);
        }
    } else {
        const { non_stop, one_stop, two_stop } = flights;
        flightsArray = [...non_stop];
        for (i = 0; i < one_stop.length; ++i) {
            const { first_flight, second_flight } = one_stop[i];
            flightsArray.push([first_flight, second_flight]);
        }

        for (i = 0; i < two_stop.length; ++i) {
            const { first_flight, second_flight, last_flight } = two_stop[i];
            flightsArray.push([first_flight, second_flight, last_flight]);
        }
    }

    return flightsArray;
};

export const getTotalPrice = (firstFlight, secondFlight, lastFlight, firstClass) => {
    let total = 0;

    if (firstClass) {
        if (firstFlight) {
            total += parseInt(firstFlight.firstClassPrice, 10);
        }

        if (secondFlight) {
            total += parseInt(secondFlight.firstClassPrice, 10);
        }

        if (lastFlight) {
            total += parseInt(lastFlight.firstClassPrice, 10);
        }
    } else {
        if (firstFlight) {
            total += parseInt(firstFlight.ecoClassPrice, 10);
        }

        if (secondFlight) {
            total += parseInt(secondFlight.ecoClassPrice, 10);
        }

        if (lastFlight) {
            total += parseInt(lastFlight.ecoClassPrice, 10);
        }
    }

    return total;
};

export const sortFlightsByPrice = (flights, firstClass) => {
    flights.sort(function (flight1, flight2) {
        let flight1_total = 0;
        let flight2_total = 0;

        if (isArray(flight1)) {
            if (flight1.length === 2) {
                flight1_total = getTotalPrice(flight1[0], flight1[1], null, firstClass);
            } else if (flight1.length === 3) {
                flight1_total = getTotalPrice(flight1[0], flight1[1], flight1[2], firstClass);
            }
        } else {
            flight1_total = getTotalPrice(flight1, null, null, firstClass);
        }

        if (isArray(flight2)) {
            if (flight2.length === 2) {
                flight2_total = getTotalPrice(flight2[0], flight2[1], null, firstClass);
            } else if (flight2.length === 3) {
                flight2_total = getTotalPrice(flight2[0], flight2[1], flight2[2], firstClass);
            }
        } else {
            flight2_total = getTotalPrice(flight2, null, null, firstClass);
        }

        if (flight1_total > flight2_total) {
            return 1;
        } else if (flight1_total === flight2_total) {
            return 0;
        } return -1;
    });

    return flights;
};

export const sortFlights = (flights, sortBy, firstClass) => {
    if (sortBy === 'price') {
        flights = sortFlightsByPrice(flights, firstClass);
    } else if (sortBy === 'duration') {
        flights = sortFlightsByDuration(flights);
    }

    return flights;
};

export const sortFlightsByDuration = (flights) => {
    flights.sort(function (flight1, flight2) {
        let flight1_duration = 0.0;
        let flight2_duration = 0.0;

        if (isArray(flight1)) {
            if (flight1.length === 2) {
                flight1_duration = getFlightDuration(flight1[0], flight1[1], null);
            } else if (flight1.length === 3) {
                flight1_duration = getFlightDuration(flight1[0], flight1[1], flight1[2]);
            }
        } else {
            flight1_duration = getFlightDuration(flight1, null, null);
        }

        if (isArray(flight2)) {
            if (flight2.length === 2) {
                flight2_duration = getFlightDuration(flight2[0], flight2[1], null);
            } else if (flight2.length === 3) {
                flight2_duration = getFlightDuration(flight2[0], flight2[1], flight2[2]);
            }
        } else {
            flight2_duration = getFlightDuration(flight2, null, null);
        }

        if (flight1_duration > flight2_duration) {
            return 1;
        } else if (flight1_duration === flight2_duration) {
            return 0;
        } return -1;
    });

    return flights;
};

export const getFlightDuration = (firstFlight, secondFlight, lastFlight) => {
    if (!firstFlight) {
        return 0.0;
    }

    const firstFlightDuration = parseFloat(firstFlight.duration);
    if (!secondFlight) {
        return firstFlightDuration;
    }

    const firstFlightArrivalTime = firstFlight.arrivalTime;
    const secondFlightDepartTime = secondFlight.departTime;
    const secondFLightDuration = parseFloat(secondFlight.duration);
    const layover1 = getLayoverDuration(firstFlightArrivalTime, secondFlightDepartTime);

    if (!lastFlight) {
        return firstFlightDuration + secondFLightDuration + layover1;
    }

    const secondFlightArrivalTime = secondFlight.arrivalTime;
    const lastFlightDepartTime = lastFlight.departTime;
    const lastFlightDuration = parseFloat(lastFlight.duration);
    const layover2 = getLayoverDuration(secondFlightArrivalTime, lastFlightDepartTime);

    return firstFlightDuration + secondFLightDuration + layover1 + lastFlightDuration + layover2;
};

export const getLayoverDuration = (firstFlightArrivalTime, secondFlightDepartTime) => {
    let array = firstFlightArrivalTime.split(':');
    const hour_1 = parseInt(array[0], 10);
    const minute_1 = parseInt(array[1], 10);
    array = secondFlightDepartTime.split(':');
    const hour_2 = parseInt(array[0], 10);
    const minute_2 = parseInt(array[1], 10);

    const hourDiff = (hour_2 * 60 + minute_2 - hour_1 * 60 - minute_1) / 60;
    return hourDiff;
};

export const formatDate = (date) => {
    const dateObj = moment(date, 'MM/DD/YYYY');

    const dayOfWeek = weekday[dateObj.day()];
    const month = months[dateObj.month()];

    return `${dayOfWeek}, ${month} ${dateObj.date()}`;
};

export const formatTime = (time) => {
    const array = time.split(':');
    let hour = parseInt(array[0], 10);
    const minute = array[1].length === 1 ? `0${array[1]}` : array[1];
    const half = hour >= 12 ? 'pm' : 'am';
    hour = hour > 12 ? hour - 12 : hour;

    return `${hour}:${minute} ${half}`;
};

export const formatDuration = (duration) => {
    const hour = Math.floor(duration);
    const minute = Math.floor((duration - hour) * 60);

    return `${hour}h ${minute}m`;
};

export const formatPrice = (price) => {
    return ('$' + price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,')).split('.')[0];
};

export const filterFlightsWithEnoughtSeats = (flightsArray, ticketCount) => {
    let flights = [];

    for (var i = 0; i < flightsArray.length; ++i) {
        const flight = flightsArray[i];

        if (isArray(flight)) {
            if (flight.length === 2) {
                if (canBookFlight(flight[0], flight[1], null, true, ticketCount) ||
                    canBookFlight(flight[0], flight[1], null, false, ticketCount)) {
                    flights.push(flight);
                }
            } else if (flight.length === 3) {
                if (canBookFlight(flight[0], flight[1], flight[2], true, ticketCount) ||
                    canBookFlight(flight[0], flight[1], flight[2], false, ticketCount)) {
                    flights.push(flight);
                }
            }
        } else {
            if (canBookFlight(flight, null, null, true, ticketCount) ||
                canBookFlight(flight, null, null, false, ticketCount)) {
                flights.push(flight);
            }
        }
    }

    return flights;
};

export const canBookFlight = (firstFlight, secondFlight, lastFlight, firstClass, ticketCount) => {
    if (!firstFlight) {
        return false;
    }
    
    if (firstClass) {
        const firstFlightFirstClassSeatRemain = firstFlight.firstClassRemain;
        if (firstFlightFirstClassSeatRemain < ticketCount) {
            return false;
        }

        if (secondFlight) {
            const secondFlightFirstClassSeatRemain = secondFlight.firstClassRemain;
            if (secondFlightFirstClassSeatRemain < ticketCount) {
                return false;
            }
        } else {
            return true;
        }

        if (lastFlight) {
            const lastFlightFirstClassSeatRemain = lastFlight.firstClassRemain;
            if (lastFlightFirstClassSeatRemain < ticketCount) {
                return false;
            }
        } else {
            return true;
        }
    } else {
        const firstFlightEcoClassSeatRemain = firstFlight.ecoClassRemain;
        if (firstFlightEcoClassSeatRemain < ticketCount) {
            return false;
        }

        if (secondFlight) {
            const secondFlightEcoClassSeatRemain = secondFlight.ecoClassRemain;
            if (secondFlightEcoClassSeatRemain < ticketCount) {
                return false;
            }
        } else {
            return true;
        }

        if (lastFlight) {
            const lastFlightEcoClassSeatRemain = lastFlight.ecoClassRemain;
            if (lastFlightEcoClassSeatRemain < ticketCount) {
                return false;
            }
        } else {
            return true;
        }
    }

    return true;
};

export const getModalHeight = (secondFlight, lastFlight) => {
    if (secondFlight && lastFlight) {
        return 550;
    } else if (secondFlight && !lastFlight) {
        return 420;
    } else {
        return 280;
    }
};

export const getDepartDestStates = (firstFlight, secondFlight, lastFlight) => {
    if (!firstFlight) {
        return { departState: '', destState: '' };
    }

    if (!secondFlight) {
        return {
            departState: firstFlight.departAirportState,
            destState: firstFlight.destAirportState
        };
    }

    if (!lastFlight) {
        return {
            departState: firstFlight.departAirportState,
            destState: secondFlight.destAirportState
        };
    }

    return {
        departState: firstFlight.departAirportState,
        destState: lastFlight.destAirportState
    };
};

export const bookFlight = (uid, cid, seat, ticketCount, flightIds) => {
    return (dispatch) => {
        dispatch({ type: BOOKING_FLIGHT });

        const currentDate = moment();
        const month = currentDate.month() + 1;
        const day = currentDate.date();
        const year = currentDate.year();
        const date = `${month}/${day}/${year}`;

        _.delay(() => {
            Axios.post(BOOK_FLIGHT_URL, {
                uid: uid,
                cid: cid,
                seat: seat,
                date: date,
                ticketCount: ticketCount,
                flightIds: flightIds
            })
            .then((results) => {
                dispatch({
                    type: BOOK_FLIGHT_SUCCESS,
                    payload: results.data
                });
            })
            .catch((error) => {
                dispatch({
                    type: BOOK_FLIGHT_FAIL,
                    payload: error
                });
            });
        }, 1000);
    };
};

export const getFlightIds = (firstFlight, secondFlight, lastFlight) => {
    let flightIds = [];

    if (firstFlight) {
        flightIds.push(firstFlight.flightId);
    }

    if (secondFlight) {
        flightIds.push(secondFlight.flightId);
    }

    if (lastFlight) {
        flightIds.push(lastFlight.flightId);
    }

    return flightIds;
};

export const loadBookings = (uid) => {
    return (dispatch) => {
        dispatch({ type: LOADING_BOOKINGS });

        _.delay(() => {
            Axios.post(LOAD_BOOKING_URL, { uid: uid })
                .then((results) => {
                    dispatch({
                        type: LOAD_BOOKINGS_SUCCESS,
                        payload: results.data
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: LOAD_BOOKINGS_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const sortFlightsByTime = (flights) => {
    return flights.sort(function (flight1, flight2) {
        let array = flight1.departTime.split(':');
        const minutes_1 = parseInt(array[0], 10) * 60 + parseInt(array[1], 10);
        array = flight2.departTime.split(':');
        const minutes_2 = parseInt(array[0], 10) * 60 + parseInt(array[1], 10);

        if (minutes_1 > minutes_2) {
            return 1;
        } else if (minutes_1 < minutes_2) {
            return -1;
        } return 0;
    });
};

export const canCancelBooking = (firstFlight) => {
    const { departTime, departDate } = firstFlight;

    const firstFlightDepartTime = moment(`${departDate} ${departTime}`, 'MM/DD/YYYY hh:mm');
    return moment().isBefore(firstFlightDepartTime);
};

export const cancelBooking = (bookings, bid, index) => {
    return (dispatch) => {
        dispatch({ type: CANCELING_BOOKING });

        _.delay(() => {
            Axios.post(CANCEL_BOOKING_URL, { bid: bid })
                .then((results) => {
                    dispatch({
                        type: CANCEL_BOOKING_SUCCESS,
                        payload: _.pull(bookings, bookings[index])
                    });
                })
                .catch((error) => {
                    dispatch({
                        type: CANCEL_BOOKING_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const getUnit = (address) => {
    const array = address.street.split(',');
    if (array.length === 1) {
        return '';
    }

    return array[1].trim();
};

export const getStreet = (address) => {
    const array = address.street.split(',');

    return array[0].trim();
};

export const modifyAddress = (index, uid, addressId, street, city, state, zipcode, country) => {
    return (dispatch) => {
        dispatch({ type: MODIFYING_ADDRESS });

        _.delay(() => {
            Axios.post(MODIFY_ADDRESS_URL, {
                address_id: addressId,
                uid: uid,
                street: street,
                city: city,
                state: state,
                zipcode: zipcode,
                country: country
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;
                    if (status === 'fail') {
                        dispatch({
                            type: MODYFI_ADDRESS_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { address_id, street, city, state, zipcode, country } = data;
                        const address = {
                            address_id: address_id,
                            street: street,
                            city: city,
                            state: state,
                            zipcode: zipcode,
                            country: country
                        };

                        dispatch({
                            type: MODIFY_ADDRESS_SUCCESS,
                            payload: {
                                address: JSON.stringify(address),
                                index: index
                            }
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: MODYFI_ADDRESS_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};

export const modifyPayment = (index, cid, expirationDate, cardNumber, addressId) => {
    return (dispatch) => {
        dispatch({ type: MODIFYING_CREDIT_CARD });

        _.delay(() => {
            Axios.post(MODIFY_CREDIT_CARD_URL, {
                cid: cid,
                expirationDate: expirationDate,
                cardNumber: cardNumber,
                addressId: addressId
            })
                .then((results) => {
                    const { data } = results;
                    const { status } = data;
                    if (status === 'fail') {
                        dispatch({
                            type: MODIFY_CREDIT_CARD_FAIL,
                            payload: data.message
                        });
                    } else {
                        const { cid, expirationDate, cardNumber, billingAddress } = data;
                        const card = {
                            cid: cid,
                            expirationDate: expirationDate,
                            cardNumber: cardNumber,
                            billingAddress: billingAddress
                        };

                        dispatch({
                            type: MODIFY_CREDIT_CARD_SUCCESS,
                            payload: {
                                card: JSON.stringify(card),
                                index: index
                            }
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: MODIFY_CREDIT_CARD_FAIL,
                        payload: error
                    });
                });
        }, 1000);
    };
};