import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';

import { getFlightDuration, getTotalPrice, formatPrice, formatDuration,
    getDepartDestStates, loadCreditCard, bookFlight, getFlightIds } from '../actions';

import '../css/BookFlight.css';

class BookFlight extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            processing: false,
            loadingPayments: false,
            payments: [],
            selectedPaymentIndex: -1,
            paymentsLoaded: false,
            cid: ''
        };

        this.renderPaymentOptions = this.renderPaymentOptions.bind(this);
        this.renderToast = this.renderToast.bind(this);
        this.onLoadPaymentMethods = this.onLoadPaymentMethods.bind(this);
        this.onChoosePaymentMethod = this.onChoosePaymentMethod.bind(this);
        this.renderBookButton = this.renderBookButton.bind(this);
        this.onBookFlight = this.onBookFlight.bind(this);
    }

    componentWillMount() {
        const { loadingPayments, processing } = this.props;

        this.setState({
            loadingPayments: loadingPayments,
            processing: processing
        });
    }

    componentWillReceiveProps(nextProps) {
        const { loadingPayments, paymentError,
            payments, processing, booked, bookingError } = nextProps;
        this.setState({
            loadingPayments: loadingPayments,
            payments: payments,
            processing: processing
        });

        if (paymentError !== '') {
            this.renderToast(paymentError);
        }

        if (bookingError !== '') {
            this.renderToast(bookingError);
        }

        if (booked) {
            this.props.closeModal();
        }
    }

    renderToast(error) {
        toast(error, { className: 'Register-toast' });
    }

    renderPaymentOptions() {
        const { loadingPayments, paymentsLoaded, payments, selectedPaymentIndex } = this.state;
        
        if (loadingPayments) {
            return (
                <div className='BookFlight-indicator-container'>
                    <Spinner
                        className='BookFlight-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                    <div style={{ fontSize: 18, color: 'black', marginLeft: 10 }}>
                        Loading ...
                    </div>
                </div>
            );
        } else if (!paymentsLoaded) {
            return (
                <button
                    className='BookFlight-button'
                    onClick={this.onLoadPaymentMethods}
                >
                    Choose from my saved payment methods
                </button>
            );
        } else if (payments.length === 0) {
            return (
                <div className='BookFlight-description'>
                    You don't have have any payment methods stored, please add a payment method first
                </div>
            );
        }

        return (
            <div className='BookFlight-payments-container'>
                {
                    payments.map((payment, index) => {
                        const { cardNumber, cid } = JSON.parse(payment);
                        const cardToDisplay = `Credit card ending with ${cardNumber.slice(12, 16)}`;

                        return (
                            <button
                                key={index}
                                className='BoodFlight-payments-button'
                                onClick={() => this.onChoosePaymentMethod(index, cid)}
                                style={{ fontWeight: index === selectedPaymentIndex ? '600' : '100' }}
                            >
                                {cardToDisplay}
                            </button>
                        );
                    })
                }
            </div>
        );
    }
    
    onLoadPaymentMethods() {
        const { currentUser, loadCreditCard } = this.props;
        this.setState({ paymentsLoaded: true });
        loadCreditCard(currentUser.uid);
    }

    onChoosePaymentMethod(index, cid) {
        this.setState({
            selectedPaymentIndex: index,
            cid: cid
        });
    }

    renderBookButton() {
        if (this.state.processing) {
            return (
                <div className='BookFlight-process-indicator-container'>
                    <Spinner
                        className='BookFlight-process-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <div className='BookFlight-book-button-container'>
                <button
                    className='BookFlight-book-button'
                    onClick={this.onBookFlight}
                >
                    Place Order
                </button>
            </div>
        );
    }

    onBookFlight() {
        const { cid } = this.state;

        if (cid === '') {
            this.renderToast('Please select a payment method');
        } else {
            const { currentUser, firstClass, ticketCount,
                firstFlight, secondFlight, lastFlight, bookFlight } = this.props;
            const seat = firstClass ? 'first' : 'economy';
            const flightIds = getFlightIds(firstFlight, secondFlight, lastFlight);

            bookFlight(currentUser.uid, cid, seat, ticketCount, flightIds);
        }
    }

    render() {
        const { currentUser, firstFlight, secondFlight, lastFlight, firstClass } = this.props;
        const { departState, destState } = getDepartDestStates(firstFlight, secondFlight, lastFlight);
        const priceTotal = getTotalPrice(firstFlight, secondFlight, lastFlight, firstClass);
        const durationToal = getFlightDuration(firstFlight, secondFlight, lastFlight);

        if (!currentUser) {
            return (
                <div className='BookFlight-header'>
                    You're not yet logged in, please go to main page to sign in first
                </div>
            );
        }

        return (
            <div className='BookFlight-container'>
                <div className='BookFlight-header-container'>
                    <div className='BookFlight-header-line-container'>
                        <div className='BookFlight-header'>
                            Your trip from
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10, color: '#4099FF' }}
                        >
                            {departState}
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10 }}
                        >
                            to
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10, color: '#4099FF' }}
                        >
                            {destState}
                        </div>
                    </div>
                    <div
                        className='BookFlight-header-line-container'
                        style={{ marginTop: 5 }}
                    >
                        <div
                            className='BookFlight-header'
                            style={{ color: '#4099FF' }}
                        >
                            {formatDuration(durationToal)}
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10 }}
                        >
                            to destination,
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10 }}
                        >
                            for
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ color: '#4099FF', marginLeft: 10 }}
                        >
                            {formatPrice(priceTotal)}
                        </div>
                        <div
                            className='BookFlight-header'
                            style={{ marginLeft: 10 }}
                        >
                            (tax included)
                        </div>
                    </div>
                </div>
                <div className='BookFlight-label'>
                    Payment
                </div>
                {this.renderPaymentOptions()}
                {this.renderBookButton()}
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
    const { currentUser } = state.account;
    const { loading: processing, error: bookingError, booked } = state.booking;
    const { loading: loadingPayments, error: paymentError, payments } = state.creditCard;
    return { currentUser, loadingPayments,
        paymentError, payments, processing, bookingError, booked };
};

export default connect(mapStateToProps, { loadCreditCard, bookFlight })(BookFlight);