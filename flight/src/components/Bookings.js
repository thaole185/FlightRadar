import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { ToastContainer, toast } from 'react-toastify';

import Booking from './Booking';

import { loadBookings } from '../actions';

import '../css/Bookings.css';

class Bookings extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            loading: false
        };

        this.renderToast = this.renderToast.bind(this);
        this.renderBookings = this.renderBookings.bind(this);
    }

    componentWillMount() {
        const { currentUser, loading, bookings } = this.props;
        this.setState({
            loading: loading,
            bookings: bookings
        });

        if (!loading) {
            this.props.loadBookings(currentUser.uid);
        }
    }

    componentWillReceiveProps(nextProps) {
        const { loading, error, bookings } = nextProps;
        this.setState({
            loading: loading,
            bookings: bookings
        });

        if (error !== '') {
            this.renderToast(error);
        }
    }

    renderToast(error) {
        toast(error, { className: 'Register-toast' });
    }

    renderBookings() {
        const { loading, bookings } = this.state;

        if (loading) {
            return (
                <div className='Bookings-indicator-container'>
                    <Spinner
                        className='Bookings-activity-indicator'
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

        return bookings.map((booking, index) => {
            return (
                <Booking
                    key={index}
                    booking={booking}
                    index={index}
                />
            );
        });
    }

    render() {
        return (
            <div className='Bookings-container'>
                <div className='Bookings-header'>
                    Manage My Bookings
                </div>
                {this.renderBookings()}
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
    const { loading, error, bookings } = state.booking;
    return { loading, error, bookings };
};

export default connect(mapStateToProps, { loadBookings })(Bookings);