import React from "react";
import { MapControl, withLeaflet } from "react-leaflet";
import { Search } from "semantic-ui-react";
import axios from "axios";

// This is a custom Leaflet control that only renders
// an empty div with similar height and width used by the Geocoder.
L.Control.GeocoderPlaceholder = L.Control.extend({
  onAdd: function(map) {
    var div = L.DomUtil.create("div");
    div.style.width = "200px";
    div.style.height = "32px";
    return div;
  }
});

class NewGeocoderControl extends MapControl {
  createLeafletElement(props) {
    return new L.Control.GeocoderPlaceholder(props);
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement.addTo(map);
  }

  componentWillMount() {
    this.resetComponent();
  }

  resetComponent = () =>
    this.setState({ isLoading: false, results: [], prevValue: "", value: "" });

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ value });

    // Wait for debounce
    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      if (value !== "" && this.state.value === value) {
        this.setState({
          isLoading: true
        });

        this.geocode().then(features => {
          const results = features.map(feat => {
            return { title: feat.place_name };
          });

          this.setState({
            isLoading: false,
            results: results
          });
        });
      }
    }, 300);
  };

  async geocode() {
    const { accessToken } = this.props;
    const searchText = encodeURIComponent(this.state.value);
    const endpointUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json`;
    const res = await axios.get(endpointUrl, {
      params: {
        access_token: accessToken,
        types: "district,locality,place,neighborhood,address",
        country: "AR"
      }
    });
    return res.data.features;
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <div>
        <div className="control">
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
          />
        </div>
        <style jsx>{`
          .control {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
          }
        `}</style>
      </div>
    );
  }
}

export default withLeaflet(NewGeocoderControl);
