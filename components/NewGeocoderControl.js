import React from "react";
import { MapControl, withLeaflet } from "react-leaflet";
import { Input, Search } from "semantic-ui-react";
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

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
  };

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

  handleMouseDown = (e, data) => {
    // For some reason, when you click on a result on the results container, the
    // onResultSelect event is not being triggered.  This handler is a workaround
    // for those cases.
    if (e.target.nodeName === "DIV") {
      let node = e.target;
      if (node.className !== "title") {
        node = node.children[0].children[0];
      }
      const title = node.textContent;
      this.setState({ value: title });
    }
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
      <div className="geocoder">
        <Search
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={this.handleSearchChange}
          onMouseDown={this.handleMouseDown}
          results={results}
          value={value}
          input={
            <Input
              icon="search"
              iconPosition="left"
              placeholder="Buscar localidad..."
            />
          }
          noResultsMessage="No hay resultados."
          noResultsDescription="Pruebe escribir el nombre de la ciudad o localidad."
        />
        <style jsx global>{`
          .geocoder {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
          }
          .geocoder .ui.search .prompt {
            border-radius: 4px;
            box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.35);
          }
        `}</style>
      </div>
    );
  }
}

export default withLeaflet(NewGeocoderControl);
