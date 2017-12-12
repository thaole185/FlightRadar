import React, { PureComponent } from 'react';
import Geosuggest from 'react-geosuggest';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';

import '../css/ModifyAddress.css';

import { modifyAddress, getUnit, getStreet } from '../actions';

class ModifyAddress extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            addressId: '',
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
        this.onModifyAddress = this.onModifyAddress.bind(this);
        this.renderToast = this.renderToast.bind(this);
    }

    componentWillMount() {
        const { loading, address } = this.props;
        const { city, state, zipcode, country, address_id } = address;

        this.setState({
            addressId: address_id,
            loading: loading,
            street: getStreet(address),
            unit: getUnit(address),
            city: city,
            state: state,
            zipcode: zipcode,
            country: country
        });
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error, uploaded, address } = nextProps;
        const { city, state, zipcode, country, address_id } = address;

        this.setState({
            addressId: address_id,
            loading: loading,
            street: getStreet(address),
            unit: getUnit(address),
            city: city,
            state: state,
            zipcode: zipcode,
            country: country
        });
        
        if (error !== '') {
            this.renderToast(error);
        }

        if (uploaded) {
            this.props.onCloseModal();
        }
    }

    renderSuggestItem(suggest) {
        return (
            <div className='ModifyAddress-suggest'>{suggest.description}</div>
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
                <div className='ModifyAddress-indicator-container'>
                    <Spinner
                        className='ModifyAddress-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <button
                className='ModifyAddress-submit-button'
                onClick={this.onModifyAddress}
            >
                Submit Changes
            </button>
        );
    }

    renderToast(error) {
        toast(error, { className: 'ModifyAddress-toast' });
    }

    onModifyAddress() {
        let { street, unit, zipcode, city, state, country, addressId } = this.state;
        const { modifyAddress, index } = this.props;

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

            modifyAddress(index, this.props.uid, addressId, street, city, state, zipcode, country);
        }
    }

    render() {
        const { street, unit, zipcode, loading, city, state, country } = this.state;

        return (
            <div className='ModifyAddress-container'>
                <div className='ModifyAddress-header'>
                    Modify Address
                </div>
                <div className='ModifyAddress-label'>Street *</div>
                <div className='ModifyAddress-input-container'>
                    <input
                        className='ModifyAddress-input'
                        value={street}
                        maxLength={40}
                        disabled={loading}
                        onChange={(event) => this.setState({ street: event.target.value })}
                    />
                    <div className='ModifyAddress-char-count-container'>
                        <div className='ModifyAddress-char-count'>{street.length} / 40</div>
                    </div>
                </div>
                <div className='ModifyAddress-label'>Unit</div>
                <div className='ModifyAddress-input-container'>
                    <input
                        className='ModifyAddress-input'
                        value={unit}
                        maxLength={40}
                        disabled={loading}
                        onChange={(event) => this.setState({ unit: event.target.value })}
                    />
                    <div className='ModifyAddress-char-count-container'>
                        <div className='ModifyAddress-char-count'>{unit.length} / 40</div>
                    </div>
                </div>
                <div className='ModifyAddress-label'>Zipcode *</div>
                <div className='ModifyAddress-input-container'>
                    <input
                        className='ModifyAddress-input'
                        value={zipcode}
                        maxLength={10}
                        disabled={loading}
                        type='number'
                        onChange={(event) => this.setState({ zipcode: event.target.value })}
                    />
                    <div className='ModifyAddress-char-count-container'>
                        <div className='ModifyAddress-char-count'>{String(zipcode).length} / 10</div>
                    </div>
                </div>
                <div className='ModifyAddress-label'>City * & State * & Country *</div>
                <Geosuggest
                    inputClassName='ModifyAddress-input'
                    initialValue={`${city}, ${state}, ${country}`}
                    disabled={loading}
                    placeholder='Search'
                    types={['(cities)']}
                    onChange={(value) => this.setState({ query: value })}
                    renderSuggestItem={this.renderSuggestItem}
                    suggestsClassName='ModifyAddress-suggests'
                    onSuggestSelect={this.onItemSelect}
                    suggestsHiddenClassName='ModifyAddress-suggests--hidden'
                />
                <div className='ModifyAddress-description'>
                    The billing address of the payment methods associated with this will also be changed
                </div>
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

export default connect(mapStateToProps, { modifyAddress })(ModifyAddress);