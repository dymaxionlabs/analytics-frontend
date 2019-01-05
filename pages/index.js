import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import dynamic from "next/dynamic";
import { Dimmer, Loader } from "semantic-ui-react";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/TrialMap"), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size="big">Cargando...</Loader>
    </Dimmer>
  )
});

import ControlPanel from "../components/control-panel";
import LayerSelector from "../components/LayerSelector";
import Guide from "../components/guide";

class Index extends React.Component {
  state = {
    center: [-34.609032, -58.373219],
    zoom: [11],
    selectedLayers: [],
    isActive: false,
    step: "initial"
  };

  constructor(props) {
    super(props);

    this._onToggleLayer = this._onToggleLayer.bind(this);
    this._onGeocoderResult = this._onGeocoderResult.bind(this);
    this._onDrawCreate = this._onDrawCreate.bind(this);
    this._onFeatureGroupClick = this._onFeatureGroupClick.bind(this);
  }

  _onGeocoderResult() {
    this.setState({ isActive: true, step: "search_done" });
  }

  _onDrawCreate() {
    this.setState({ step: "polygon_drawn" });
  }

  _onFeatureGroupClick(event) {
    console.log("feature group click");
    console.log(event);
  }

  _onToggleLayer(layer) {
    const newSelectedLayers = this._addOrRemove(
      this.state.selectedLayers,
      layer
    );
    console.log(`newSelectedLayers: ${JSON.stringify(newSelectedLayers)}`);
    this.setState({ selectedLayers: newSelectedLayers });
  }

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  render() {
    let controlPanel = null;
    if (this.state.isActive) {
      controlPanel = (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 100,
            background: "#fff",
            margin: "24px",
            padding: "12px 24px"
          }}
        >
          <ControlPanel selectedLayers={this.state.selectedLayers} />
        </div>
      );
    }

    return (
      <Map
        center={this.state.center}
        zoom={this.state.zoom}
        onGeocoderResult={this._onGeocoderResult}
        onDrawCreate={this._onDrawCreate}
        onFeatureGroupClick={this._onFeatureGroupClick}
      >
        <Guide step={this.state.step} />
        <LayerSelector
          onToggleLayer={this._onToggleLayer}
          selectedLayers={this.state.selectedLayers}
        />
        {controlPanel}
      </Map>
    );
  }
}

export default Index;
