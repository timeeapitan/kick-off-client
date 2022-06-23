import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Map, Marker } from "google-maps-react";

const TryMap = (props) => {
  const [address, setAddress] = useState("");
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState({});
  const [selectedPlace, setSelectedPlace] = useState({});
  const [mapCenter, setMapCenter] = useState({
    lat: 49.2827291,
    lng: -123.1297375,
  });

  const handleChange = (address) => {
    this.setAddress(address);
  };

  const handleSelect = (address) => {
    this.setAddress(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        console.log("Success", latLng);

        this.setMapCenter(latLng);
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <Wrapper>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
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
        google={this.props.google}
        initialCenter={{
          lat: mapCenter.lat,
          lng: mapCenter.lng,
        }}
        center={{
          lat: mapCenter.lat,
          lng: mapCenter.lng,
        }}>
        <Marker
          position={{
            lat: mapCenter.lat,
            lng: mapCenter.lng,
          }}
        />
      </Map>
    </Wrapper>
  );
};

export default TryMap;
