import { Box, TextField } from "@mui/material";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";
import React, { Component } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // for google map places autocomplete
      address: "",

      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},

      mapCenter: {
        lat: props.lat,
        lng: props.lng,
      },
      options: {
        disableDefaultUI: true,
        zoomControl: true,
        draggableCursor: true,
        draggingCursor: true,
        keyboardShortcuts: false,
        panControl: false,
      },
    };
  }

  handleChange = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        // update center state
        this.setState({ mapCenter: latLng });
        sessionStorage.setItem("locationLng", this.state.mapCenter.lng);
        sessionStorage.setItem("locationLat", this.state.mapCenter.lat);
      })
      .catch((error) => console.error("Error", error));
  };

  render() {
    return (
      <Box>
        <PlacesAutocomplete
          value={this.state.address}
          onChange={this.handleChange}
          onSelect={this.handleSelect}>
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <div>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                style={{ marginBottom: "20px" }}
                {...getInputProps({
                  placeholder: "Search Places",
                  className: "location-search-input",
                })}
              />
              <div
                fullWidth
                className="autocomplete-dropdown-container"
                style={{ position: "absolute", zIndex: 10 }}>
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => {
                  const className = suggestion.active
                    ? "suggestion-item--active"
                    : "suggestion-item";
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}>
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <Map
          options={this.state.options}
          containerStyle={{ width: "85%", height: "65%" }}
          google={this.props.google}
          initialCenter={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng,
          }}
          center={{
            lat: this.state.mapCenter.lat,
            lng: this.state.mapCenter.lng,
          }}>
          <Marker
            position={{
              lat: this.state.mapCenter.lat,
              lng: this.state.mapCenter.lng,
            }}
          />
        </Map>
      </Box>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDLlvfIHgEFG0GzOLqkNpKbNleec-GVowc",
})(MapContainer);
