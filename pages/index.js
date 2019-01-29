import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader, Image } from "semantic-ui-react";

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
    step: "search_done"
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

  _trackEvent(action, value) {
    this.props.analytics.event("Quotation", action, value);
  }

  _onGeocoderSearch = query => {
    this._trackEvent("search-geocoder", query);
  };

  _onGeocoderResult = result => {
    this._trackEvent("select-geocoder-result", result.title);

    if (!this._hasAnyPolygons() && !this._hasAnyLayerSelected()) {
      this.setState({ step: "search_done" });
    }
  };

  _onDrawCreated(event) {
    this._trackEvent("draw-geometry", event.layerType);

    this._updatePolygonsArea();
    if (this._hasAnyLayerSelected()) {
      this.setState({ step: "layer_selected" });
    } else {
      this.setState({ step: "polygon_drawn" });
    }
  }

  _onDrawEdited(event) {
    this._trackEvent("edit-geometry");

    this._updatePolygonsArea();
  }

  _onDrawDeleted(event) {
    this._trackEvent("delete-geometry");

    if (!this._updatePolygonsArea() && !this._hasAnyPolygons() == true) {
      this.setState({ step: "search_done" });
    }
  }

  _hasAnyPolygons() {
    return this._polygonLayers().length > 0;
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
    const featGroup = this.featureGroupRef.current;
    return featGroup && featGroup.leafletElement;
  }

  _hasAnyLayerSelected() {
    return this.state.selectedLayers.length > 0;
  }

  _polygonLayers() {
    const featureGroup = this._getFeatureGroup();
    return featureGroup ? featureGroup.getLayers() : [];
  }

  _onToggleLayer(layer) {
    const selectedLayers = this._addOrRemove(this.state.selectedLayers, layer);

    if (selectedLayers.includes(layer)) {
      this._trackEvent("enable-layer", layer);
    } else {
      this._trackEvent("disable-layer", layer);
    }

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
    let { step } = this.state;
    if (step === "initial") {
      step = "search_done";
    }
    this.setState({ viewport, step });
  };

  _onConfirmClick = () => {
    this._trackEvent("confirm-quotation");
  };

  _onContactFormModalClose = () => {
    this._trackEvent("cancel-form");
  };

  _onContactFormSubmit = () => {
    this._trackEvent("submit-form");
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
          <link
            rel="shortcut icon"
            type="image/x-icon"
            href="/static/favicon.ico"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Map
          viewport={viewport}
          featureGroupRef={this.featureGroupRef}
          onViewportChanged={this._onMapViewportChanged}
          onGeocoderSearch={this._onGeocoderSearch}
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
            polygonLayers={this._polygonLayers()}
            onConfirmClick={this._onConfirmClick}
            onContactFormModalClose={this._onContactFormModalClose}
            onContactFormSubmit={this._onContactFormSubmit}
          />
          <LayerSelector
            onToggleLayer={this._onToggleLayer}
            selectedLayers={selectedLayers}
          />
          <a href="//www.dymaxionlabs.com" target="_blank">
            <Image
              src="/static/logo.png"
              style={{
                position: "absolute",
                right: 10,
                bottom: 25,
                zIndex: 1000
              }}
            />
          </a>
        </Map>
      </div>
    );
  }
}

export default Index;
