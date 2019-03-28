import { Map, TileLayer, ZoomControl, FeatureGroup } from "react-leaflet";
import GeocoderControl from "./GeocoderControl";
import DrawControl from "./DrawControl";
import { i18n } from "../../i18n";

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

class TrialMap extends React.Component {
  _onGeocoderResult = result => {
    // Fly to bounds
    const map = this.refs.map.leafletElement;
    map.flyToBounds(result.bounds);

    // Call event handler, if available
    const { onGeocoderResult } = this.props;
    if (onGeocoderResult) {
      onGeocoderResult(result);
    }
  };

  render() {
    const {
      children,
      viewport,
      featureGroupRef,
      onViewportChanged,
      onClick,
      onGeocoderSearch,
      onFeatureGroupClick,
      onDrawCreated,
      onDrawEdited,
      onDrawDeleted
    } = this.props;

    const locale = i18n.language || "es";

    return (
      <Map
        ref="map"
        style={mapContainerStyle}
        viewport={viewport}
        zoomControl={false}
        animate={true}
        onViewportChanged={onViewportChanged}
        onClick={onClick}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://mapbox.com/copyright">Mapbox</a> contributors'
          url={basemapUrl}
        />
        <ZoomControl position="topright" />
        <GeocoderControl
          accessToken={MAPBOX_TOKEN}
          onSearch={onGeocoderSearch}
          onResult={this._onGeocoderResult}
          position="topleft"
        />
        <FeatureGroup ref={featureGroupRef} onClick={onFeatureGroupClick}>
          <DrawControl
            locale={locale}
            position="topleft"
            draw={drawOptions}
            onCreated={onDrawCreated}
            onEdited={onDrawEdited}
            onDeleted={onDrawDeleted}
          />
        </FeatureGroup>

        {children}
      </Map>
    );
  }
}

export default TrialMap;
