import { MapControl, withLeaflet } from "react-leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

class GeocoderControl extends MapControl {
  createLeafletElement(props) {
    const { accessToken } = props;
    const geocoder = L.Control.Geocoder.mapbox(accessToken);
    return L.Control.geocoder({
      geocoder: geocoder,
      defaultMarkGeocode: false,
      ...props
    });
  }

  componentDidMount() {
    const { map } = this.props.leaflet;
    this.leafletElement
      .addTo(map)
      .on("markgeocode", result => this._onMarkGeocode(result));
  }

  componentWillUnmount() {
    const { map } = this.props.leaflet;
    map.removeControl(this.leafletElement);
  }

  render() {
    return null;
  }

  _onMarkGeocode(result) {
    const { map } = this.props.leaflet;
    const { onResult } = this.props;

    result = result.geocode || result;
    map.fitBounds(result.bbox);

    if (onResult) onResult(result);
  }
}

export default withLeaflet(GeocoderControl);
