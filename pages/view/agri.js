import "../../static/index.css"; // FIXME Convert to JSX styles
import "../../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Dimmer, Loader, Image } from "semantic-ui-react";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../../components/view/Map"), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size="big">Cargando...</Loader>
    </Dimmer>
  )
});

const DEFAULT_VIEWPORT = {
  center: [-34.43888767776975, -58.93332694025683],
  zoom: 16
};

class AgriMap extends React.Component {
  state = {
    viewport: DEFAULT_VIEWPORT
  };

  _trackEvent(action, value) {
    this.props.analytics.event("/view/agri", action, value);
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

export default AgriMap;
