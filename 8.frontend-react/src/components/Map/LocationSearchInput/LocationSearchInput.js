import React from 'react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import './LocationSearchInput.scss'


class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: props.address };
    this.onLocationChange = props.onLocationChange.bind(this);
  }

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.onLocationChange({latLng, address});
      }
      )
      .catch(error => console.error('Error', error));
  };



  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="input_field" >
            <span>
              <i aria-hidden="true" className="fa fa-map-marker"></i>
            </span>
            <input
              {...getInputProps({
                placeholder: 'Class Location',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;