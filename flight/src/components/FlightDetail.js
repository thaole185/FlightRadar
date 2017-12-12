import React, { PureComponent } from 'react';
import * as Icon from 'react-icons/lib/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Modal from 'rodal';
import { connect } from 'react-redux';

import BookFlight from './BookFlight';

import { formatDate, formatTime, formatDuration, formatPrice,
    getLayoverDuration, getTotalPrice, getFlightDuration, canBookFlight } from '../actions';

import '../css/FlightDetail.css';
import 'rodal/lib/rodal.css';

class FlightDetail extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            firstFlight: null,
            secondFlight: null,
            lastFlight: null,
            selectedTabIndex: 0, // 0 is first class, 1 is eco class
            showModal: false
        };
        
        this.renderSingleFlight = this.renderSingleFlight.bind(this);
        this.renderRemainingSeats = this.renderRemainingSeats.bind(this);
        this.renderLayOver = this.renderLayOver.bind(this);
        this.renderPriceAndDuration = this.renderPriceAndDuration.bind(this);
        this.renderBookButton = this.renderBookButton.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    componentWillMount() {
        const { firstFlight, secondFlight, lastFlight, showFirstClass } = this.props;
        this.setState({
            firstFlight: firstFlight,
            secondFlight: secondFlight,
            lastFlight: lastFlight,
            selectedTabIndex: showFirstClass ? 0 : 1
        });
    }

    componentWillReceiveProps(nextProps) {
        const { firstFlight, secondFlight, lastFlight, showFirstClass } = nextProps;
        this.setState({
            firstFlight: firstFlight,
            secondFlight: secondFlight,
            lastFlight: lastFlight,
            selectedTabIndex: showFirstClass ? 0 : 1
        });
    }

    renderSingleFlight(flight) {
        if (!flight) {
            return (<div />);
        }

        const { departDate, departTime, arrivalTime,
            departAirportState, destAirportState, airlineName,
            flightNumber, departAirportCode, destAirportCode, duration } = flight;

        return (
            <div className='FlightDetail-flight-container'>
                <div className='FlightDetail-flight-date'>
                    {formatDate(departDate)}
                </div>
                <div className='FlightDetail-flight-default-container'>
                    <div className='FlightDetail-flight-time-container'>
                        <div className='FlightDetail-flight-time'>
                            {formatTime(departTime)}
                        </div>
                        <div
                            className='FlightDetail-flight-time'
                            style={{ marginLeft: 5, marginRight: 5 }}
                        >
                            —
                        </div>
                        <div className='FlightDetail-flight-time'>
                            {formatTime(arrivalTime)}
                        </div>
                    </div>
                    {this.renderRemainingSeats(flight)}
                    <div className='FlightDetail-flight-state-container'>
                        <div className='FlightDetail-flight-state'>
                            {departAirportState}
                        </div>
                        <div
                            className='FlightDetail-flight-state'
                            style={{ marginLeft: 5, marginRight: 5 }}
                        >
                            -
                        </div>
                        <div className='FlightDetail-flight-state'>
                            {destAirportState}
                        </div>
                    </div>
                    <div className='FlightDetail-flight-info-container'>
                        <div className='FlightDetail-flight-info'>
                            {airlineName}
                        </div>
                        <div className='FlightDetail-flight-info'>
                            {flightNumber}
                        </div>
                        <div className='FlightDetail-flight-info'>
                            •
                        </div>
                        <div className='FlightDetail-flight-info'>
                            {departAirportCode}
                        </div>
                        <div className='FlightDetail-flight-info'>
                            -
                        </div>
                        <div className='FlightDetail-flight-info'>
                            {destAirportCode}
                        </div>
                    </div>
                </div>
                <div className='FlightDetail-flight-duration'>
                    {formatDuration(duration)}
                </div>
            </div>
        );
    }

    renderRemainingSeats(flight) {
        if (this.state.selectedTabIndex === 0) {
            const { firstClassRemain } = flight;

            return (
                <div className='FlightDetail-flight-info-container'>
                    <div
                        className='FlightDetail-flight-seat'
                        style={{ color: firstClassRemain <= 1 ? '#F44336' : '#4099FF' }}
                    >
                        {firstClassRemain}
                    </div>
                    <div
                        className='FlightDetail-flight-seat'
                        style={{ marginLeft: 5, color: firstClassRemain <= 1 ? '#F44336' : '#4099FF' }}
                    >
                        seats available
                    </div>
                </div>
            );
        }

        const { ecoClassRemain } = flight;

        return (
            <div className='FlightDetail-flight-info-container'>
                <div
                    className='FlightDetail-flight-seat'
                    style={{ color: ecoClassRemain <= 1 ? '#F44336' : '#4099FF' }}
                >
                    {ecoClassRemain}
                </div>
                <div
                    className='FlightDetail-flight-seat'
                    style={{ marginLeft: 5, color: ecoClassRemain <= 1 ? '#F44336' : '#4099FF' }}
                >
                    seats available
                </div>
            </div>
        );
    }

    renderLayOver(flight1, flight2) {
        if (!flight1 || !flight2) {
            return (<div />);
        }

        const { arrivalTime } = flight1;
        const { departTime, departAirportState, departAirportCode } = flight2;

        return (
            <div className='FlightDetail-layover-container'>
                <div style={{ width: 150 }} />
                <div className='FlightDetail-layover'>
                    Change planes in {departAirportState} ({departAirportCode})
                </div>
                <Icon.MdAutorenew
                    size={20}
                    color='#4099FF'
                />
                <div className='FlightDetail-layover-duration'>
                    {formatDuration(getLayoverDuration(arrivalTime, departTime))}
                </div>
            </div>
        );
    }

    renderPriceAndDuration() {
        const { firstFlight, secondFlight, lastFlight, selectedTabIndex } = this.state;
        const totalPrice = getTotalPrice(firstFlight, secondFlight, lastFlight, selectedTabIndex === 0);
        const totalDuration = getFlightDuration(firstFlight, secondFlight, lastFlight);

        return (
            <div className='FlightDetail-other-info-container'>
                <div className='FlightDetail-flight-default-container'>
                    <div
                        className='FlightDetail-other-info'
                        style={{ textAlign: 'end' }}
                    >
                        Trip Total: {formatDuration(totalDuration)}
                    </div>
                    <div
                        className='FlightDetail-other-info'
                        style={{ textAlign: 'end', marginTop: 10 }}
                    >
                        Price Total: {formatPrice(totalPrice)}
                    </div>
                </div>
            </div>
        );
    }

    renderBookButton() {
        const { firstFlight, secondFlight, lastFlight, selectedTabIndex } = this.state;

        return (
            <div className='FlightDetail-book-button-container'>
                <button
                    className='FlightDetail-book-button'
                    onClick={() => this.setState({ showModal: true })}
                    disabled={!canBookFlight(firstFlight, secondFlight, lastFlight, selectedTabIndex === 0, this.props.ticketCount)}
                >
                    Book Now
                </button>
            </div>
        );
    }

    renderModal() {
        const { firstFlight, secondFlight, lastFlight, selectedTabIndex } = this.state;

        return (
            <BookFlight
                firstFlight={firstFlight}
                secondFlight={secondFlight}
                lastFlight={lastFlight}
                firstClass={selectedTabIndex===0}
                closeModal={() => this.setState({ showModal: false })}
                ticketCount={this.props.ticketCount}
            />
        );
    }

    render() {
        const { firstFlight, secondFlight, lastFlight, selectedTabIndex, showModal } = this.state;

        return (
            <div className='FlightDetail-container'>
                <Tabs
                    defaultIndex={selectedTabIndex}
                    onSelect={(index) => this.setState({ selectedTabIndex: index })}
                >
                    <TabList className='FlightDetail-tab-list'>
                        <Tab
                            className='FlightDetail-tab'
                            tabIndex='0'
                            style={{ color: selectedTabIndex === 0 ? '#4099FF' : 'rgba(64, 153, 255, 0.5)' }}
                        >
                            First Class
                        </Tab>
                        <Tab
                            className='FlightDetail-tab'
                            tabIndex='1'
                            style={{ color: selectedTabIndex === 1 ? '#4099FF' : 'rgba(64, 153, 255, 0.5)' }}
                        >
                            Economy
                        </Tab>
                    </TabList>
                    <TabPanel className='FlightDetail-tab-panel'>
                        {this.renderSingleFlight(firstFlight)}
                        {this.renderLayOver(firstFlight, secondFlight)}
                        {this.renderSingleFlight(secondFlight)}
                        {this.renderLayOver(secondFlight, lastFlight)}
                        {this.renderSingleFlight(lastFlight)}
                        {this.renderPriceAndDuration()}
                        {this.renderBookButton()}
                    </TabPanel>
                    <TabPanel className='FlightDetail-tab-panel'>
                        {this.renderSingleFlight(firstFlight)}
                        {this.renderLayOver(firstFlight, secondFlight)}
                        {this.renderSingleFlight(secondFlight)}
                        {this.renderLayOver(secondFlight, lastFlight)}
                        {this.renderSingleFlight(lastFlight)}
                        {this.renderPriceAndDuration()}
                        {this.renderBookButton()}
                    </TabPanel>
                </Tabs>
                <Modal
                    visible={showModal}
                    onClose={() => this.setState({ showModal: false })}
                    closeOnEsc={true}
                    animation='slideUp'
                    width={600}
                    height={600}
                >
                    {this.renderModal()}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { currentUser } = state.account;
    return { currentUser };
};

export default connect(mapStateToProps, null)(FlightDetail);