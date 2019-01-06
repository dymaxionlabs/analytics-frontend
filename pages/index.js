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
    step: "initial"
  };

  featureGroupRef = React.createRef();

  constructor(props) {
    super(props);

    this._onToggleLayer = this._onToggleLayer.bind(this);
    this._onGeocoderResult = this._onGeocoderResult.bind(this);
    this._onDrawCreate = this._onDrawCreate.bind(this);
  }

  _onGeocoderResult() {
    if (!this._hasAnyPolygons() && !this._hasAnyLayerSelected()) {
      this.setState({ step: "search_done" });
    }
  }

  _onDrawCreate() {
    if (this._hasAnyLayerSelected()) {
      this.setState({ step: "layer_selected" });
    } else {
      this.setState({ step: "polygon_drawn" });
    }
  }

  _hasAnyPolygons() {
    const featureGroup = this.featureGroupRef.current.leafletElement;
    const numberOfPolygons = featureGroup.getLayers().length;
    return numberOfPolygons > 0;
  }

  _hasAnyLayerSelected() {
    return this.state.selectedLayers.length > 0;
  }

  _onToggleLayer(layer) {
    const selectedLayers = this._addOrRemove(this.state.selectedLayers, layer);
    let step;
    if (selectedLayers.length > 0) {
      if (this._hasAnyPolygons()) {
        step = "layer_selected";
      } else {
        step = "search_done";
      }
    } else {
      if (this._hasAnyPolygons()) {
        step = "polygon_drawn";
      } else {
        step = "search_done";
      }
    }
    this.setState({ selectedLayers, step });
  }

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  render() {
    const isLayerSelected = this.state.step === "layer_selected";

    return (
      <Map
        center={this.state.center}
        zoom={this.state.zoom}
        featureGroupRef={this.featureGroupRef}
        onGeocoderResult={this._onGeocoderResult}
        onDrawCreate={this._onDrawCreate}
      >
        <Guide step={this.state.step} />
        <LayerSelector
          onToggleLayer={this._onToggleLayer}
          selectedLayers={this.state.selectedLayers}
        />
        {isLayerSelected && (
          <ControlPanel selectedLayers={this.state.selectedLayers} />
        )}
      </Map>
    );
  }
}

export default Index;
