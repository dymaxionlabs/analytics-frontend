import { Map, TileLayer, ZoomControl, FeatureGroup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
  flex: 1
};

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const styleId = "mapbox.satellite";
const basemapUrl = `https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

class ViewMap extends React.Component {
  render() {
    const { children, viewport, onViewportChanged } = this.props;

    return (
      <Map
        ref="map"
        style={mapContainerStyle}
        viewport={viewport}
        zoomControl={false}
        animate={true}
        onViewportChanged={onViewportChanged}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
          url={basemapUrl}
        />
        <ZoomControl position="topright" />
        {children}
      </Map>
    );
  }
}

export default ViewMap;
