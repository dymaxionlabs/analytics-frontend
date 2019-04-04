import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import { withNamespaces } from "../i18n";
import { withAuthSync } from "../utils/auth";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader, Button } from "semantic-ui-react";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/quote/TrialMap"), {
  ssr: false,
  loading: withNamespaces()(({ t }) => (
    <Dimmer active>
      <Loader size="big">{t("loading")}</Loader>
    </Dimmer>
  ))
});

import ConfirmationPortal from "../components/quote/ConfirmationPortal";
import LayerSelector from "../components/quote/LayerSelector";
import Guide from "../components/quote/Guide";
import SimpleModalContactForm from "../components/quote/SimpleModalContactForm";

const initialViewport = {
  center: [-34.43888767776975, -58.93332694025683],
  zoom: 16
};

const availableLayers = ["roofs", "pools", "roads", "soil", "floods", "ndvi"];

// Not using <Link> because we need a full refresh to work with MUI-based pages
const LoginButton = withNamespaces()(({ t }) => (
  <a href="/login" style={{ margin: "0 5px" }}>
    <Button>{t("login_btn")}</Button>
  </a>
));

const DashboardButton = withNamespaces()(({ t }) => (
  <a href="/home">
    <Button>{t("dashboard_btn")}</Button>
  </a>
));

const SignUpButton = withNamespaces()(({ t }) => (
  <a href="/signup" style={{ margin: "0 5px" }}>
    <Button primary>{t("signup_btn")}</Button>
  </a>
));

class Quote extends React.Component {
  state = {
    viewport: initialViewport,
    selectedLayers: [],
    polygonsArea: 0,
    step: "initial"
  };

  featureGroupRef = React.createRef();

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: [
        "index",
        "common",
        "geocoder_control",
        "draw_control",
        "confirmation_portal",
        "modal_contact_form"
      ],
      query: query
    };
  }

  constructor(props) {
    super(props);

    const { lat, lng, zoom } = props.query;

    if (lat && lng) {
      this.state.viewport.center = [lat, lng];
    }
    if (zoom) {
      this.state.viewport.zoom = zoom;
    }
  }

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

  _onDrawCreated = event => {
    this._trackEvent("draw-geometry", event.layerType);

    this._updatePolygonsArea();
    if (this._hasAnyLayerSelected()) {
      this.setState({ step: "layer_selected" });
    } else {
      this.setState({ step: "polygon_drawn" });
    }
  };

  _onDrawEdited = event => {
    this._trackEvent("edit-geometry");

    this._updatePolygonsArea();
  };

  _onDrawDeleted = event => {
    this._trackEvent("delete-geometry");

    if (!this._updatePolygonsArea() && !this._hasAnyPolygons() == true) {
      this.setState({ step: "search_done" });
    }
  };

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

  _onToggleLayer = layer => {
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
  };

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
    const { token, t } = this.props;
    const { viewport, step, selectedLayers } = this.state;
    const isLayerSelected = step === "layer_selected";

    return (
      <div className="index">
        <Head>
          <title>{t("title")}</title>
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
            token={token}
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
            availableLayers={availableLayers}
            selectedLayers={selectedLayers}
          />
          <SimpleModalContactForm
            trigger={
              <div
                style={{
                  position: "absolute",
                  bottom: -5,
                  right: 90,
                  zIndex: 1000
                }}
              >
                <Button
                  className="controlButton"
                  circular
                  icon="mail"
                  size="massive"
                />
              </div>
            }
          />
          {this.props.token ? (
            <div
              style={{ position: "fixed", right: 50, top: 10, zIndex: 1000 }}
            >
              <DashboardButton />
            </div>
          ) : (
            <div
              style={{ position: "fixed", right: 50, top: 10, zIndex: 1000 }}
            >
              <SignUpButton />
              <LoginButton />
            </div>
          )}
        </Map>
      </div>
    );
  }
}

Quote = withNamespaces()(Quote);
Quote = withAuthSync(Quote, { redirect: false });

export default Quote;
