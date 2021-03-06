import axios from "axios";
import dynamic from "next/dynamic";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import CliengoLoader from "../components/CliengoLoader";
import LayersFab from "../components/LayersFab";
// import LayerLegend from "../components/LayerLegend";
import LayersLegendExpansionPanel from "../components/LayersLegendExpansionPanel";
import LoadingProgress from "../components/LoadingProgress";
import QuoteButton from "../components/QuoteButton";
import { withNamespaces } from "../i18n";
import { buildApiUrl } from "../utils/api";
import { withAuthSync } from "../utils/auth";

// const sentinelModifiedAttribution =
//   'Contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';
// const dymaxionAttribution = "&copy; Dymaxion Labs 2019";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: LoadingProgress
});

const TileLayer = dynamic(() => import("../components/TileLayer"), {
  ssr: false
});

const VectorTileLayer = dynamic(() => import("../components/VectorTileLayer"), {
  ssr: false
});

class Maps extends React.Component {
  state = {
    map: null,
    bounds: null,
    activeLayers: [],
    viewport: {
      center: [-36.179114636463652, -62.846142338298094],
      zoom: 12
    },
    layersOpacity: {}
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  componentDidMount() {
    this._loadMap();
  }

  _loadMap() {
    const { token } = this.props;
    const { uuid } = this.props.query;

    const headers = token ? { Authorization: token } : {};

    axios
      .get(buildApiUrl(`/maps/${uuid}/`), { headers: headers })
      .then(response => {
        const { map } = response.data;
        const minBounds = [map.extent[1], map.extent[0]];
        const maxBounds = [map.extent[3], map.extent[2]];
        const bounds = [minBounds, maxBounds];

        this.setState({ map: map, bounds: bounds });
        this._toggleActiveLayers(map.layers);
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          if (response.status === 404) {
            this._alert("Map was not found.");
          } else {
            this._alert(
              "An error ocurred when trying to load map. Please try accessing again later."
            );
          }
          window.location.href = "/";
        }
      });
  }

  _alert(msg) {
    alert(msg);
  }

  _toggleActiveLayers(layers) {
    const activeLayers = layers
      .filter(mapLayer => mapLayer.is_active)
      .map(mapLayer => mapLayer.layer.uuid);
    this.setState({ activeLayers });
  }

  _trackEvent(action, value) {
    this.props.analytics.event("Layers", action, value);
  }

  handleMapViewportChanged = viewport => {
    this.setState({ viewport });
  };

  handleToggleLayer = layer => {
    if (!layer) return; // just in case

    const uuid = layer.uuid;
    const activeLayers = this._addOrRemove(this.state.activeLayers, uuid);

    if (activeLayers.includes(uuid)) {
      this._trackEvent("enable-layer", uuid);
    } else {
      this._trackEvent("disable-layer", uuid);
    }

    this.setState({ activeLayers: activeLayers });
  };

  _addOrRemove(array, item) {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  }

  handleOpacityChange = (uuid, value) => {
    this.setState({
      layersOpacity: {
        ...this.state.layersOpacity,
        [uuid]: value
      }
    });
  };

  render() {
    const { token } = this.props;
    const { viewport, bounds, map, activeLayers, layersOpacity } = this.state;

    const layers = map
      ? map.layers
          .sort((a, b) => a.order - b.order)
          .map(mapLayer => mapLayer.layer)
      : [];

    // Sorted active layers
    const sortedActiveLayers = layers.filter(layer =>
      activeLayers.includes(layer.uuid)
    );

    // Build tile layers from active layers: use TileLayer or VectorTileLayer based on layer type
    let tileLayers = [];
    if (map) {
      for (let i = 0; i < sortedActiveLayers.length; i++) {
        const layer = sortedActiveLayers[i];

        const zIndex = sortedActiveLayers.length - i;
        const opacity = (layersOpacity[layer.uuid] || 100) / 100;
        const maxZoom =
          (layer.extra_fields && layer.extra_fields.maxZoom) || 18;
        const url = layer.tiles_url;

        if (layer.layer_type === "R") {
          tileLayers.push(
            <TileLayer
              key={layer.uuid}
              type="raster"
              url={url}
              maxNativeZoom={maxZoom}
              opacity={opacity}
              zIndex={zIndex}
            />
          );
        } else {
          const styles = layer.extra_fields && layer.extra_fields["styles"];

          tileLayers.push(
            <VectorTileLayer
              key={layer.uuid}
              type="protobuf"
              url={url}
              subdomains=""
              maxNativeZoom={maxZoom}
              opacity={opacity}
              vectorTileLayerStyles={styles}
              zIndex={zIndex}
            />
          );
        }
      }
    }

    const layersWithLegend = layers.filter(
      layer =>
        activeLayers.includes(layer.uuid) &&
        layer.extra_fields &&
        layer.extra_fields.legend
    );

    const mapboxStyle = map && map.extra_fields && map.extra_fields.mapboxStyle;

    let areaData;
    if (
      map &&
      map.extra_fields &&
      map.extra_fields["showAreaExtent"] &&
      layers.length > 0
    ) {
      const layer = layers[0];
      areaData = layer.area_geom;
    }

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
          onViewportChanged={this.handleMapViewportChanged}
          mapboxStyle={mapboxStyle}
          roiData={areaData}
        >
          <LayersFab
            layers={layers}
            activeLayers={activeLayers}
            layersOpacity={layersOpacity}
            onToggle={this.handleToggleLayer}
            onOpacityChange={this.handleOpacityChange}
          />
          <LayersLegendExpansionPanel layers={layersWithLegend} />
          <QuoteButton isAuthenticated={Boolean(token)} />
          {tileLayers}
        </Map>
      </div>
    );
  }
}

Maps.propTypes = {
  t: PropTypes.func.isRequired
};

Maps = withNamespaces()(Maps);
Maps = withAuthSync(Maps, { redirect: false });

export default Maps;
