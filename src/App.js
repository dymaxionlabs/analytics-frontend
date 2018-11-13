import React, { Component } from 'react';
import './App.css';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


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

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
        mapStyle={this.state.mapStyle}
        mapboxApiAccessToken="pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"
      />
    );
  }
}

export default App;
