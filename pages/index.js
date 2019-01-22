import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import Head from "next/head";
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

import ConfirmationPortal from "../components/ConfirmationPortal";
import LayerSelector from "../components/LayerSelector";
import Guide from "../components/Guide";

class Index extends React.Component {
  state = {
    center: [-34.609032, -58.373219],
    zoom: [11],
    selectedLayers: [],
    polygonsArea: 0,
    step: "initial"
  };

  featureGroupRef = React.createRef();

  constructor(props) {
    super(props);

    this._onToggleLayer = this._onToggleLayer.bind(this);
    this._onGeocoderResult = this._onGeocoderResult.bind(this);
    this._onDrawCreated = this._onDrawCreated.bind(this);
    this._onDrawEdited = this._onDrawEdited.bind(this);
    this._onDrawDeleted = this._onDrawDeleted.bind(this);
  }

  _onGeocoderResult() {
    if (!this._hasAnyPolygons() && !this._hasAnyLayerSelected()) {
      this.setState({ step: "search_done" });
    }
  }

  _onDrawCreated() {
    console.log("drawed");
    this._updatePolygonsArea();
    if (this._hasAnyLayerSelected()) {
      this.setState({ step: "layer_selected" });
    } else {
      this.setState({ step: "polygon_drawn" });
    }
  }

  _onDrawEdited(event) {
    console.log("edited");
    this._updatePolygonsArea();
  }

  _onDrawDeleted(event) {
    console.log("deleted");
    if (!this._updatePolygonsArea() && !this._hasAnyPolygons() == true) {
      this.setState({ step: "search_done" });
    }
  }

  _hasAnyPolygons() {
    const featureGroup = this._getFeatureGroup();
    const numberOfPolygons = featureGroup.getLayers().length;
    return numberOfPolygons > 0;
  }

  _updatePolygonsArea() {
    const featureGroup = this._getFeatureGroup();
    const layers = featureGroup.getLayers();
    const areas = layers.map(layer =>
      L.GeometryUtil.geodesicArea(layer.getLatLngs()[0])
    );
    const area = areas.reduce((acc, v) => acc + v, 0);
    const polygonsArea = area / 1e6;
    this.setState({ polygonsArea });
  }

  _getFeatureGroup() {
    return this.featureGroupRef.current.leafletElement;
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
    const { center, zoom, step, selectedLayers } = this.state;
    const isLayerSelected = step === "layer_selected";

    return (
      <div className="index">
        <Head>
          <title>Analytics | Dymaxion Labs</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Map
          center={center}
          zoom={zoom}
          featureGroupRef={this.featureGroupRef}
          onGeocoderResult={this._onGeocoderResult}
          onDrawCreated={this._onDrawCreated}
          onDrawEdited={this._onDrawEdited}
          onDrawDeleted={this._onDrawDeleted}
        >
          <Guide step={step} />
          <LayerSelector
            onToggleLayer={this._onToggleLayer}
            selectedLayers={selectedLayers}
          />
          {isLayerSelected && (
            <ConfirmationPortal
              area={this.state.polygonsArea}
              selectedLayers={selectedLayers}
            />
          )}
        </Map>
      </div>
    );
  }
}

export default Index;
