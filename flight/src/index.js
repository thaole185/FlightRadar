import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './index.css';

import App from './App';

import registerServiceWorker from './registerServiceWorker';

import store from './store';

import { decodeJWT } from './actions';

import { LOGIN_SUCCESS } from './actions/types';

const token = sessionStorage.getItem('jwt');

if (token) {
    const { uid, firstName, lastName, email, homeAirport } = decodeJWT(token);
    store.dispatch({
        type: LOGIN_SUCCESS,
        payload: {
            uid: uid,
            firstName: firstName,
            lastName: lastName,
            email: email,
            homeAirport: homeAirport
        }
    });
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();