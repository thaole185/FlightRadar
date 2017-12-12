import React, { PureComponent } from 'react';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

import '../css/AddPayment.css';

import { addCreditCard, loadUserAddress } from '../actions';

const hasExpired = (month, year) => {
    const currentDate = moment();
    const currentMonth = currentDate.month() + 1;
    const currentYear = parseInt(currentDate.year().toString().slice(2, 4), 10);

    if (year < currentYear) {
        return true;
    }

    if (year === currentYear && month <= currentMonth) {
        return true;
    }

    return false;
};

class AddPayment extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loadingAddress: false,
            cardNumber: '',
            month: '',
            year: '',
            addressId: '',
            addresses: [],
            addressesLoaded: false,
            uploading: false,
            chosenAddressIndex: -1
        };

        this.renderToast = this.renderToast.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
        this.onAddPayment = this.onAddPayment.bind(this);
        this.renderBillingAddressOptions = this.renderBillingAddressOptions.bind(this);
        this.onLoadAddressBook = this.onLoadAddressBook.bind(this);
    }

    componentWillMount() {
        this.setState({ loading: this.props.loading });
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error, uploaded, loadingAddress, addresses } = nextProps;
        this.setState({
            loading: loading,
            loadingAddress: loadingAddress,
            addresses: addresses
        });
        
        if (error !== '') {
            this.renderToast(error);
        }

        if(uploaded && this.state.uploading) {
            this.props.onCloseModal();
        }
    }

    renderToast(error) {
        toast(error, { className: 'AddPayment-toast' });
    }

    renderSubmitButton() {
        if (this.state.loading) {
            return (
                <div className='AddPayment-indicator-container'>
                    <Spinner
                        className='AddPayment-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <button
                className='AddPayment-submit-button'
                onClick={this.onAddPayment}
            >
                Submit
            </button>
        );
    }

    onAddPayment() {
        this.setState({ uploading: true });
        const { cardNumber, month, year, addressId } = this.state;

        const cardNumberFormat = /^\d{16}$/;
        const monthFormat = /^([0][1-9])|([1][0-2])$/;
        const yearFormat = /^\d{2}$/;

        if (!cardNumberFormat.test(cardNumber)) {
            this.renderToast('Enter a valid 16-digit card number');
        } else if (!monthFormat.test(month) || !yearFormat.test(year)) {
            this.renderToast('Enter a valid expiration date');
        } else if (hasExpired(parseInt(month, 10), parseInt(year, 10))) {
            this.renderToast('This card has already expired');
        } else if (addressId === '') {
            this.renderToast('Please pick an address from your address book');
        } else {
            this.props.addCreditCard(this.props.currentUser.uid, `${month}/${year}`, cardNumber, addressId)
        }
    }

    renderBillingAddressOptions() {
        const { loadingAddress, addressesLoaded, addresses, chosenAddressIndex } = this.state;
        
        if (loadingAddress) {
            return (
                <Spinner
                    fadeIn='none'
                    name='circle'
                    color='black'
                    style={{ width: 20, height: 20, marginTop: 5, marginLeft: 10 }}
                />
            );
        } else if (!addressesLoaded) {
            return (
                <button
                    className='AddPayment-load-address-button'
                    onClick={this.onLoadAddressBook}
                >
                    Choose from my address book
                </button>
            );
        } else if (addresses.length === 0) {
            return (
                <div className='AddPayment-description'>
                    You don't have have any address in your address book, please add an address to your account first
                </div>
            );
        } else {
            return (
                <div className='AddPayment-addresses-container'>
                    {
                        addresses.map((address, index) => {
                            const { address_id, street, city, state, zipcode, country } = JSON.parse(address);
                            let addressToDisplay = `${street}, ${city}, ${state}, ${zipcode}, ${country}`;
                            addressToDisplay = addressToDisplay.length > 32 ? `${addressToDisplay.slice(0, 32)}...` : addressToDisplay;
                            
                            return (
                                <button
                                    key={index}
                                    className='AddPayment-address-button'
                                    onClick={() => this.onChooseBillingAddress(index, address_id)}
                                    style={{ fontWeight: index === chosenAddressIndex ? '600' : '100' }}
                                >
                                    {addressToDisplay}
                                </button>
                            );
                        })
                    }
                </div>
            );
        }
    }

    onChooseBillingAddress(index, address_id) {
        this.setState({
            chosenAddressIndex: index,
            addressId: address_id
        });
    }

    onLoadAddressBook() {
        this.setState({ addressesLoaded: true });
        this.props.loadUserAddress(this.props.currentUser.uid);
    }

    render() {
        const { cardNumber, month, year, loading } = this.state;
        const { firstName, lastName } = this.props.currentUser;

        return (
            <div className='AddPayment-container'>
                <div className='AddPayment-label'>Cardholder *</div>
                <input
                    className='AddPayment-input'
                    value={`${firstName} ${lastName}`}
                    disabled={true}
                    style={{ backgroundColor: '#F0F0F0', borderWidth: 0, marginTop: 5, paddingLeft: 5 }}
                />
                <div className='AddPayment-label'>Card Number *</div>
                <div className='AddPayment-input-container'>
                    <input
                        className='AddPayment-input'
                        maxLength={16}
                        disabled={loading}
                        value={cardNumber}
                        placeholder='Enter 16 digit credit card number'
                        onChange={(event) => this.setState({ cardNumber: event.target.value })}
                    />
                    <div className='AddPayment-char-count'>{cardNumber.length} / 16</div>
                </div>
                <div className='AddPayment-label'>Expiration Date *</div>
                <div className='AddPayment-input-container' style={{ justifyContent: 'flex-start' }}>
                    <input
                        className='AddPayment-input'
                        maxLength={2}
                        disabled={loading}
                        value={month}
                        style={{ width: '20%' }}
                        placeholder='Month'
                        onChange={(event) => this.setState({ month: event.target.value })}
                    />
                    <input
                        className='AddPayment-input'
                        maxLength={2}
                        disabled={loading}
                        value={year}
                        style={{ width: '20%' }}
                        placeholder='Year'
                        onChange={(event) => this.setState({ year: event.target.value })}
                    />
                </div>
                <div className='AddPayment-label'>Billing Address *</div>
                {this.renderBillingAddressOptions()}
                {this.renderSubmitButton()}
                <ToastContainer
                    position='top-right'
                    autoClose={5000}
                    newestOnTop={true}
                    closeOnClick={true}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { loading, error, uploaded } = state.creditCard;
    const { loading: loadingAddress, addresses } = state.userAddress;
    return { loading, error, uploaded, loadingAddress, addresses };
};

export default connect(mapStateToProps, { addCreditCard, loadUserAddress })(AddPayment);