import React, { PureComponent } from 'react';
import * as Icon from 'react-icons/lib/md';

import { getFlightDuration, formatPrice } from '../actions';

import '../css/Flight.css';

class Flight extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            firstFlight: null,
            secondFlight: null,
            lastFlight: null,
            showFirstClass: false
        };

        this.renderSingleFlight = this.renderSingleFlight.bind(this);
        this.getEcoTotalPrice = this.getEcoTotalPrice.bind(this);
        this.getFirstTotalPrice = this.getFirstTotalPrice.bind(this);
        this.renderPrice = this.renderPrice.bind(this);
        this.getTripDuration = this.getTripDuration.bind(this);
    }

    componentWillMount() {
        const { firstFlight, secondFlight, lastFlight, showFirstClass } = this.props;
        this.setState({
            firstFlight: firstFlight,
            secondFlight: secondFlight,
            lastFlight: lastFlight,
            showFirstClass: showFirstClass
        });
    }

    componentWillReceiveProps(nextProps) {
        const { firstFlight, secondFlight, lastFlight, showFirstClass } = nextProps;
        this.setState({
            firstFlight: firstFlight,
            secondFlight: secondFlight,
            lastFlight: lastFlight,
            showFirstClass: showFirstClass
        });
    }

    renderSingleFlight(flight) {
        if (!flight) {
            return (<div />);
        }

        const { airlineName, arrivalTime, departAirportCode,
            departTime, destAirportCode, duration } = flight;

        return (
            <div className='Flight-flight-container'>
                <div className='Flight-airline-name'>
                    {airlineName}
                </div>
                <div className='Flight-default-container'>
                    <div className='Flight-time'>
                        {departTime}
                    </div>
                    <div className='Flight-airport-code'>
                        {departAirportCode}
                    </div>
                </div>
                <Icon.MdFlightTakeoff
                    size={25}
                    color='black'
                />
                <div className='Flight-default-container'>
                    <div className='Flight-time'>
                        {arrivalTime}
                    </div>
                    <div className='Flight-airport-code'>
                        {destAirportCode}
                    </div>
                </div>
                <div className='Flight-duration'>
                    {duration.toFixed(1)} hrs
                </div>
            </div>
        );
    }

    getEcoTotalPrice() {
        const { firstFlight, secondFlight, lastFlight } = this.state;
        let total = 0;

        if (firstFlight) {
            total += parseInt(firstFlight.ecoClassPrice, 10);
        }

        if (secondFlight) {
            total += parseInt(secondFlight.ecoClassPrice, 10);
        }

        if (lastFlight) {
            total += parseInt(lastFlight.ecoClassPrice, 10);
        }

        return total;
    }

    getFirstTotalPrice() {
        const { firstFlight, secondFlight, lastFlight } = this.state;
        let total = 0;

        if (firstFlight) {
            total += parseInt(firstFlight.firstClassPrice, 10);
        }

        if (secondFlight) {
            total += parseInt(secondFlight.firstClassPrice, 10);
        }

        if (lastFlight) {
            total += parseInt(lastFlight.firstClassPrice, 10);
        }

        return total;
    }

    getTripDuration() {
        const { firstFlight, secondFlight, lastFlight } = this.state;
        return getFlightDuration(firstFlight, secondFlight, lastFlight).toFixed(1);
    }

    renderPrice() {
        if (this.state.showFirstClass) {
            return (
                <div className='Flight-price-container'>
                    <div className='Flight-price'>
                        {formatPrice(this.getFirstTotalPrice())}
                    </div>
                    <div className='Flight-trip-duraion'>
                        {this.getTripDuration()} hrs
                    </div>
                </div>
            );
        }

        return (
            <div className='Flight-price-container'>
                <div className='Flight-price'>
                    {formatPrice(this.getEcoTotalPrice())}
                </div>
                <div className='Flight-trip-duraion'>
                    {this.getTripDuration()} hrs
                </div>
            </div>
        );
    }

    render() {
        const { firstFlight, secondFlight, lastFlight } = this.state;

        return (
            <div
                className='Flight-container'
                onClick={() => this.props.onViewFlightDetail(firstFlight, secondFlight, lastFlight)}
            >
                <div className='Flight-info-container'>
                    {this.renderSingleFlight(firstFlight)}
                    {this.renderSingleFlight(secondFlight)}
                    {this.renderSingleFlight(lastFlight)}
                </div>
                {this.renderPrice()}
            </div>
        );
    }
}

export default Flight;