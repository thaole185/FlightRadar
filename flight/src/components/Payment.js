import React, { PureComponent } from 'react';
import moment from 'moment';
import * as Icon from 'react-icons/lib/md';

import '../css/Payment.css';

const numberToDisplay = (cardNumber) => {
    let result = '';

    var i = 0;
    while (i * 4 < cardNumber.length) {
        result += (cardNumber.slice(i * 4, i * 4 + 4) + ' ');
        ++i;
    }

    return result.slice(0, result.length - 1);
};

class Payment extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            cardHolder: '',
            expirationDate: moment(),
            cardNumber: '',
            backgroundImage: require(`../assets/pictures/card_background_${Math.floor(Math.random() * 4 + 1)}.jpg`)
        };
    }

    componentWillMount() {
        const { cardHolder, expirationDate, cardNumber } = this.props.payment;
        this.setState({
            cardHolder: cardHolder,
            expirationDate: expirationDate,
            cardNumber: cardNumber
        });
    }

    render() {
        const { cardHolder, cardNumber, expirationDate, backgroundImage } = this.state;
        const { deletePayment, onModifyPayment } = this.props;

        return (
            <div
                className='Payment-container'
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <Icon.MdClose
                    size={16}
                    color='white'
                    className='Payment-delete-button'
                    onClick={deletePayment}
                />
                <div className='Payment-card-number'>
                    {numberToDisplay(cardNumber)}
                </div>
                <div className='Payment-other-info-container'>
                    <div className='Payment-info-container'>
                        <div className='Payment-label'>
                            Card Holder
                            </div>
                        <div className='Payment-info'>
                            {cardHolder.slice(0, 4)}***
                            </div>
                    </div>
                    <div className='Payment-info-container'>
                        <div className='Payment-label'>
                            Valid thru
                            </div>
                        <div className='Payment-info'>
                            {expirationDate}
                        </div>
                    </div>
                </div>
                <div className='Payment-edit-button-container'>
                    <button
                        className='Payment-edit-button'
                        onClick={onModifyPayment}
                    >
                        Edit / View
                    </button>
                </div>
            </div>
        );
    }
}

export default Payment;