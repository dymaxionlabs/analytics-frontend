import React, { Component } from 'react';
import './App.css';
import MapGL, { NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from 'react-map-gl-geocoder'
import ControlPanel from './control-panel';

const MAPBOX_TOKEN = "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"

class App extends Component {

  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: -34.609032,
      longitude: -58.373219,
      zoom: 7,
      bearing: 0,
      pitch: 0,
      isActive: false,
    },
    interactiveLayerIds: [],
    mapStyle: 'mapbox://styles/mapbox/satellite-streets-v9'
  };

  _onClick = (event) => {
    const feature = event.features && event.features[0];

    if (feature) {
      window.alert(`Clicked layer ${feature.layer.id}`);
    }
  };

  _getCursor = ({ isHovering, isDragging }) => {
    return isHovering ? 'pointer' : 'default';
  };

  handleViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    })
  }

  handleIsActive = () => {
    this.setState({ isActive: true })
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
    return (
      <MapGL
        {...this.state.viewport}
        ref={this.mapRef}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onViewportChange={this.handleViewportChange}
        mapStyle={this.state.mapStyle}
        clickRadius={2}
        onClick={this._onClick}
        getCursor={this._getCursor}
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
          onResult={this.handleIsActive}

        />
        {components}
      </MapGL >
    );
  }
}
export default App;
