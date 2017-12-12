import React, { PureComponent } from 'react';
import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';

import AirportInput from './SearchInput';

import '../css/Register.css';

import { accountRegister } from '../actions';

class Register extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            conPassword: '',
            firstName: '',
            lastName: '',
            homeAirport: '',
            loading: false,
            authorized: false
        };

        this.renderRegisterButton = this.renderRegisterButton.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.renderToast = this.renderToast.bind(this);
    }

    componentWillMount() {
        this.setState({ loading: this.props.loading });
    }

    componentWillReceiveProps(nextProps) {
        const { authorized, loading, error } = nextProps;
        this.setState({ loading: loading });

        if (authorized) {
            this.props.onCloseModal();
        }

        if (error !== '') {
            this.renderToast(error);
        }
    }

    renderRegisterButton() {
        if (this.state.loading) {
            return (
                <div className='Register-indicator-container'>
                    <Spinner
                        className='Register-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <button
                className='Register-submit-button'
                onClick={this.onRegister}
            >
                Register
            </button>
        );
    }

    onRegister() {
        const { email, password, conPassword, firstName, lastName, homeAirport } = this.state;
        const firstNameNoSpace = firstName.replace(/ /g, '');
        const lastNameNoSpace = lastName.replace(/ /g, '');
        const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailFormat.test(email)) {
            this.renderToast('Please enter a valid email address');
        } else if (password === '') {
            this.renderToast('Please enter your password');
        } else if (password !== conPassword) {
            this.renderToast('Passwords don\'t match');
        } else if (firstNameNoSpace === '' || lastNameNoSpace === '') {
            this.renderToast('Invalid first name or last name');
        } else if (homeAirport === '') {
            this.renderToast('Please select your home airport');
        } else {
            this.props.accountRegister(email, password, firstName, lastName, homeAirport);
        }
    }

    renderToast(error) {
        toast(error, { className: 'Register-toast' });
    }

    render() {
        const { email, password, conPassword, firstName, lastName, loading } = this.state;

        return (
            <div className='Register-container'>
                <div className='Register-label'>Email *</div>
                <input
                    className='Register-input'
                    disabled={loading}
                    value={email}
                    onChange={(event) => this.setState({ email: event.target.value })}
                />
                <div className='Register-label'>Password *</div>
                <input
                    className='Register-input'
                    disabled={loading}
                    type='password'
                    value={password}
                    onChange={(event) => this.setState({ password: event.target.value })}
                />
                <div className='Register-label'>Confirm Password *</div>
                <input
                    className='Register-input'
                    disabled={loading}
                    value={conPassword}
                    type='password'
                    onChange={(event) => this.setState({ conPassword: event.target.value })}
                />
                <div className='Register-label'>First Name *</div>
                <div className='Register-input-container'>
                    <input
                        className='Register-input'
                        disabled={loading}
                        value={firstName}
                        maxLength={40}
                        onChange={(event) => this.setState({ firstName: event.target.value })}
                    />
                    <div className='Register-char-count'>{firstName.length} / 40</div>
                </div>
                <div className='Register-label'>Last Name *</div>
                <div className='Register-input-container'>
                    <input
                        className='Register-input'
                        disabled={loading}
                        value={lastName}
                        maxLength={40}
                        onChange={(event) => this.setState({ lastName: event.target.value })}
                    />
                    <div className='Register-char-count'>{lastName.length} / 40</div>
                </div>
                <div className='Register-label'>Home Airport *</div>
                <div className='Register-airport-input-container'>
                    <AirportInput onChooseAirport={(event, { suggestionValue }) => this.setState({ homeAirport: suggestionValue })} />
                </div>
                {this.renderRegisterButton()}
                <div className='Register-login-container'>
                    <div className='Register-login-label'>Already have an account?</div>
                    <button
                        className='Register-login-button'
                        onClick={this.props.onLogin}
                        disabled={loading}
                    >
                        Sign In
                    </button>
                </div>
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
    const { authorized, loading, error } = state.account;
    return { authorized, loading, error };
};

export default connect(mapStateToProps, { accountRegister })(Register);