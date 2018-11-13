import React, { Component } from 'react';
import './App.css';
import MapGL from 'react-map-gl';

class App extends Component {

  state = {
    viewport: {
      width: "100vw",
      height: "100vh",
      latitude: -34.609032,
      longitude: -58.373219,
      zoom: 12,
      mapStyle: 'mapbox://styles/mapbox/satellite-v9'
    }

  };

  render() {
    return (
      <MapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapboxApiAccessToken="pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"
      />
    );
  }
}

export default App;
