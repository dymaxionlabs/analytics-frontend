import { Map, TileLayer, ZoomControl } from "react-leaflet";
import GeocoderControl from "./GeocoderControl";
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

/*
import ReactMapboxGl, { ScaleControl, ZoomControl, RotationControl } from 'react-mapbox-gl'
import DrawControl from './DrawControl'

const drawControlStyles = [
  {
    "id": "gl-draw-line",
    "type": "line",
    "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#D20C0C",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    "id": "gl-draw-polygon-fill",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "paint": {
      "fill-color": "#D20C0C",
      "fill-outline-color": "#D20C0C",
      "fill-opacity": 0.1
    }
  },
  {
    "id": "gl-draw-polygon-stroke-active",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#D20C0C",
      "line-dasharray": [0.2, 2],
      "line-width": 2
    }
  },
  {
    "id": "gl-draw-polygon-and-line-vertex-halo-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 15,
      "circle-color": "blue"
    }
  },
  {
    "id": "gl-draw-polygon-and-line-vertex-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 3,
      "circle-color": "#FFF",
    }
  },
  {
    "id": "gl-draw-line-static",
    "type": "line",
    "filter": ["all", ["==", "$type", "LineString"], ["==", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#000",
      "line-width": 3
    }
  },
  {
    "id": "gl-draw-polygon-fill-static",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    "paint": {
      "fill-color": "#000",
      "fill-outline-color": "#000",
      "fill-opacity": 0.1
    }
  },
  {
    "id": "gl-draw-polygon-stroke-static",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["==", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#000",
      "line-width": 3
    }
  }
]

const Map = ReactMapboxGl({
  accessToken: MAPBOX_TOKEN
})

export default props => (
  <Map
    style='mapbox://styles/mapbox/satellite-streets-v9'  // eslint-disable-line
    containerStyle={mapContainerStyle}
    ref={props.mapRef}
    center={props.center}
    zoom={props.zoom}
    draw={props.drawRef}

  >
    <ScaleControl />
    <ZoomControl />
    <RotationControl style={{ top: 70 }} />
    <Geocoder
      ref={props.geocoderRef}
      mapRef={props.mapRef}
      accessToken={MAPBOX_TOKEN}
      onResult={props.onGeocoderResult}
      position='top-left'
    />
    <DrawControl
      styles={drawControlStyles}
      controls={{ polygon: true, trash: true }}
      mapRef={props.mapRef}
      position='top-left'
      displayControlsDefault={false}
      onDrawCreate={props.onDrawCreate}
    />
    {props.children}
  </Map>
)
*/

export default ({ children, center, zoom, onGeocoderResult }) => (
  <Map
    style={mapContainerStyle}
    center={center}
    zoom={zoom}
    zoomControl={false}
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
    {children}
  </Map>
);
