import './App.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'

import React, { Component } from 'react'
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl,
} from "react-mapbox-gl"

import DrawControl from './DrawControl'
import Geocoder from './Geocoder'
import ControlPanel from './control-panel'

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
    let components = null

    if (this.state.isActive === true) {
      components =
        <div style={{ position: 'absolute', right: 0, top: 100, background: '#fff', margin: '24px', padding: '12px 24px', }}>
          <ControlPanel
            mapRef={this.mapRef}
          />
        </div>
    }

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
        <DrawControl controls={{ polygon: true, trash: true }} mapRef={this.mapRef} position="top-left" displayControlsDefault={false} />
        {components}
      </Map>
    );
  }
}

export default App