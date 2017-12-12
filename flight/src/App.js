import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import AccountPage from './pages/AccountPage';
import ViewFlightsPage from './pages/ViewFlightsPage';

class App extends Component {
    render() {
        return (
            <main>
                <Switch>
                    <Route exact path='/' component={MainPage} />
                    <Route path='/account' component={AccountPage} />
                    <Route path='/view_flight' component={ViewFlightsPage} />
                </Switch>
            </main>
        );
    }
}

export default App;