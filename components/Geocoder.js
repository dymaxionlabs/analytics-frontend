import React from 'react'
import PropTypes from 'prop-types'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

class Geocoder extends React.Component {
  static defaultProps = {
    position: 'top-left',
    onClear: () => { },
    onLoading: () => { },
    onResults: () => { },
    onResult: () => { },
    onError: () => { },
  }

  static propTypes = {
    mapRef: PropTypes.object.isRequired,
    accessToken: PropTypes.string.isRequired,
    position: PropTypes.string,
    onClear: PropTypes.func,
    onLoading: PropTypes.func,
    onResults: PropTypes.func,
    onResult: PropTypes.func,
    onError: PropTypes.func,
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
    this.geocoder.on('clear', this.props.onClear)
    this.geocoder.on('loading', this.props.onLoading)
    this.geocoder.on('results', this.props.onResults)
    this.geocoder.on('result', this.props.onResult)
    this.geocoder.on('error', this.props.onError)

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