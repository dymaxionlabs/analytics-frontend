import {
  withLeaflet,
  Map,
  TileLayer,
  ZoomControl,
  GeoJSON
} from "react-leaflet";
import { Image } from "semantic-ui-react";

import "leaflet/dist/leaflet.css";

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
  flex: 1
};

//import VectorGridDefault from "react-leaflet-vectorgrid";
//const VectorGrid = withLeaflet(VectorGridDefault);

// const lotsVectorGrid = {
//   type: "protobuf",
//   url: "https://tiler.dymaxionlabs.com/data/smap_2018/{z}/{x}/{y}.pbf",
//   subdomains: "",
//   vectorTileLayerStyles: {
//     style: {
//       weight: 0.5,
//       opacity: 1,
//       color: "#fff",
//       fillColor: "#00b2ff",
//       fillOpacity: 0.6,
//       fill: true,
//       stroke: true
//     },
//     hoverStyle: {
//       fillColor: "#390870",
//       fillOpacity: 1
//     },
//     activeStyle: {
//       fillColor: "#390870",
//       fillOpacity: 1
//     },
//     zIndex: 401
//   }
// };

const lotsData = require("../../static/agri/lots.json");
const roiData = require("../../static/agri/roi.json");
const lotColors = {
  S: "rgb(253, 153, 2)",
  ST: "rgb(253, 153, 2)",
  S2: "rgb(153, 170, 105)",
  M: "rgb(239, 192, 0)",
  MT: "rgb(239, 180, 0)",
  G1: "rgb(30, 215, 206)"
};

const roiStyle = {
  fillOpacity: 0
};

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const styleId = "mapbox.streets-satellite";
const basemapUrl = `https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

const Logo = () => (
  <a href="//www.dymaxionlabs.com" target="_blank">
    <Image
      src="/static/logo.png"
      style={{
        position: "absolute",
        right: 10,
        bottom: 25,
        zIndex: 1000
      }}
    />
  </a>
);

class ViewMap extends React.Component {
  getLotStyle = feature => {
    const color = lotColors[feature.properties.SIGLA] || "#ff0000";
    return {
      color: color,
      fillColor: color,
      opacity: 0,
      fillOpacity: 0.95,
      weight: 2
    };
  };

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
        maxZoom={15}
        minZoom={10}
      >
        {/* <VectorGrid {...lotsVectorGrid} /> */}
        <TileLayer
          attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
          url={basemapUrl}
        />
        <TileLayer
          url="https://storage.googleapis.com/dym-tiles/custom/dym-agro-trenque-lauquen/s2rgb/{z}/{x}/{y}.png"
          attribution="&copy; Copernicus (TODO)"
        />
        <GeoJSON data={roiData} style={roiStyle} />
        <GeoJSON data={lotsData} style={this.getLotStyle} />

        <TileLayer
          url="https://storage.googleapis.com/dym-tiles/custom/dym-agro-trenque-lauquen/ndvi/{z}/{x}/{y}.png"
          attribution="&copy; Copernicus (TODO)"
        />
        <ZoomControl position="topright" />
        <Logo />
        {children}
      </Map>
    );
  }
}

export default ViewMap;
