import React, { Component } from 'react';
import './App.css';
import ReactMapGL, { NavigationControl } from 'react-map-gl';
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

  constructor(props) {
    super(props)
    this.handleViewportChange = this.handleViewportChange.bind(this)

  }

  handleViewportChange(viewport) {
    this.setState({ viewport })

  }

  render() {
    return (
      <ReactMapGL
        {...this.state.viewport}
        onViewportChange={this.handleViewportChange}
        mapStyle={this.state.mapStyle}
        mapboxApiAccessToken="pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw"

      >
        <div style={{ position: 'absolute', right: 0 }}>
          <NavigationControl
            onViewportChange={this.handleViewportChange}
            showCompass={false}

          />
        </div>
      </ReactMapGL>
    );
  }
}

export default App;
