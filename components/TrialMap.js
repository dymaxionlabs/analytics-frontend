import {
  Map,
  TileLayer,
  ZoomControl,
  FeatureGroup,
  Rectangle
} from "react-leaflet";
import GeocoderControl from "./GeocoderControl";
import DrawControl from "./DrawControl";

import "leaflet/dist/leaflet.css";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
  flex: 1
};

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const styleId = "mapbox.streets-satellite";
const basemapUrl = `https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

const drawOptions = {
  polyline: false,
  circle: false,
  rectangle: {
    shapeOptions: {
      clickable: true
    }
  },
  marker: false,
  circlemarker: false
};

export default ({
  children,
  center,
  zoom,
  polygonBounds,
  onFeatureGroupClick,
  onClick,
  onGeocoderResult
}) => (
  <Map
    style={mapContainerStyle}
    center={center}
    zoom={zoom}
    zoomControl={false}
    onClick={onClick}
  >
    <TileLayer
      attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
      url={basemapUrl}
    />
    <ZoomControl position="topright" />
    <GeocoderControl
      accessToken={MAPBOX_TOKEN}
      onResult={onGeocoderResult}
      collapsed={false}
      position="topleft"
      placeholder="Search..."
      errorMessage="Nothing found."
    />
    <FeatureGroup onClick={onFeatureGroupClick}>
      <DrawControl position="topleft" draw={drawOptions} />
      {polygonBounds.map((bounds, i) => (
        <Rectangle key={i} bounds={bounds} />
      ))}
    </FeatureGroup>

    {children}
  </Map>
);
