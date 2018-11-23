import React, { Component } from 'react';
import './App.css';

import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl,
} from "react-mapbox-gl";

import Geocoder from './Geocoder'
//import ControlPanel from './control-panel';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
})

const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
  flex: 1
};

class App extends Component {

  state = {
    center: [-58.373219, -34.609032],
    zoom: [7],
    isActive: false,
  }

  mapRef = React.createRef()

  _onGeocoderResult = () => {
    this.setState({ isActive: true })
  }

  render() {

    /*
    let components = null

    if (this.state.isActive === true) {
      components =
        <div style={{ position: 'absolute', right: 0, top: 100, background: '#fff', margin: '24px', padding: '12px 24px', }}>
          < ControlPanel
            containerComponent={this.props.containerComponent}
            onChange={this.handleGeocoderViewportChange}
          />
        </div>
    }
    */

    return (
      <Map
        ref={this.mapRef}
        style="mapbox://styles/mapbox/satellite-streets-v9" // eslint-disable-line
        containerStyle={mapContainerStyle}
        center={this.state.center}
        zoom={this.state.zoom}
      >
        <ScaleControl />
        <ZoomControl />
        <RotationControl style={{ top: 70 }} />
        <Geocoder
          accessToken={MAPBOX_TOKEN}
          mapRef={this.mapRef}
          position="top-left"
          onResult={this._onGeocoderResult}
        />
      </Map>
    );

    /*
    <Geocoder
      mapRef={this.mapRef}
      onViewportChange={this.handleGeocoderViewportChange}
      mapboxApiAccessToken={MAPBOX_TOKEN}
      position='top-left'
      onResult={this.handleIsActive}

    />
    {components}
    */
  }
}

export default App