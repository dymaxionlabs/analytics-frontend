import "../../static/index.css"; // FIXME Convert to JSX styles
import "../../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader, Segment, Header, List } from "semantic-ui-react";

const lotsData = require("../../static/agri/lots.json");
const roiData = require("../../static/agri/roi.json");

// FIXME colors should be in geojson
const lotColors = {
  S: "rgb(253, 153, 2)",
  ST: "rgb(253, 153, 2)",
  S2: "rgb(153, 170, 105)",
  M: "rgb(239, 192, 0)",
  MT: "rgb(239, 180, 0)",
  G1: "rgb(30, 215, 206)"
};

// FIXME use labels from geojson
const lotLabels = {
  S: "Soja 1°",
  S2: "Soja 2°",
  ST: "Soja tardía",
  M: "Maíz temprano",
  MT: "Maíz tardío",
  G1: "Girasol 1°"
};

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../../components/view/Map"), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size="big">Cargando...</Loader>
    </Dimmer>
  )
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

const LotsLegend = () => (
  <div>
    <Segment
      style={{
        position: "fixed",
        right: 80,
        bottom: 40,
        zIndex: 1000,
        width: 160,
        cursor: "default"
      }}
    >
      <Header>Tipo de cultivo</Header>
      <List>
        {Object.keys(lotLabels).map(id => (
          <List.Item style={{ marginBottom: "3px" }}>
            <List.Content>
              <List.Header>
                <Color value={lotColors[id]} />
                {lotLabels[id]}
              </List.Header>
            </List.Content>
          </List.Item>
        ))}
      </List>
    </Segment>
  </div>
);

const DEFAULT_VIEWPORT = {
  center: [-36.179114636463652, -62.846142338298094],
  zoom: 12
};

class AgriMap extends React.Component {
  state = {
    viewport: DEFAULT_VIEWPORT
  };

  _trackEvent(action, value) {
    this.props.analytics.event("View-Agri", action, value);
  }

  _onMapViewportChanged = viewport => {
    this.setState({ viewport });
  };

  render() {
    const { viewport } = this.state;

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
        <Map viewport={viewport} onViewportChanged={this._onMapViewportChanged}>
          <LotsLegend />
        </Map>
      </div>
    );
  }
}

export default AgriMap;
