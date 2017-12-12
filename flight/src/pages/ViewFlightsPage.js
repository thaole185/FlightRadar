import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/lib/md';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinkit';
import Checkbox from 'rc-checkbox';
import Modal from 'rodal';

import Flight from '../components/Flight';
import FlightDetail from '../components/FlightDetail';

import '../css/ViewFlightsPage.css';
import 'rodal/lib/rodal.css';
import 'rc-checkbox/assets/index.css';

import logo from '../logo.svg';

import { searchFlights, sortFlights, getFlightsArray,
    getModalHeight, filterFlightsWithEnoughtSeats } from '../actions';
import { isArray } from 'util';

const getParam = (key) => {
    const query = window.location.search.substring(1);
    const params = query.split('&');
    for (var i = 0; i < params.length; ++i) {
        const pair = params[i].split('=');
        if (pair[0] === key) {
            return pair[1];
        }
    }

    return null;
};

class ViewFlightsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roundTrip: false,
            loading: false,
            departFlights: [],
            returnFlights: [],
            badRequest: false,
            returnFlight: false,
            nonStopFlight: true,
            oneStopFlight: true,
            twoStopFlight: true,
            firstClassTicket: false,
            sortBy: 'price',
            maxStops: 0,
            viewFlightDetail: false,
            detailFlightFirst: null,
            detailFlightSecond: null,
            detailFlightLast: null,
            ticketCount: 0
        };

        this.renderHeader = this.renderHeader.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.renderToast = this.renderToast.bind(this);
        this.renderMainPage = this.renderMainPage.bind(this);
        this.renderMainPageMenu = this.renderMainPageMenu.bind(this);
        this.renderOneStopCheckbox = this.renderOneStopCheckbox.bind(this);
        this.renderTwoStopCheckbox = this.renderTwoStopCheckbox.bind(this);
        this.renderFlightView = this.renderFlightView.bind(this);
        this.renderReturnFlights = this.renderReturnFlights.bind(this);
        this.renderDepartFlights = this.renderDepartFlights.bind(this);
        this.renderFlights = this.renderFlights.bind(this);
        this.onViewFlightDetail = this.onViewFlightDetail.bind(this);
        this.renderModal = this.renderModal.bind(this);
    }

    componentWillMount() {
        const departAirportCode = getParam('depart_airport');
        const destAirportCode = getParam('dest_airport');
        const departDate = getParam('depart_date');
        const returningDate = getParam('return_date');
        const ticketCount = parseInt(getParam('tickets'), 10);
        const maxPrice = parseFloat(getParam('max_price'));
        const maxConnections = parseInt(getParam('max_stops'), 10);
        const maxDuration = parseFloat(getParam('max_duration'));
        
        if (!departAirportCode ||
            !destAirportCode ||
            !departDate ||
            !returningDate ||
            ticketCount === null ||
            maxPrice === null ||
            maxConnections === null ||
            maxDuration === null) {
            this.setState({ badRequest: true });
        } else {
            this.setState({
                maxStops: maxConnections,
                ticketCount: ticketCount
            });

            this.props.searchFlights(departAirportCode, destAirportCode,
                departDate, returningDate, ticketCount, maxPrice, maxConnections, maxDuration);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error, departFlights, returnFlights, roundTrip } = nextProps;
        const { maxStops, ticketCount } = this.state;

        if (!loading) {
            this.setState({
                loading: false,
                departFlights: filterFlightsWithEnoughtSeats(getFlightsArray(maxStops, departFlights), ticketCount),
                returnFlights: filterFlightsWithEnoughtSeats(getFlightsArray(maxStops, returnFlights), ticketCount),
                roundTrip: roundTrip
            });
        } else {
            this.setState({ loading: true });
        }

        if (error !== '') {
            this.renderToast(error);
        }
    }

    renderToast(error) {
        toast(error, { className: 'ViewFlightsPage-toast' });
    }

    renderHeader() {
        return (
            <header className='ViewFlightsPage-header'>
                <div className='ViewFlightsPage-header-label'>
                    <Link to='/'>
                        <img className='ViewFlightsPage-logo' src={logo} alt='logo' />
                    </Link>
                    <div>We are excited to help you manage your flights</div>
                </div>
                <Link to='/'>
                    <Icon.MdFlightTakeoff
                        size={26}
                        className='ViewFlightsPage-new-search-icon'
                    />
                </Link>
            </header>
        );
    }

    renderFooter() {
        return (
            <div className='ViewFlightsPage-footer'>
                <div className='ViewFlightsPage-footer-info-container'>
                    <div className='ViewFlightsPage-footer-info-group-container'>
                        <div className='ViewFlightsPage-footer-info-header'>Contact</div>
                        <div className='ViewFlightsPage-footer-info'>
                            tle18@hawk.iit.edu
                        </div>
                        <div className='ViewFlightsPage-footer-info'>
                            tle18@hawk.iit.edu
                        </div>
                        <div className='ViewFlightsPage-footer-info'>
                            pwright2@hawk.iit.edu
                        </div>
                        <div className='ViewFlightsPage-footer-info'>
                            ttran22@hawk.iit.edu
                        </div>
                    </div>
                    <div className='ViewFlightsPage-footer-info-group-container'>
                        <div className='ViewFlightsPage-footer-info-header'>Company</div>
                        <a
                            className='ViewFlightsPage-footer-info'
                            href='https://web.iit.edu'
                        >
                            Illinois Institude of Technology
                        </a>
                    </div>
                    <div className='ViewFlightsPage-footer-info-group-container'>
                        <div className='ViewFlightsPage-footer-info-header'>Copyright</div>
                        <div className='ViewFlightsPage-footer-info'>©2017 CS425 Team 2 </div>
                    </div>
                </div>
                <div className='ViewFlightsPage-footer-right-container'>
                    All rights reserved for CS425 Team 2
                </div>
            </div>
        );
    }

    renderMainPage() {
        if (this.state.loading) {
            return (
                <div className='ViewFlightsPage-main'>
                    <div className='ViewFlightsPage-indicator-container'>
                        <Spinner
                            className='ViewFlightsPage-activity-indicator'
                            fadeIn='none'
                            name='circle'
                            color='black'
                        />
                    </div>
                </div>
            );
        }

        return (
            <div className='ViewFlightsPage-main'>
                {this.renderMainPageMenu()}
                <div className='ViewFlightsPage-main-list'>
                    {this.renderFlightView()}
                </div>                    
            </div>
        );
    }

    renderFlightView() {
        const { returnFlight, returnFlights, departFlights } = this.state;

        if ((returnFlight && returnFlights.length === 0) ||
            (!returnFlights && departFlights.length === 0)) {
            return (
                <div style={{ fontSize: 24, color: 'black', marginTop: 20, fontWeight: 'bold' }}>
                    Whoops, we couldn't find any flights : (
                </div>
            );
        } else if (returnFlight) {
            return this.renderReturnFlights();
        }

        return this.renderDepartFlights();
    }

    renderReturnFlights() {
        let { sortBy, returnFlights, firstClassTicket } = this.state;

        return this.renderFlights(sortFlights(returnFlights, sortBy, firstClassTicket));
    }

    renderDepartFlights() {
        let { sortBy, departFlights, firstClassTicket } = this.state;

        return this.renderFlights(sortFlights(departFlights, sortBy, firstClassTicket));
    }

    renderFlights(flights) {
        const { firstClassTicket, nonStopFlight, oneStopFlight, twoStopFlight } = this.state;

        return flights.map((flight, index) => {
            if (isArray(flight)) {
                if (flight.length === 2 && oneStopFlight) {
                    return (
                        <Flight
                            key={index}
                            firstFlight={flight[0]}
                            secondFlight={flight[1]}
                            lastFlight={null}
                            showFirstClass={firstClassTicket}
                            onViewFlightDetail={(firstFlight, secondFlight, lastFlight) => this.onViewFlightDetail(firstFlight, secondFlight, lastFlight)}
                        />
                    );
                } else if (flight.length === 3 && twoStopFlight) {
                    return (
                        <Flight
                            key={index}
                            firstFlight={flight[0]}
                            secondFlight={flight[1]}
                            lastFlight={flight[2]}
                            showFirstClass={firstClassTicket}
                            onViewFlightDetail={(firstFlight, secondFlight, lastFlight) => this.onViewFlightDetail(firstFlight, secondFlight, lastFlight)}
                        />
                    );
                } else {
                    return (<div />);
                }
            }

            if (nonStopFlight) {
                return (
                    <Flight
                        key={index}
                        firstFlight={flight}
                        secondFlight={null}
                        lastFlight={null}
                        showFirstClass={firstClassTicket}
                        onViewFlightDetail={(firstFlight, secondFlight, lastFlight) => this.onViewFlightDetail(firstFlight, secondFlight, lastFlight)}
                    />
                );
            } else {
                return (<div />);
            }
        });
    }

    onViewFlightDetail(firstFlight, secondFlight, lastFlight) {
        this.setState({
            viewFlightDetail: true,
            detailFlightFirst: firstFlight,
            detailFlightSecond: secondFlight,
            detailFlightLast: lastFlight
        });
    }

    renderMainPageMenu() {
        const { roundTrip, returnFlight, nonStopFlight, firstClassTicket, sortBy } = this.state;

        return (
            <div className='ViewFlightsPage-main-menu'>
                <div>
                    <ul>
                        <button
                            className='ViewFlightsPage-main-menu-button'
                            onClick={() => this.setState({ returnFlight: false })}
                            style={{
                                fontWeight: returnFlight ? '300' : 'bold'
                            }}
                        >
                            Depart Flights
                        </button>
                    </ul>
                    <ul>
                        <button
                            className='ViewFlightsPage-main-menu-button'
                            style={{
                                fontWeight: returnFlight ? 'bold' : '300'
                            }}
                            onClick={() => this.setState({ returnFlight: true })}
                            disabled={!roundTrip}
                        >
                            Return Flights
                        </button>
                    </ul>
                </div>
                <div style={{ marginTop: 50 }}>
                    <ul>
                        <label className='ViewFlightsPage-checkbox-label'>
                            <Checkbox
                                checked={nonStopFlight}
                                onChange={() => this.setState({ nonStopFlight: !nonStopFlight })}
                            />
                            &nbsp; Non-stop
                        </label>
                    </ul>
                    {this.renderOneStopCheckbox()}
                    {this.renderTwoStopCheckbox()}
                </div>
                <div style={{ marginTop: 30 }}>
                    <ul>
                        <label className='ViewFlightsPage-checkbox-label'>
                            <Checkbox
                                checked={firstClassTicket}
                                onChange={() => this.setState({ firstClassTicket: !firstClassTicket })}
                            />
                            &nbsp; Show first class
                        </label>
                    </ul>
                </div> 
                <div style={{ marginTop: 50 }}>
                    <ul>
                        <button
                            className='ViewFlightsPage-main-menu-sort-button'
                            onClick={() => this.setState({ sortBy: 'price' })}
                            style={{
                                backgroundColor: sortBy === 'price' ? '#DFDFDF' : 'rgba(0, 0, 0, 0)'
                            }}
                        >
                            Sort by price
                        </button>
                    </ul>
                    <ul>
                        <button
                            className='ViewFlightsPage-main-menu-sort-button'
                            style={{
                                backgroundColor: sortBy === 'duration' ? '#DFDFDF' : 'rgba(0, 0, 0, 0)',
                                marginTop: 0
                            }}
                            onClick={() => this.setState({ sortBy: 'duration' })}
                        >
                            Sort by duration
                        </button>
                    </ul>                       
                </div>                    
            </div>
        );
    }

    renderOneStopCheckbox() {
        const { maxStops, oneStopFlight } = this.state;

        if (maxStops === 0) {
            return (<div />);
        }

        return (
            <ul>
                <label className='ViewFlightsPage-checkbox-label'>
                    <Checkbox
                        checked={oneStopFlight}
                        onChange={() => this.setState({ oneStopFlight: !oneStopFlight })}
                    />
                    &nbsp; 1-stop
                </label>
            </ul>
        );
    }

    renderTwoStopCheckbox() {
        const { maxStops, twoStopFlight } = this.state;

        if (maxStops <= 1) {
            return (<div />);
        }

        return (
            <ul>
                <label className='ViewFlightsPage-checkbox-label'>
                    <Checkbox
                        checked={twoStopFlight}
                        onChange={() => this.setState({ twoStopFlight: !twoStopFlight })}
                    />
                    &nbsp; 2-stop
                </label>
            </ul>
        );
    }

    renderModal() {
        const { detailFlightFirst, detailFlightSecond,
            detailFlightLast, ticketCount, firstClassTicket } = this.state;

        return (
            <FlightDetail
                firstFlight={detailFlightFirst}
                secondFlight={detailFlightSecond}
                lastFlight={detailFlightLast}
                ticketCount={ticketCount}
                showFirstClass={firstClassTicket}
            />
        );
    }

    render() {
        const { badRequest, viewFlightDetail,
            detailFlightSecond, detailFlightLast } = this.state;

        if (badRequest) {
            return (
                <div className='ViewFlightsPage-container'>
                    {this.renderHeader()}
                    <div className='ViewFlightsPage-expire'>
                        Error: Please re-search to view flight details
                    </div>
                </div>
            );
        }

        return (
            <div className='ViewFlightsPage-container'>
                {this.renderHeader()}
                {this.renderMainPage()}
                {this.renderFooter()}
                <Modal
                    visible={viewFlightDetail}
                    onClose={() => this.setState({ viewFlightDetail: false })}
                    closeOnEsc={true}
                    animation='zoom'
                    width={600}
                    height={getModalHeight(detailFlightSecond, detailFlightLast)}
                >
                    {this.renderModal()}
                </Modal>
                <ToastContainer
                    position='top-right'
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick={true}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { loading, error, departFlights, returnFlights, roundTrip } = state.flight;
    return { loading, error, departFlights, returnFlights, roundTrip };
};

export default connect(mapStateToProps, { searchFlights })(ViewFlightsPage);