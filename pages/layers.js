import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout
import { Dimmer, Loader } from "semantic-ui-react";
import CliengoLoader from "../components/CliengoLoader";
import LayerLegend from "../components/LayerLegend";
import { withNamespaces } from "../i18n";
import "../static/App.css"; // FIXME Convert to JSX styles
import "../static/index.css"; // FIXME Convert to JSX styles
import { buildApiUrl } from "../utils/api";
import { logout, withAuthSync } from "../utils/auth";

const initialViewport = {
  center: [-36.179114636463652, -62.846142338298094],
  zoom: 12
};

// const sentinelModifiedAttribution =
//   'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';
// const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/Map"), {
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

class Layers extends React.Component {
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
        const layer = response.data;
        const minBounds = [layer.extent[1], layer.extent[0]];
        const maxBounds = [layer.extent[3], layer.extent[2]];
        const bounds = [minBounds, maxBounds];
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
      const url = layer.tiles_url;
      const maxZoom = (layer.extra_fields && layer.extra_fields.maxZoom) || 18;

      if (layer.layer_type === "R") {
        tileLayer = (
          <TileLayer type="raster" url={layer.tiles_url} maxZoom={maxZoom} />
        );
      } else {
        const styles = layer.extra_fields && layer.extra_fields["styles"];

        tileLayer = (
          <VectorTileLayer
            id="layer"
            type="protobuf"
            url={url}
            subdomains=""
            maxNativeZoom={maxZoom}
            vectorTileLayerStyles={styles}
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
          <CliengoLoader />
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

Layers = withNamespaces()(Layers);
Layers = withAuthSync(Layers);

export default Layers;
