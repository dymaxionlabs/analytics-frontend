import {
  Map as LeafletMap,
  TileLayer,
  ZoomControl,
  GeoJSON
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
  flex: 1
};

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const ROIPolygon = ({ data }) => (
  <GeoJSON
    data={data}
    style={{
      fillColor: "#000",
      fillOpacity: 0.05,
      color: "#fff",
      weight: 2
    }}
  />
);

const MapboxBasemap = ({ style }) => {
  const styleId = style || "mapbox.satellite";
  return (
    <Basemap
      url={`https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`}
      attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
    />
  );
};

const Basemap = ({ url, attribution }) => (
  <TileLayer url={url} attribution={attribution} zIndex={-1} />
);

class Map extends React.Component {
  render() {
    const { children, roiData, mapboxStyle, ...extraProps } = this.props;

    return (
      <LeafletMap
        ref="map"
        style={mapContainerStyle}
        zoomControl={false}
        {...extraProps}
      >
        <MapboxBasemap style={mapboxStyle} />
        {children}
        {roiData && <ROIPolygon data={roiData} />}

        <ZoomControl position="topright" />
      </LeafletMap>
    );
  }
}

export default Map;
