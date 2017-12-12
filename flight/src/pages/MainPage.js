import React, { Component } from 'react';
import Modal from 'rodal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import LoginScreen from '../components/Login';
import RegisterScreen from '../components/Register';
import SearchPanel from '../components/SearchPanel';

import '../css/MainPage.css';
import 'rodal/lib/rodal.css';

import logo from '../logo.svg';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            modalType: ''
        };

        this.renderMenu = this.renderMenu.bind(this);
        this.renderLoginMenu = this.renderLoginMenu.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.renderLoginModal = this.renderLoginModal.bind(this);
        this.renderRegisterModal = this.renderRegisterModal.bind(this);
    }

    componentWillMount() {
        this.setState({ currentUser: this.props.currentUser });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentUser: nextProps.currentUser });
    }

    renderMenu() {
        const { currentUser } = this.state;

        if (!currentUser) {
            return this.renderLoginMenu();
        }

        return (
            <div className='MainPage-account-container'>
                <div style={{ fontSize: 18, color: 'white' }}>Welcome,</div>
                <Link to='/account' className='MainPage-account-button'>
                    {currentUser.firstName}
                </Link>
            </div>
        );
    }

    renderLoginMenu() {
        return (
            <div className='MainPage-login'>
                <button
                    className='MainPage-login-button'
                    onClick={() => this.setState({ modalType: 'login' })}
                >
                    Sign In
                </button>
                <button
                    className='MainPage-register-button'
                    onClick={() => this.setState({ modalType: 'register' })}
                >
                    Sign Up
                </button>
            </div>
        );
    }

    renderModal() {
        switch (this.state.modalType) {
            case 'login':
                return this.renderLoginModal();
            case 'register':
                return this.renderRegisterModal();
            default:
                return (<div />);
        }
    }

    renderLoginModal() {
        return (
            <LoginScreen
                onRegister={() => this.setState({ modalType: 'register' })}
                onCloseModal={() => this.setState({ modalType: '' })}
            />
        );
    }

    renderRegisterModal() {
        return (
            <RegisterScreen
                onLogin={() => this.setState({ modalType: 'login' })}
                onCloseModal={() => this.setState({ modalType: '' })}
            />
        );
    }

    render() {
        const { modalType } = this.state;

        return (
            <div className='MainPage-container'>
                <header className='MainPage-header'>
                    <img className='MainPage-logo' src={logo} alt='logo' />
                    <h1 className='MainPage-title'>We are excited to help you manage your flights</h1>
                    {this.renderMenu()}
                </header>
                <div className='MainPage-main'>
                    <SearchPanel />
                </div>
                <Modal
                    visible={modalType !== ''}
                    onClose={() => this.setState({ modalType: '' })}
                    closeOnEsc={true}
                    animation='zoom'
                    width={600}
                    height={modalType === 'register' ? 450 : 250}
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

export default connect(mapStateToProps, null)(MainPage);