import React, { PureComponent } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import DropdownMenu from 'react-dropdown';

import AirportInput from './SearchInput';

import 'react-datepicker/dist/react-datepicker.css';
import '../css/SearchPanel.css';

const formatDate = (date) => {
    let str = `${date}`;
    if (str.length === 1) {
        str = `0${str}`;
    }

    return str;
};

class SearchPanel extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedTabIndex: 1,
            departureAirport: '',
            destinationAirport: '',
            departureDate: moment(),
            returningDate: null,
            ticketCount: 1,
            maxConnections: 'Any',
            maxDuration: '',
            maxPrice: ''
        };
        
        this.renderSearchBar = this.renderSearchBar.bind(this);
        this.renderPickDateBar = this.renderPickDateBar.bind(this);
        this.renderAdvancedOptionsBar = this.renderAdvancedOptionsBar.bind(this);
        this.renderReturningDatePicker = this.renderReturningDatePicker.bind(this);
        this.renderSubmitButton = this.renderSubmitButton.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.renderToast = this.renderToast.bind(this);
    }

    renderToast(error) {
        toast(error, { className: 'SearchPanel-toast' });
    }

    renderSearchBar() {
        return (
            <div className='SearchPanel-default-container'>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Flying from *
                    </div>
                    <AirportInput onChooseAirport={(event, { suggestionValue }) => this.setState({ departureAirport: suggestionValue }) } />
                </div>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Flying to *
                    </div>
                    <AirportInput onChooseAirport={(event, { suggestionValue }) => this.setState({ destinationAirport: suggestionValue })} />
                </div>
            </div>
        );
    }

    renderAdvancedOptionsBar() {
        const { ticketCount, maxConnections, maxDuration, maxPrice } = this.state;

        return (
            <div className='SearchPanel-default-container'>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Travelers *
                    </div>
                    <DropdownMenu
                        value={`${ticketCount}`}
                        options={[
                            { value: 1, label: '1' },
                            { value: 2, label: '2' },
                            { value: 3, label: '3' },
                            { value: 4, label: '4' },
                            { value: 5, label: '5' },
                            { value: 6, label: '6' }
                        ]}
                        onChange={({ value, label }) => this.setState({ ticketCount: value })}
                    />
                </div>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Max Price (in USD)
                    </div>
                    <input
                        className='SearchPanel-input'
                        type='number'
                        value={maxPrice}
                        onChange={(event) => this.setState({ maxPrice: event.target.value })}
                    />
                </div>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Max Connections
                    </div>
                    <DropdownMenu
                        value={`${maxConnections}`}
                        options={[
                            { value: 0, label: '0' },
                            { value: 1, label: '1' },
                            { value: 2, label: '2' },
                            { value: 'Any', label: 'Any' }
                        ]}
                        onChange={({ value, label }) => this.setState({ maxConnections: value })}
                    />
                </div>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Max Duration (in hours)
                    </div>
                    <input
                        className='SearchPanel-input'
                        type='number'
                        value={maxDuration}
                        onChange={(event) => this.setState({ maxDuration: event.target.value })}
                    />
                </div>
            </div>
        );
    }

    renderPickDateBar() {
        const { departureDate, returningDate } = this.state;

        return (
            <div className='SearchPanel-default-container'>
                <div className='SearchPanel-input-container'>
                    <div className='SearchPanel-label'>
                        Departing *
                    </div>
                    <DatePicker
                        className='SearchPanel-date-input'
                        minDate={moment()}
                        maxDate={returningDate}
                        selected={departureDate}
                        onChange={(date) => this.setState({ departureDate: date })}
                    />
                </div>
                {this.renderReturningDatePicker()}
            </div>
        );
    }

    renderReturningDatePicker() {
        const { selectedTabIndex, departureDate, returningDate } = this.state;

        if (selectedTabIndex === 0) {
            return (<div />);
        }

        return (
            <div className='SearchPanel-input-container'>
                <div className='SearchPanel-label'>
                    Returning *
                </div>
                <DatePicker
                    className='SearchPanel-date-input'
                    minDate={departureDate}
                    selected={returningDate}
                    onChange={(date) => this.setState({ returningDate: date })}
                />
            </div>
        );
    }

    renderSubmitButton() {
        return (
            <div className='SearchPanel-submit-button-container'>
                <button
                    className='SearchPanel-submit-button'
                    onClick={this.onSearch}
                >
                    Search
                </button>
            </div>
        );
    }

    onSearch() {
        const { departureAirport, destinationAirport, departureDate,
            returningDate, ticketCount, maxPrice, maxConnections,
            maxDuration, selectedTabIndex } = this.state;

        const priceFormat = /^([0]|[1-9][0-9]*)((.[0-9]+)?)$/;
        const hourFormat = /^([0]|[1-9][0-9]*)((.[0-9]+)?)$/;

        if (departureAirport === '' || destinationAirport === '') {
            this.renderToast('Please select your departure and destination airports');
        } else if (!departureDate || departureDate === '') {
            this.renderToast('Please select your departure date');
        } else if (selectedTabIndex === 1 && (!returningDate || returningDate === '')) {
            this.renderToast('Please select your returning date');
        } else if (maxPrice !== '' && !priceFormat.test(maxPrice)) {
            this.renderToast('Please enter a valid maximum price');
        } else if (maxDuration !== '' && !hourFormat.test(maxDuration)) {
            this.renderToast('Please enter a valid flight duration');
        } else {
            const leaveDate = `${formatDate(departureDate.month() + 1)}-${formatDate(departureDate.date())}-${departureDate.year()}`;

            const returnDate = selectedTabIndex === 1 ? `${formatDate(returningDate.month() + 1)}-${formatDate(returningDate.date())}-${returningDate.year()}` : 'none';

            const priceLimit = maxPrice === '' ? 0.0 : parseFloat(maxPrice);
            const connectionLimit = maxConnections === 'Any' ? 2 : maxConnections;
            const durationLimit = maxDuration === '' ? 0.0 : parseFloat(maxDuration);

            /*
            this.props.searchFlights(departureAirport,
                destinationAirport, leaveDate, returnDate,
                ticketCount, priceLimit, connectionLimit, durationLimit);
            */
            const searchUrl = `http://localhost:3000/view_flight?depart_airport=${departureAirport}&dest_airport=${destinationAirport}&depart_date=${leaveDate}&return_date=${returnDate}&tickets=${ticketCount}&max_price=${priceLimit}&max_stops=${connectionLimit}&max_duration=${durationLimit}`;
            window.open(searchUrl, '_blank');
        }
    }

    render() {
        const { selectedTabIndex } = this.state;

        return (
            <div className='SearchPanel-container'>
                <Tabs
                    defaultIndex={selectedTabIndex}
                    onSelect={(index) => this.setState({ selectedTabIndex: index })}
                >
                    <TabList className='SearchPanel-tab-list'>
                        <Tab
                            className='SearchPanel-tab'
                            tabIndex='0'
                            style={{ backgroundColor: selectedTabIndex === 0 ? '#4099FF' : 'rgba(64, 153, 255, 0.3)' }}
                        >
                            One Way
                        </Tab>
                        <Tab
                            className='SearchPanel-tab'
                            tabIndex='1'
                            style={{ backgroundColor: selectedTabIndex === 1 ? '#4099FF' : 'rgba(64, 153, 255, 0.3)' }}
                        >
                            Round Trip
                        </Tab>
                    </TabList>
                    <TabPanel>
                        {this.renderSearchBar()}
                        {this.renderPickDateBar()}
                        {this.renderAdvancedOptionsBar()}
                    </TabPanel>
                    <TabPanel>
                        {this.renderSearchBar()}
                        {this.renderPickDateBar()}
                        {this.renderAdvancedOptionsBar()}
                    </TabPanel>
                </Tabs>
                {this.renderSubmitButton()}
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

export default SearchPanel;