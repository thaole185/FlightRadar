import React, { PureComponent } from 'react';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import Modal from 'rodal';
import { ToastContainer, toast } from 'react-toastify';
import * as Icon from 'react-icons/lib/md';

import Address from './Address';
import ModifyAddress from './ModifyAddress';
import AddAddress from './AddAddress';

import '../css/Account.css';

import { loadUserAddress, deleteUserAddress } from '../actions';

const getHeight = (modalType) => {
    switch (modalType) {
        case 'addAddress':
            return 360;
        case 'deleteAddress':
            return 130;
        default:
            return 430;
    }
};

class Account extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            homeAirport: '',
            loading: false,
            addresses: [],
            modalType: '',
            targetAddressIndex: 0,
            modifyIndex: 0
        };

        this.renderAddressInformation = this.renderAddressInformation.bind(this);
        this.deleteAddress = this.deleteAddress.bind(this);
        this.renderAddAddressButton = this.renderAddAddressButton.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.renderAddAddressView = this.renderAddAddressView.bind(this);
        this.renderDeleteAddressView = this.renderDeleteAddressView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.renderDeleteButton = this.renderDeleteButton.bind(this);
        this.renderToast = this.renderToast.bind(this);
        this.renderModifyAddressView = this.renderModifyAddressView.bind(this);
        this.onModifyAddress = this.onModifyAddress.bind(this);
    }

    componentWillMount() {
        const { email, firstName, lastName, uid, homeAirport } = this.props.currentUser;
        const { loading, addresses } = this.props;
        this.setState({
            email: email,
            firstName: firstName,
            lastName: lastName,
            loading: loading,
            addresses: addresses,
            homeAirport: homeAirport
        });

        this.props.loadUserAddress(uid);
    }

    componentWillReceiveProps(nextProps) {
        const { loading, addresses, deleted, error } = nextProps;
        this.setState({
            loading: loading,
            addresses: addresses
        });

        if (deleted) {
            this.setState({ modalType: '' });
        }

        if (error !== '') {
            this.renderToast(error);
        }
    }

    renderToast(error) {
        toast(error, { className: 'Account-toast' });
    }

    renderAddressInformation() {
        const { loading, addresses } = this.state;

        if (loading) {
            return (
                <div className='Account-indicator-container'>
                    <Spinner
                        className='Account-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                    <div style={{ fontSize: 18, color: 'black', marginLeft: 10 }}>
                        Loading ...
                    </div>
                </div>
            );
        }

        return addresses.map((address, index) => {
            return (
                <Address
                    key={index}
                    address={address}
                    deleteAddress={() => this.deleteAddress(index)}
                    onModifyAddress={() => this.onModifyAddress(index)}
                />
            );
        });
    }

    onModifyAddress(index) {
        this.setState({
            modalType: 'modifyAddress',
            modifyIndex: index
        });
    }

    deleteAddress(index) {
        this.setState({
            modalType: 'deleteAddress',
            targetAddressIndex: index
        });
    }

    renderAddAddressButton() {
        const { addresses, loading } = this.state;

        if (addresses.length >= 3) {
            return (
                <div style={{ marginTop: 20, marginLeft: 15 }}>
                    <div style={{ fontSize: 14 }}>
                        To add another address
                    </div>
                    <div style={{ fontSize: 14, marginBottom: 10 }}>
                        please delete an existing one first
                    </div>
                </div>
            );
        } else if (loading) {
            return (<div />);
        }

        return (
            <Icon.MdAdd
                size={30}
                color='#4099FF'
                className='Account-add-address-button'
                onClick={() => this.setState({ modalType: 'addAddress' })}
            />
        );
    }

    renderModal() {
        switch (this.state.modalType) {
            case 'addAddress':
                return this.renderAddAddressView();
            case 'deleteAddress':
                return this.renderDeleteAddressView();
            case 'modifyAddress':
                return this.renderModifyAddressView();
            default:
                return (<div />);
        }
    }

    renderModifyAddressView() {
        const { modifyIndex, addresses } = this.state;

        return (
            <ModifyAddress
                onCloseModal={() => this.setState({ modalType: '' })}
                uid={this.props.currentUser.uid}
                address={JSON.parse(addresses[modifyIndex])}
                index={modifyIndex}
            />
        );
    }

    renderDeleteAddressView() {
        return (
            <div>
                <div className='Account-label' style={{ marginTop: 20 }}>
                    Are you sure you want to delete this address?
                </div>
                {this.renderDeleteButton()}
            </div>
        );
    }

    renderDeleteButton() {
        if (this.state.loading) {
            return (
                <div className='Account-indicator-container'>
                    <Spinner
                        className='Account-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <div className='Account-button-container'>
                <button
                    className='Account-button'
                    onClick={() => this.setState({ modalType: '' })}
                >
                    Cancel
            </button>
                <button
                    className='Account-button'
                    style={{ backgroundColor: '#F44336' }}
                    onClick={this.onDelete}
                >
                    Delete
                </button>
            </div>
        );
    }

    onDelete() {
        const { targetAddressIndex, addresses } = this.state;
        this.props.deleteUserAddress(addresses, JSON.parse(addresses[targetAddressIndex]).address_id, targetAddressIndex);
    }

    renderAddAddressView() {
        return (
            <AddAddress
                onCloseModal={() => this.setState({ modalType: '' })}
                uid={this.props.currentUser.uid}
            />
        );
    }

    render() {
        const { email, firstName, lastName, modalType, homeAirport } = this.state;

        return (
            <div className='Account-container'>
                <div className='Account-header'>
                    My Account Information
                </div>
                <div style={{ marginTop: 5, fontSize: 14, marginLeft: 10 }}>
                    (Info cannot be changed at this moment)
                </div>
                <div className='Account-label'>
                    Email
                </div>
                <div className='Account-info'>
                    {email}
                </div>
                <div className='Account-label'>
                    First Name
                </div>
                <div className='Account-info'>
                    {firstName}
                </div>
                <div className='Account-label'>
                    Last Name
                </div>
                <div className='Account-info'>
                    {lastName}
                </div>
                <div className='Account-label'>
                    Home Airport
                </div>
                <div className='Account-info'>
                    {homeAirport}
                </div>
                <div className='Account-header'>
                    Address Book
                </div>
                <div style={{ marginTop: 5, fontSize: 14, marginLeft: 10 }}>
                    (You can add up to 3 addresses)
                </div>
                {this.renderAddressInformation()}
                {this.renderAddAddressButton()}
                <ToastContainer
                    position='top-right'
                    autoClose={5000}
                    newestOnTop={true}
                    closeOnClick={true}
                />
                <Modal
                    visible={modalType !== ''}
                    onClose={() => this.setState({ modalType: '' })}
                    closeOnEsc={true}
                    animation='zoom'
                    width={400}
                    height={getHeight(modalType)}
                >
                    {this.renderModal()}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { loading, addresses, deleted, error } = state.userAddress;
    return { loading, addresses, deleted, error };
};

export default connect(mapStateToProps, { loadUserAddress, deleteUserAddress })(Account);