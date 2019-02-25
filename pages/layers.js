import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import { withNamespaces } from "../i18n";
import { withAuthSync, logout } from "../utils/auth";
import { buildApiUrl } from "../utils/api";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader } from "semantic-ui-react";
import axios from "axios";
import LayerLegend from "../components/LayerLegend";

const initialViewport = {
  center: [-36.179114636463652, -62.846142338298094],
  zoom: 12
};

// const sentinelModifiedAttribution =
//   'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';

// const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/view/Map"), {
  ssr: false,
  loading: withNamespaces()(({ t }) => (
    <Dimmer active>
      <Loader size="big">{t("loading")}</Loader>
    </Dimmer>
  ))
});

const TileLayer = dynamic(() => import("../components/TileLayer"), {
  ssr: false
});

const VectorTileLayer = dynamic(() => import("../components/VectorTileLayer"), {
  ssr: false
});

class LayerMap extends React.Component {
  state = {
    layer: null,
    bounds: null,
    viewport: initialViewport
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  componentDidMount() {
    const { uuid } = this.props.query;

    axios
      .get(buildApiUrl(`/layers/${uuid}/`), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        console.log(response.data);
        const layer = response.data;
        const minBounds = [layer.extent[1], layer.extent[0]];
        const maxBounds = [layer.extent[3], layer.extent[2]];
        const bounds = [minBounds, maxBounds];
        console.log(bounds);
        this.setState({ layer: layer, bounds: bounds });
      })
      .catch(err => {
        const response = err.response;
        if (!response || response.status >= 400) {
          logout();
        }
      });
  }

  _trackEvent(action, value) {
    this.props.analytics.event("Layers", action, value);
  }

  _onMapViewportChanged = viewport => {
    this.setState({ viewport });
  };

  render() {
    const { viewport, bounds, layer } = this.state;

    // Build tile layer: use TileLayer or VectorTileLayer based on layer type
    let tileLayer;
    if (layer) {
      if (layer.layer_type === "R") {
        tileLayer = <TileLayer type="raster" url={layer.tiles_url} />;
      } else {
        const url = layer.tiles_url;
        tileLayer = (
          <VectorTileLayer
            id="layer"
            type="protobuf"
            url={url}
            subdomains=""
            vectorTileLayerStyles={
              layer.extra_fields && layer.extra_fields["styles"]
            }
          />
        );
      }
    }

    // Get area polygon
    const areaData = layer && layer.area_geom;

    // Build Legend (if legend key is present on extra_fields)
    const legendOpts =
      layer && layer.extra_fields && layer.extra_fields["legend"];
    const legend = legendOpts && <LayerLegend {...legendOpts} />;

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
          bounds={bounds}
          viewport={viewport}
          onViewportChanged={this._onMapViewportChanged}
          roiData={areaData}
        >
          {tileLayer}
          {legend}
        </Map>
      </div>
    );
  }
}

LayerMap = withNamespaces()(LayerMap);
LayerMap = withAuthSync(LayerMap);

export default LayerMap;
