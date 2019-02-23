import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import { withNamespaces } from "../i18n";
import { withAuthSync } from "../utils/auth";
import { buildApiUrl } from "../utils/api";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";

const initialViewport = {
  center: [-36.179114636463652, -62.846142338298094],
  zoom: 12
};

const sentinelModifiedAttribution =
  'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';

const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

const rasterLayers = [
  {
    id: "true_color",
    type: "raster",
    url:
      "https://storage.googleapis.com/dym-tiles/custom/dym-agro-trenque-lauquen/s2rgb/{z}/{x}/{y}.png",
    attribution: sentinelModifiedAttribution
  },
  {
    id: "ndvi",
    type: "raster",
    url:
      "https://storage.googleapis.com/dym-tiles/custom/dym-agro-trenque-lauquen/ndvi/{z}/{x}/{y}.png",
    attribution: sentinelModifiedAttribution
  }
  // {
  //   id: "lots",
  //   type: "vector-geojson",
  //   data: lotsData,
  //   attribution: dymaxionAttribution
  // }
];

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/view/Map"), {
  ssr: false,
  loading: withNamespaces()(({ t }) => (
    <Dimmer active>
      <Loader size="big">{t("loading")}</Loader>
    </Dimmer>
  ))
});

const VectorLayer = dynamic(() => import("../components/VectorLayer"), {
  ssr: false
});
const RasterLayer = dynamic(() => import("../components/RasterLayer"), {
  ssr: false
});

class LayerMap extends React.Component {
  state = {
    layer: null,
    viewport: initialViewport
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  componentDidMount() {
    const { id } = this.props.query;

    axios
      .get(buildApiUrl(`/layers/${id}`), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        console.log(response.data);
        this.setState({ layer: response.data });
      });
  }

  _trackEvent(action, value) {
    this.props.analytics.event("View-Agri", action, value);
  }

  _onMapViewportChanged = viewport => {
    this.setState({ viewport });
  };

  _onToggleLayer = layer => {
    const selectedLayers = this._addOrRemove(this.state.selectedLayers, layer);

    if (selectedLayers.includes(layer)) {
      this._trackEvent("enable-layer", layer);
    } else {
      this._trackEvent("disable-layer", layer);
    }

    this.setState({ selectedLayers });
  };

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  render() {
    const { viewport, selectedLayers } = this.state;

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
          onViewportChanged={this._onMapViewportChanged}
        />
      </div>
    );
  }
}

LayerMap = withNamespaces()(LayerMap);
LayerMap = withAuthSync(LayerMap);

export default LayerMap;
