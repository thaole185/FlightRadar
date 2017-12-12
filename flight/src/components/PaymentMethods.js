import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import * as Icon from 'react-icons/lib/md';
import Modal from 'rodal';

import Payment from './Payment';
import AddPayment from './AddPayment';
import ModifyPayment from './ModifyPayment';

import '../css/PaymentMethods.css';

import { loadCreditCard, deleteCreditCard } from '../actions';

const getHeight = (modalType) => {
    switch (modalType) {
        case 'addCreditCard':
            return 360;
        case 'deleteCreditCard':
            return 130;
        default:
            return 430;
    }
};

class PaymentMethods extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            payments: [],
            modalType: '',
            targetCardIndex: 0,
            modifyIndex: 0
        };

        this.renderPaymentMethods = this.renderPaymentMethods.bind(this);
        this.renderPayments = this.renderPayments.bind(this);
        this.deletePayment = this.deletePayment.bind(this);
        this.renderAddPaymentButton = this.renderAddPaymentButton.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.renderAddCreditCardView = this.renderAddCreditCardView.bind(this);
        this.renderDeleteCardView = this.renderDeleteCardView.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onModifyPayment = this.onModifyPayment.bind(this);
        this.renderModifyPaymentView = this.renderModifyPaymentView.bind(this);
    }

    componentWillMount() {
        const { loading, payments, currentUser } = this.props;
        this.setState({
            loading: loading,
            payments: payments
        });

        this.props.loadCreditCard(currentUser.uid);
    }

    componentWillReceiveProps(nextProps) {
        const { loading, payments, deleted } = nextProps;
        this.setState({
            loading: loading,
            payments: payments
        });

        if (deleted) {
            this.setState({ modalType: '' });
        }
    }

    renderPaymentMethods() {
        if (this.state.loading) {
            return (
                <div className='PaymentMethods-indicator-container'>
                    <Spinner
                        className='PaymentMethods-activity-indicator'
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

        return this.renderPayments();
    }

    renderPayments() {
        const { firstName, lastName } = this.props.currentUser;

        return this.state.payments.map((payment, index) => {
            const paymentJson = JSON.parse(payment);
            const { expirationDate, cardNumber } = paymentJson;
            
            return (
                <Payment
                    key={index}
                    payment={{
                        cardHolder: `${firstName} ${lastName}`,
                        expirationDate: expirationDate,
                        cardNumber: cardNumber
                    }}
                    deletePayment={() => this.deletePayment(index)}
                    onModifyPayment={() => this.onModifyPayment(index)}
                />
            );
        });
    }

    onModifyPayment(index) {
        this.setState({
            modalType: 'modifyPayment',
            modifyIndex: index
        });
    }

    deletePayment(index) {
        this.setState({
            modalType: 'deleteCreditCard',
            targetCardIndex: index
        });
    }

    renderAddPaymentButton() {
        const { payments, loading } = this.state;

        if (payments.length >= 3) {
            return (
                <div style={{ marginTop: 20, marginLeft: 15 }}>
                    <div style={{ fontSize: 14 }}>
                        To add another payment method
                    </div>
                    <div style={{ fontSize: 14 }}>
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
                className='PaymentMethods-add-payment-method-button'
                onClick={() => this.setState({ modalType: 'addCreditCard' })}
            />
        );
    }

    renderModal() {
        switch (this.state.modalType) {
            case 'addCreditCard':
                return this.renderAddCreditCardView();
            case 'deleteCreditCard':
                return this.renderDeleteCardView();
            case 'modifyPayment':
                return this.renderModifyPaymentView();
            default:
                return (<div />);
        }
    }

    renderModifyPaymentView() {
        const { modifyIndex, payments } = this.state;

        return (
            <ModifyPayment
                onCloseModal={() => this.setState({ modalType: '' })}
                currentUser={this.props.currentUser}
                payment={JSON.parse(payments[modifyIndex])}
                index={modifyIndex}
            />
        );
    }

    renderDeleteCardView() {
        return (
            <div>
                <div className='PaymentMethods-label' style={{ marginTop: 20 }}>
                    Are you sure you want to delete this payment method?
                </div>
                {this.renderDeleteButton()}
            </div>
        );
    }

    renderDeleteButton() {
        if (this.state.loading) {
            return (
                <div className='PaymentMethods-indicator-container'>
                    <Spinner
                        className='PaymentMethods-activity-indicator'
                        fadeIn='none'
                        name='circle'
                        color='black'
                    />
                </div>
            );
        }

        return (
            <div className='PaymentMethods-button-container'>
                <button
                    className='PaymentMethods-button'
                    onClick={() => this.setState({ modalType: '' })}
                >
                    Cancel
                </button>
                <button
                    className='PaymentMethods-button'
                    style={{ backgroundColor: '#F44336' }}
                    onClick={this.onDelete}
                >
                    Delete
                </button>
            </div>
        );
    }

    onDelete() {
        const { targetCardIndex, payments } = this.state;
        this.props.deleteCreditCard(payments, JSON.parse(payments[targetCardIndex]).cid, targetCardIndex);
    }

    renderAddCreditCardView() {
        return (
            <AddPayment
                onCloseModal={() => this.setState({ modalType: '' })}
                currentUser={this.props.currentUser}
            />
        );
    }

    render() {
        const { modalType } = this.state;

        return (
            <div className='PaymentMethods-container'>
                <div className='PaymentMethods-header'>
                    My Payment Methods
                </div>
                <div style={{ marginTop: 5, fontSize: 14, marginLeft: 10 }}>
                    (You can add up to 3 payment methods)
                </div>
                {this.renderPaymentMethods()}
                {this.renderAddPaymentButton()}
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
    const { loading, payments, deleted } = state.creditCard;
    return { loading, payments, deleted };
};

export default connect(mapStateToProps, { loadCreditCard, deleteCreditCard })(PaymentMethods);