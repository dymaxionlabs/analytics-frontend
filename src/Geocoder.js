import React from 'react'
import PropTypes from 'prop-types'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

class Geocoder extends React.Component {
  static defaultProps = {
    position: 'top-left',
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
    position: PropTypes.string,
  }

  componentWillMount() {
    const {
      accessToken,
      mapRef,
      position,
    } = this.props

    const map = mapRef.current.state.map

    this.geocoder = new MapboxGeocoder({
      accessToken: accessToken,
    })

    map.addControl(this.geocoder, position)
  }

  componentWillUnmount() {
    const {
      mapRef,
    } = this.props

    const map = mapRef.current.state.map

    if (!map || !map.getStyle()) {
      return
    }

    map.removeControl(this.geocoder)
  }

  render() {
    return null
  }
}

export default Geocoder