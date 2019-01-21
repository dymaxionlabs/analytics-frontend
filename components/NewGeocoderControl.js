import _ from "lodash";
import React, { Component } from "react";
//import { withLeaflet } from "react-leaflet";
import { Search } from "semantic-ui-react";
import axios from "axios";

//{"url":"","index":"mapbox.places","staging":false,"onCountry":true,"onType":true,"onProximity":true,"onBBOX":true,"onLimit":true,"onLanguage":true,"countries":[{"name":"Argentina","code":"ar"}],"proximity":"","typeToggle":{"country":false,"region":false,"district":true,"postcode":false,"locality":true,"place":true,"neighborhood":true,"address":false,"poi":false},"types":["district","locality","place","neighborhood"],"bbox":"","limit":"","autocomplete":true,"languages":[{"code":"es","name":"Spanish"}],"languageStrict":false,"onDebug":false,"selectedLayer":"","debugClick":{},"query":"pilar"}

const source = [{ title: "a" }, { title: "b" }, { title: "c" }];

class NewGeocoderControl extends Component {
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
            {...this.props}
          />
        </div>
        <style jsx>{`
            .control {
                position: absolute;
                top: 20px
                left: 20px;
                z-index: 1000;
            }
      `}</style>
      </div>
    );
  }
}

export default NewGeocoderControl;
