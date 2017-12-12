import React, { PureComponent } from 'react';
import Autocomplete from 'react-autosuggest';

import '../css/SearchInput.css';

import { findAirports } from '../actions';

const getAirport = (suggestion) => {
    const { code } = suggestion;
    return code;
};

class SearchInput extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            airports: []
        };

        this.onSearchAirports = this.onSearchAirports.bind(this);
        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.renderSuggestion = this.renderSuggestion.bind(this);
    }

    onSearchAirports({ value }) {
        this.setState({ airports: findAirports(value) });
    }

    onChangeQuery(event, { newValue }) {
        this.setState({ query: newValue });
    }

    renderSuggestion(suggestion) {
        return (
            <div>
                {suggestion.code}: {suggestion.name}
            </div>
        );
    }

    render() {
        const { query, airports } = this.state;

        return (
            <Autocomplete
                suggestions={airports.slice(0, 5)}
                onSuggestionsFetchRequested={this.onSearchAirports}
                onSuggestionsClearRequested={() => this.setState({ airports: [] })}
                onSuggestionSelected={this.props.onChooseAirport}
                getSuggestionValue={getAirport}
                renderSuggestion={this.renderSuggestion}
                inputProps={{
                    placeholder: 'Airport code',
                    value: query,
                    onChange: this.onChangeQuery
                }}
            />
        );
    }
}

export default SearchInput;