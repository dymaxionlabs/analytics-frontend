import React, { Component } from 'react';
import './App.css';
import MapGL, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'react-map-gl-geocoder'

const MAPBOX_TOKEN = "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"

class App extends Component {

  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: -34.609032,
      longitude: -58.373219,
      zoom: 7,
    },
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v9'
  };

  constructor(props) {
    super(props)
    this.handleViewportChange = this.handleViewportChange.bind(this)

  }

  handleViewportChange(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }


  mapRef = React.createRef()

  componentDidMount() {
    window.addEventListener('resize', this.resize)
    this.resize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  resize = () => {
    this.handleViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  handleGeocoderViewportChange = (viewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 }

    return this.handleViewportChange({
      ...viewport,
      ...geocoderDefaultOverrides
    })
  }


  render() {
    return (
      <MapGL
        {...this.state.viewport}
        ref={this.mapRef}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this.handleViewportChange}
        mapStyle={this.state.mapStyle}
      >
        <div style={{ position: 'absolute', right: 10, top: 10 }}>
          <NavigationControl
            onViewportChange={this.handleViewportChange}
            showCompass={false}

          />
        </div>
        <Geocoder
          mapRef={this.mapRef}
          onViewportChange={this.handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position='top-left'
        />
      </MapGL>
    );
  }
}



export default App;
