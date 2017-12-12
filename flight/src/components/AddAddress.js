import React, { PureComponent } from 'react';
import Geosuggest from 'react-geosuggest';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';

import '../css/AddAddress.css';

import { addUserAddress } from '../actions';

class AddAddress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            street: '',
            unit: '',
            city: '',
            state: '',
            zipcode: 0,
            country: '',
            loading: false,
            query: ''
        };

        this.renderSuggestItem = this.renderSuggestItem.bind(this);
        this.onItemSelect = this.onItemSelect.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
        this.onAddAddress = this.onAddAddress.bind(this);
        this.renderToast = this.renderToast.bind(this);
    }

    componentWillMount() {
        this.setState({ loading: this.props.loading });
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error, uploaded } = nextProps;
        this.setState({ loading: loading });
        if (error !== '') {
            this.renderToast(error);
        }

        if (uploaded) {
            this.props.onCloseModal();
        }
    }

    renderSuggestItem(suggest) {
        return (
            <div className='AddAddress-suggest'>{suggest.description}</div>
        );
    }

    onItemSelect(suggest) {
        if (!suggest) {
            return;
        }

        const { address_components } = suggest.gmaps;
        const length = address_components.length;
        if (length < 3) {
            this.renderToast('Unable to process this address');
            return;
        }

        this.setState({
            city: address_components[0].long_name,
            country: address_components[length - 1].long_name,
            state: address_components[length - 2].long_name
        });
    }

    renderSubmitButton() {
        if (this.state.loading) {
            return (
                <div className='AddAddress-indicator-container'>
                    <Spinner
                        className='AddAddress-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <button
                className='AddAddress-submit-button'
                onClick={this.onAddAddress}
            >
                Submit
            </button>
        );
    }

    renderToast(error) {
        toast(error, { className: 'AddAddress-toast' });
    }

    onAddAddress() {
        let { street, unit, zipcode, city, state, country } = this.state;

        street = street.replace(/,/g, ' ');
        unit = unit.replace(/,/g, ' ');

        const streetNoSpace = street.replace(/ /g, '');
        const cityNoSpace = city.replace(/ /g, '');

        if (streetNoSpace === '') {
            this.renderToast('Please enter a valid street address');
        } else if (String(zipcode).length < 5) {
            this.renderToast('Please enter a valid zipcode');
        } else if (cityNoSpace === '') {
            this.renderToast('Please select a city, state and country');
        } else {
            if (unit.replace(/ /g, '') !== '') {
                street = street + ', ' + unit;
            }

            this.props.addUserAddress(this.props.uid, street, city, state, zipcode, country);
        }
    }

    render() {
        const { street, unit, zipcode, loading, query } = this.state;

        return (
            <div className='AddAddress-container'>
                <div className='AddAddress-label'>Street *</div>
                <div className='AddAddress-input-container'>
                    <input
                        className='AddAddress-input'
                        value={street}
                        maxLength={40}
                        disabled={loading}
                        onChange={(event) => this.setState({ street: event.target.value })}
                    />
                    <div className='AddAddress-char-count-container'>
                        <div className='AddAddress-char-count'>{street.length} / 40</div>
                    </div>
                </div>
                <div className='AddAddress-label'>Unit</div>
                <div className='AddAddress-input-container'>
                    <input
                        className='AddAddress-input'
                        value={unit}
                        maxLength={40}
                        disabled={loading}
                        onChange={(event) => this.setState({ unit: event.target.value })}
                    />
                    <div className='AddAddress-char-count-container'>
                        <div className='AddAddress-char-count'>{unit.length} / 40</div>
                    </div>
                </div>
                <div className='AddAddress-label'>Zipcode *</div>
                <div className='AddAddress-input-container'>
                    <input
                        className='AddAddress-input'
                        value={zipcode}
                        maxLength={10}
                        disabled={loading}
                        type='number'
                        onChange={(event) => this.setState({ zipcode: event.target.value })}
                    />
                    <div className='AddAddress-char-count-container'>
                        <div className='AddAddress-char-count'>{String(zipcode).length} / 10</div>
                    </div>
                </div>
                <div className='AddAddress-label'>City * & State * & Country *</div>
                <Geosuggest
                    inputClassName='AddAddress-input'
                    initialValue={query}
                    disabled={loading}
                    placeholder='Search'
                    types={['(cities)']}
                    onChange={(value) => this.setState({ query: value })}
                    renderSuggestItem={this.renderSuggestItem}
                    suggestsClassName='AddAddress-suggests'
                    onSuggestSelect={this.onItemSelect}
                    suggestsHiddenClassName='AddAddress-suggests--hidden'
                />
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
    const { loading, error, uploaded } = state.userAddress;
    return { loading, error, uploaded };
};

export default connect(mapStateToProps, { addUserAddress })(AddAddress);