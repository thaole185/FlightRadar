import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/lib/md';

import Account from '../components/Account';
import PaymentMethods from '../components/PaymentMethods';
import Bookings from '../components/Bookings';

import { accountLogout } from '../actions';

import '../css/AccountPage.css';

import logo from '../logo.svg';

class AccountPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            reset: false,
            page: 'paymentMethods'
        };

        this.onLogout = this.onLogout.bind(this);
        this.renderMainPage = this.renderMainPage.bind(this);
    }

    componentWillMount() {
        this.setState({ currentUser: this.props.currentUser });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ currentUser: nextProps.currentUser });
    }

    onLogout() {
        this.props.accountLogout();
        this.setState({ reset: true });
    }

    renderMainPage() {
        const { page, currentUser } = this.state;

        switch (page) {
            case 'accountInfo':
                return (<Account currentUser={currentUser} />);
            case 'paymentMethods':
                return (<PaymentMethods currentUser={currentUser} />);
            case 'bookings':
                return (<Bookings currentUser={currentUser} />);
            default:
                return (<div />);
        }
    }

    render() {
        const { currentUser, reset } = this.state;

        if (currentUser) {
            return (
                <div className='AccountPage'>
                    <header className='AccountPage-header'>
                        <div className='AccountPage-header-label'>
                            <Link to='/'>
                                <img className='AccountPage-logo' src={logo} alt='logo' />
                            </Link>
                            <div>Manage your account</div>
                        </div>
                        <div className='AccountPage-logout-container'>
                            <Icon.MdPowerSettingsNew
                                size={26}
                                color='#F44336'
                                style={{ marginRight: 5 }}
                            />
                            <button
                                className='AccountPage-logout-button'
                                onClick={this.onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </header>
                    <div className='AccountPage-main'>
                        <div className='AccountPage-main-menu'>
                            <ul>
                                <button
                                    className='AccountPage-main-menu-button'
                                    onClick={() => this.setState({ page: 'accountInfo' })}
                                >
                                    Account Info
                                </button>
                            </ul>
                            <ul>
                                <button
                                    className='AccountPage-main-menu-button'
                                    onClick={() => this.setState({ page: 'paymentMethods' })}
                                >
                                    Payment Methods
                                </button>
                            </ul>
                            <ul>
                                <button
                                    className='AccountPage-main-menu-button'
                                    onClick={() => this.setState({ page: 'bookings' })}
                                >
                                    Bookings
                                </button>
                            </ul>
                        </div>
                        {this.renderMainPage()}
                    </div>
                    <div className='AccountPage-footer'>
                        <div className='AccountPage-footer-info-container'>
                            <div className='AccountPage-footer-info-group-container'>
                                <div className='AccountPage-footer-info-header'>Contact</div>
                                <div className='AccountPage-footer-info'>
                                    tle18@hawk.iit.edu
                                </div>
                                <div className='AccountPage-footer-info'>
                                    pwright2@hawk.iit.edu
                                </div>
                                <div className='AccountPage-footer-info'>
                                    ttran22@hawk.iit.edu
                                </div>
                            </div>
                            <div className='AccountPage-footer-info-group-container'>
                                <div className='AccountPage-footer-info-header'>Company</div>
                                <a
                                    className='AccountPage-footer-info'
                                    href='https://web.iit.edu'
                                >
                                    Illinois Institude of Technology
                                </a>
                            </div>
                            <div className='AccountPage-footer-info-group-container'>
                                <div className='AccountPage-footer-info-header'>Copyright</div>
                                <div className='AccountPage-footer-info'>©2017 CS425 Team 2 </div>
                            </div>
                        </div>
                        <div className='AccountPage-footer-right-container'>
                            All rights reserved for CS425 Team 2
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className='AccountPage'>
                <header className='AccountPage-header'>
                    <div className='AccountPage-header-label'>
                        <Link to='/'>
                            <img className='AccountPage-logo' src={logo} alt='logo' />
                        </Link>
                        <div>Manage your account</div>
                    </div>
                </header>
                <div className='AccountPage-expire'>
                    This page has expired, please re-login to manage your account
                </div>
                {reset && <Redirect to='/' />}
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { currentUser } = state.account;
    return { currentUser };
};

export default connect(mapStateToProps, { accountLogout })(AccountPage);