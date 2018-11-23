import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import MapboxGeocoder from 'mapbox-geocoder'

class Geocoder extends Component {
  static contextTypes = {
    map: PropTypes.object.isRequired,
  };

  static defaultProps = {
    position: 'top-left',
  }

  static propTypes = {
    position: PropTypes.string,
  }

  componentWillMount() {
    const {
      position
    } = this.props

    const {
      map
    } = this.context

    this.geocoder = new MapboxGeocoder({})

    map.addControl(this.geocoder, position)
  }

  componentWillUnmount() {
    const {
      map
    } = this.context

    if (!map || !map.getStyle()) {
      return
    }

    map.removeControl(this.draw)
  }

  render() {
    return null
  }
}

export default Geocoder