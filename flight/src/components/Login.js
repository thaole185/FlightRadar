import React, { PureComponent } from 'react';
import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';
import { connect } from 'react-redux';

import '../css/Login.css';

import { accountLogin } from '../actions';

class Login extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loading: false,
            authorized: false
        };

        this.renderLoginButton = this.renderLoginButton.bind(this);
        this.onLogin = this.onLogin.bind(this);
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

    renderLoginButton() {
        if (this.state.loading) {
            return (
                <div className='Login-indicator-container'>
                    <Spinner
                        className='Login-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <button
                className='Login-submit-button'
                onClick={this.onLogin}
            >
                Login
            </button>
        );
    }

    onLogin() {
        const { email, password } = this.state;
        const emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailFormat.test(email)) {
            this.renderToast('Please enter a valid email address');
        } else if (password === '') {
            this.renderToast('Please enter a valid password');
        } else {
            this.props.accountLogin(email, password);
        }
    }

    renderToast(error) {
        toast(error, { className: 'Login-toast' });
    }

    render() {
        const { email, password, loading } = this.state;

        return (
            <div className='Login-container'>
                <div className='Login-label'>Email *</div>
                <input
                    className='Login-input'
                    disabled={loading}
                    value={email}
                    onChange={(event) => this.setState({ email: event.target.value })}
                />
                <div className='Login-label'>Password *</div>
                <input
                    className='Login-input'
                    disabled={loading}
                    type='password'
                    value={password}
                    onChange={(event) => this.setState({ password: event.target.value })}
                />
                {this.renderLoginButton()}
                <div className='Login-register-container'>
                    <div className='Login-register-label'>Don't have an account?</div>
                    <button
                        className='Login-register-button'
                        disabled={loading}
                        onClick={this.props.onRegister}
                    >
                        Sign Up
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
    const { loading, error, authorized } = state.account;
    return { loading, error, authorized };
};

export default connect(mapStateToProps, { accountLogin })(Login);