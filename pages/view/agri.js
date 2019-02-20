import "../../static/index.css"; // FIXME Convert to JSX styles
import "../../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import { withNamespaces, Link } from "../../i18n";
import Head from "next/head";
import dynamic from "next/dynamic";
import {
  Dimmer,
  Loader,
  Segment,
  Header,
  List,
  Button
} from "semantic-ui-react";
import LayerSelector from "../../components/LayerSelector";
import SimpleModalContactForm from "../../components/SimpleModalContactForm";

const lotsData = require("../../static/agri/lots.json");
const roiData = require("../../static/agri/roi.json");

const cropLotTypes = ["S", "S2", "ST", "M", "MT", "G1"];

// FIXME colors should be in geojson
const lotColors = {
  S: "#67d1ca",
  ST: "#677dca",
  S2: "#cada50",
  M: "#fdae61",
  MT: "#e77148",
  G1: "#b95af0"
};

const initialViewport = {
  center: [-36.179114636463652, -62.846142338298094],
  zoom: 12
};

const availableLayers = ["crop_lots", "true_color", "ndvi"];

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
const Map = dynamic(() => import("../../components/view/Map"), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size="big">Cargando...</Loader>
    </Dimmer>
  )
});

const VectorLayer = dynamic(() => import("../../components/VectorLayer"), {
  ssr: false
});
const RasterLayer = dynamic(() => import("../../components/RasterLayer"), {
  ssr: false
});

const Color = ({ value }) => (
  <div>
    <style jsx>{`
      div {
        border: 1px solid #000;
        width: 16px;
        height: 16px;
        background-color: ${value};
        display: inline-block;
        margin-right: 8px;
        margin-bottom: -3px;
      }
    `}</style>
  </div>
);

const LotsLegend = withNamespaces("case_study__agri")(({ t }) => (
  <div>
    <Segment
      style={{
        position: "fixed",
        right: 20,
        bottom: 110,
        zIndex: 1000,
        width: 160,
        cursor: "default"
      }}
    >
      <Header style={{ marginBottom: "0.2em" }}>
        {t("crop_lots_legend_header")}
      </Header>
      <Header as="h5" style={{ margin: 0 }}>
        {t("crop_lots_legend_subheader")}
      </Header>
      <List>
        {cropLotTypes.map(id => (
          <List.Item key={id} style={{ marginBottom: "3px" }}>
            <List.Content>
              <List.Header>
                <Color value={lotColors[id]} />
                {t(`crop_lots_type_${id}`)}
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  </div>
));

class LotsLayer extends React.Component {
  _style = feature => {
    const color = lotColors[feature.properties["SIGLA"]] || "#ff0000";

    return {
      color: color,
      fillColor: color,
      opacity: 1,
      fillOpacity: 0.5,
      weight: 2
    };
  };

  _onEachFeature = (feature, layer) => {
    const { t } = this.props;
    const id = feature.properties["SIGLA"];
    const popupContent = `<b>${t(`crop_lots_type_${id}`)}</b>`;
    layer.bindPopup(popupContent, {
      closeButton: false,
      offset: L.point(0, -20)
    });
    layer.on("mouseover", () => {
      layer.setStyle({ color: "#fff", weight: 3, fillOpacity: 1 });
      layer.openPopup();
    });
    layer.on("mouseout", () => {
      layer.setStyle(this._style(feature));
      layer.closePopup();
    });
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <VectorLayer
          data={lotsData}
          style={this._style}
          attribution={dymaxionAttribution}
          onmouseover={this._onMouseOver}
          onmouseout={this._onMouseOut}
          onEachFeature={this._onEachFeature}
        />
        <LotsLegend t={t} />
      </div>
    );
  }
}

const QuoteButton = ({ t }) => (
  <div style={{ position: "fixed", left: 20, top: 20, zIndex: 1000 }}>
    <Link href="/">
      <Button primary>{t("request_quote")}</Button>
    </Link>
  </div>
);

class AgriMap extends React.Component {
  state = {
    viewport: initialViewport,
    selectedLayers: ["ndvi", "crop_lots"]
  };

  static async getInitialProps({ query }) {
    return {
      query: query,
      namespacesRequired: ["case_study", "case_study__agri"]
    };
  }

  componentDidMount() {
    const { lang } = this.props.query;
    if (lang) {
      console.log(`Setting language to '${lang}'`);
      i18n.changeLanguage(lang);
    }
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
    const { t } = this.props;
    const { viewport, selectedLayers } = this.state;

    const showLotsLayer = selectedLayers.includes("crop_lots");
    const selectedRasterLayers = rasterLayers.filter(layer =>
      selectedLayers.includes(layer.id)
    );

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
          roiData={roiData}
          onViewportChanged={this._onMapViewportChanged}
        >
          {showLotsLayer ? <LotsLayer t={t} /> : ""}
          {Object.keys(selectedRasterLayers).map(key => (
            <RasterLayer key={key} {...selectedRasterLayers[key]} />
          ))}

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
          <QuoteButton t={t} />
        </Map>
      </div>
    );
  }
}

export default withNamespaces("case_study", "case_study__agri")(AgriMap);
