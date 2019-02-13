import {
  withLeaflet,
  Map,
  TileLayer,
  ZoomControl,
  GeoJSON
} from "react-leaflet";
import Logo from "../../components/Logo";

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

// FIXME Move this to config/
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2Vzc2ljYTExMTIiLCJhIjoiY2pvZnYwYmV0MDhrYjNxanRpc2E3enhydiJ9.fawTIAVKzqpOE41wkVw1Zw";

const styleId = "mapbox.streets-satellite";
const basemapUrl = `https://api.tiles.mapbox.com/v4/${styleId}/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`;

const ROIPolygon = ({ data }) => (
  <GeoJSON
    data={data}
    style={{
      fillColor: "#000",
      fillOpacity: 0.1
    }}
  />
);

const Basemap = ({ url }) => (
  <TileLayer
    attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
    url={url}
  />
);

const attribution =
  '&copy; Dymaxion Labs 2019, contains modified <a href="http://www.esa.int/Our_Activities/Observing_the_Earth/Copernicus">Copernicus</a> Sentinel data 2019, processed by ESA.';

class ViewMap extends React.Component {
  render() {
    const { children, viewport, onViewportChanged, roiData } = this.props;

    return (
      <Map
        ref="map"
        style={mapContainerStyle}
        viewport={viewport}
        zoomControl={false}
        onViewportChanged={onViewportChanged}
        maxZoom={15}
        minZoom={10}
      >
        {/* <VectorGrid {...lotsVectorGrid} /> */}
        <Basemap url={basemapUrl} />
        {children}
        <ROIPolygon data={roiData} />

        <ZoomControl position="topright" />
      </Map>
    );
  }
}

export default ViewMap;
