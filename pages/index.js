import "../static/index.css"; // FIXME Convert to JSX styles
import "../static/App.css"; // FIXME Convert to JSX styles
import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

import React from "react";
import dynamic from "next/dynamic";
import { Dimmer, Loader } from "semantic-ui-react";

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import("../components/TrialMap"), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size="big">Cargando</Loader>
    </Dimmer>
  )
});

import ControlPanel from "../components/control-panel";
import LayerSelector from "../components/LayerSelector";
import Guide from "../components/guide";



class Index extends React.Component {


  mapRef = React.createRef()
  geoRef = React.createRef()
  buttonRef = React.createRef()
  drawRef = React.createRef()


  state = {
    center: [-58.373219, -34.609032],
    zoom: [7],
    selectedLayers: [],
    isActive: false,
    step: "initial",
    guideContext: this.geoRef,
  }

  _onGeocoderResult = () => {
    this.setState({ isActive: true, step: "search_done", })
  }

  componentDidMount() {
    this.setState({ guideContext: this.geoRef, })
  }

  _onToggleLayer = layer => {
    const newSelectedLayers = this._addOrRemove(
      this.state.selectedLayers,
      layer
    );
    console.log(`newSelectedLayers: ${newSelectedLayers}`);
    this.setState({ selectedlayers: newSelectedLayers });
  };

  _addOrRemove = (array, item) => {
    const include = array.includes(item);
    return include
      ? array.filter(arrayItem => arrayItem !== item)
      : [...array, item];
  };

  render() {
    let controlPanel = null;
    if (this.state.isActive) {
      controlPanel = (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 100,
            background: "#fff",
            margin: "24px",
            padding: "12px 24px"
          }}
        >
          <ControlPanel
            mapRef={this.mapRef}
            selectedLayers={this.state.selectedLayers}
          />
        </div>
      );
    }

    return (
      <Map
        center={this.state.center}
        zoom={this.state.zoom}
        mapRef={this.mapRef}
        geocoderRef={this.geoRef}
        drawRef={this.drawRef}
        onGeocoderResult={this._onGeocoderResult}
      >
        <Guide
          step={this.state.step}
        // context={this.state.guideContext}
        />
        <LayerSelector
          ref={this.layerSelectorRef}
          onToggleLayer={this._onToggleLayer}
        />
        {controlPanel}
      </Map>
    );
  }
}

export default Index;
