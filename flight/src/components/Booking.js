import React, { PureComponent } from 'react';
import * as Icon from 'react-icons/lib/md';
import Modal from 'rodal';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

import FlightDetail from './FlightDetail';

import { getTotalPrice, formatPrice, sortFlightsByTime,
    formatTime, getModalHeight, canCancelBooking, cancelBooking } from '../actions';

import '../css/Booking.css';

class Booking extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bookingId: '',
            date: '',
            seat: '',
            cardNumber: '',
            ticketCount: 0,
            flights: [],
            modalType: '',
            loading: false
        };

        this.renderFlights = this.renderFlights.bind(this);
        this.renderFlight = this.renderFlight.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.renderCancelButton = this.renderCancelButton.bind(this);
        this.renderCancelBookingModal = this.renderCancelBookingModal.bind(this);
        this.renderCancelButtons = this.renderCancelButtons.bind(this);
        this.renderToast = this.renderToast.bind(this);
        this.onCancelBooking = this.onCancelBooking.bind(this);
    }

    componentWillMount() {
        const { loading, booking } = this.props;
        const { bid, date, class: seat,
            cardNumber, ticketCount, flights } = booking;
        
            this.setState({
            bookingId: bid,
            date: date,
            seat: seat,
            cardNumber: cardNumber,
            ticketCount: parseInt(ticketCount, 10),
            flights: flights,
            loading: loading
        });
    }

    componentWillReceiveProps(nextProps) {
        const { loading, booking, error, canceled } = nextProps;
        const { bid, date, class: seat,
            cardNumber, ticketCount, flights } = booking;

        this.setState({
            bookingId: bid,
            date: date,
            seat: seat,
            cardNumber: cardNumber,
            ticketCount: parseInt(ticketCount, 10),
            flights: flights,
            loading: loading,
            modalType: canceled ? '' : this.state.modalType
        });

        if (!error) {
            this.renderToast(error);
        }
    }

    renderToast(error) {
        toast(error, { className: 'SearchPanel-toast' });
    }

    renderFlight(flight, index) {
        const { departAirportState, destAirportState, departTime, departAirportCode } = flight;

        return (
            <div className='Booking-flight-container' key={index}>
                <div className='Booking-flight-header'>
                    Flight #{index + 1}
                </div>
                <div className='Booking-flight-info-container'>
                    <div className='Booking-flight-info'>
                        {departAirportState}
                    </div>
                    <Icon.MdFlightTakeoff
                        size={20}
                        color='black'
                        style={{ marginLeft: 15, marginRight: 15 }}
                    />
                    <div className='Booking-flight-info'>
                        {destAirportState},
                    </div>
                    <div
                        className='Booking-flight-info'
                        style={{ marginLeft: 10 }}
                    >
                        at {formatTime(departTime)} from {departAirportCode}
                    </div>
                </div>
            </div>
        );
    }

    renderFlights() {
        const flights = sortFlightsByTime(this.state.flights);

        return flights.map((flight, index) => {
            return this.renderFlight(flight, index);
        });
    }

    renderModal() {
        const { modalType, flights, ticketCount, seat } = this.state;

        switch (modalType) {
            case 'flightDetail':
                return (
                    <FlightDetail
                        firstFlight={flights[0]}
                        secondFlight={flights[1]}
                        lastFlight={flights[2]}
                        ticketCount={ticketCount}
                        showFirstClass={seat === 'first'}
                    />
                );
            case 'cancelBooking':
                return this.renderCancelBookingModal();
            default:
                return (<div />);
        }
    }

    renderCancelBookingModal() {
        return (
            <div>
                <div className='Booking-label' style={{ marginTop: 20 }}>
                    Are you sure you want to cancel this booking?
                </div>
                <div className='Booking-sublabel'>
                    You will get a full refund if you cancel within 24 hours of booking, otherwise bookings are not refundable
                </div>
                {this.renderCancelButtons()}
            </div>
        );
    }

    renderCancelButtons() {
        if (this.state.loading) {
            return (
                <div className='Booking-indicator-container'>
                    <Spinner
                        className='Booking-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <div className='Booking-button-container'>
                <button
                    className='Booking-button'
                    onClick={() => this.setState({ modalType: '' })}
                >
                    Don't Cancel
                </button>
                <button
                    className='Booking-button'
                    style={{ backgroundColor: '#F44336' }}
                    onClick={this.onCancelBooking}
                >
                    Cancel Booking
                </button>
            </div>
        );
    }

    onCancelBooking() {
        const { bookings, index, cancelBooking } = this.props;
        cancelBooking(bookings, this.state.bookingId, index);
    }

    renderCancelButton() {
        const { flights, loading } = this.state;

        if (loading) {
            return (
                <div className='Booking-cancel-button-container'>
                    <Spinner
                        className='Booking-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        } else if (canCancelBooking(flights[0])) {
            return (
                <div className='Booking-cancel-button-container'>
                    <button
                        className='Booking-cancel-button'
                        onClick={() => this.setState({ modalType: 'cancelBooking' })}
                    >
                        Cancel Booking
                    </button>
                </div>
            );
        }

        return (
            <div className='Booking-cancel-button-container'>
                <div className='Booking-description'>
                    This flight has already departed and it cannot be canceled
                </div>
            </div>
        );
    }

    render() {
        const { bookingId, cardNumber, date, flights, seat, ticketCount, modalType } = this.state;

        return (
            <div className='Booking-container'>
                <div className='Booking-default-container'>
                    <div className='Booking-header'>
                        Booking ID:
                    </div>
                    <div
                        className='Booking-header'
                        style={{ marginLeft: 10 }}
                    >
                        {bookingId}
                    </div>
                </div>
                <div className='Booking-default-container'>
                    <div className='Booking-default-font'>
                        Date booked:
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 10 }}
                    >
                        {date}
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 40 }}
                    >
                        Cabin:
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 10, width: 120 }}
                    >
                        {seat === 'economy' ? 'Economy Class' : 'First Class'}
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 40 }}
                    >
                        Travelors:
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 10 }}
                    >
                        {ticketCount}
                    </div>
                </div>
                <div className='Booking-default-container'>
                    <div className='Booking-default-font'>
                        Paid for by card ending with:
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 10 }}
                    >
                        {cardNumber.slice(12, 16)}
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 40 }}
                    >
                        Total Amount:
                    </div>
                    <div
                        className='Booking-default-font'
                        style={{ marginLeft: 10 }}
                    >
                        {formatPrice(ticketCount * getTotalPrice(flights[0], flights[1], flights[2], seat === 'first'))}
                    </div>
                </div>
                {this.renderFlights()}
                <div className='Booking-flight-detail-button-container'>
                    <button
                        className='Booking-flight-detail-button'
                        onClick={() => this.setState({ modalType: 'flightDetail' })}
                    >
                        Show Flight Detail
                    </button>
                </div>
                {this.renderCancelButton()}
                <ToastContainer
                    position='top-right'
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop={true}
                    closeOnClick={true}
                />
                <Modal
                    visible={modalType !== ''}
                    onClose={() => this.setState({ modalType: '' })}
                    closeOnEsc={true}
                    animation='zoom'
                    width={600}
                    height={modalType === 'flightDetail' ? getModalHeight(flights[1], flights[2]) : 150}
                >
                    {this.renderModal()}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { error, loading, bookings, canceled } = state.booking;
    return { error, loading, bookings, canceled };
};

export default connect(mapStateToProps, { cancelBooking })(Booking);