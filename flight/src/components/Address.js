import React, { PureComponent } from 'react';
import * as Icon from 'react-icons/lib/md';

import '../css/Address.css';

class Address extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            street: '',
            city: '',
            state: '',
            zipcode: 0,
            country: ''
        };
    }

    componentWillMount() {
        const { street, city, state, zipcode, country } = JSON.parse(this.props.address);
        this.setState({
            street: street,
            city: city,
            state: state,
            zipcode: zipcode,
            country: country
        });
    }

    render() {
        const { street, city, state, zipcode, country } = this.state;
        const { onModifyAddress, deleteAddress } = this.props;

        return (
            <div className='Address-container'>
                <Icon.MdClose
                    size={16}
                    color='white'
                    className='Address-delete-button'
                    onClick={deleteAddress}
                />
                <div className='Address-info'>
                    {street}
                </div>
                <div className='Address-info' style={{ marginTop: 10 }}>
                    {city}, {state} {zipcode}
                </div>
                <div className='Address-info' style={{ marginTop: 10, marginBottom: 10 }}>
                    {country}
                </div>
                <div className='Address-edit-button-container'>
                    <button
                        className='Address-edit-button'
                        onClick={onModifyAddress}
                    >
                        Edit / View
                    </button>
                </div>
            </div>
        );
    }
}

export default Address;