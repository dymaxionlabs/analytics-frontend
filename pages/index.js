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

const DEFAULT_VIEWPORT = {
  center: [-34.43888767776975, -58.93332694025683],
  zoom: 16
};

class Index extends React.Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
    selectedLayers: [],
    polygonsArea: 0,
    step: "initial"
  };

  featureGroupRef = React.createRef();

  constructor(props) {
    super(props);

    this._onToggleLayer = this._onToggleLayer.bind(this);
    this._onDrawCreated = this._onDrawCreated.bind(this);
    this._onDrawEdited = this._onDrawEdited.bind(this);
    this._onDrawDeleted = this._onDrawDeleted.bind(this);
  }

  componentDidUpdate() {}

  _onGeocoderResult = result => {
    if (!this._hasAnyPolygons() && !this._hasAnyLayerSelected()) {
      this.setState({ step: "search_done" });
    }
  };

  _onDrawCreated() {
    this._updatePolygonsArea();
    if (this._hasAnyLayerSelected()) {
      this.setState({ step: "layer_selected" });
    } else {
      this.setState({ step: "polygon_drawn" });
    }
  }

  _onDrawEdited(event) {
    this._updatePolygonsArea();
  }

  _onDrawDeleted(event) {
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

  _onMapViewportChanged = viewport => {
    this.setState({ viewport });
  };

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  render() {
    const { viewport, step, selectedLayers } = this.state;
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
          viewport={viewport}
          featureGroupRef={this.featureGroupRef}
          onViewportChanged={this._onMapViewportChanged}
          onGeocoderResult={this._onGeocoderResult}
          onDrawCreated={this._onDrawCreated}
          onDrawEdited={this._onDrawEdited}
          onDrawDeleted={this._onDrawDeleted}
        >
          <Guide step={step} />
          <ConfirmationPortal
            open={isLayerSelected}
            area={this.state.polygonsArea}
            selectedLayers={selectedLayers}
          />
          <LayerSelector
            onToggleLayer={this._onToggleLayer}
            selectedLayers={selectedLayers}
          />
        </Map>
      </div>
    );
  }
}

export default Index;
