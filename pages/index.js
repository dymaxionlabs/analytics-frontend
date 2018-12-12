import '../static/index.css' // FIXME Convert to JSX styles
import '../static/App.css' // FIXME Convert to JSX styles
import 'semantic-ui-css/semantic.css' // FIXME Move this Layout

import React from 'react'
import dynamic from 'next/dynamic'
import { Dimmer, Loader } from 'semantic-ui-react'

// Dynamically load TrialMap component as it only works on browser
const Map = dynamic(() => import('../components/TrialMap'), {
  ssr: false,
  loading: () => (
    <Dimmer active>
      <Loader size='big'>Cargando</Loader>
    </Dimmer>
  )
});

import ControlPanel from '../components/control-panel'
import ButtonCircule from '../components/button'
import Guide from '../components/guide'


class Index extends React.Component {
  state = {
    center: [-58.373219, -34.609032],
    zoom: [7],
    isActive: false,
    step: {
      "initial": "Escriba una ciudad o busque en el mapa un lugar",
      "search_done": "Dibuje un polígono del área que desea analizar",
      "polygon_drawn": "Seleccione una o más capas de análisis",
      "layer_selected": "Si está de acuerdo con la selección, haga clic en Confirmar",
    },

  }

  mapRef = React.createRef()
  geoRef = React.createRef()
  buttonRef = React.createRef()
  drawRef = React.createRef()

  _onGeocoderResult = () => {
    this.setState({ isActive: true })
  }


  render() {
    let controlPanel = null
    if (this.state.isActive === true) {
      controlPanel =
        <div style={{ position: 'absolute', right: 0, top: 100, background: '#fff', margin: '24px', padding: '12px 24px', }}>
          <ControlPanel mapRef={this.mapRef} />
        </div>
    }

    return (
      <Map
        center={this.state.center}
        zoom={this.state.zoom}
        mapRef={this.mapRef}
        geocoderRef={this.geoRef}
        drawRef={this.drawRef}
        onGeocoderResult={this._onGeocoderResult}
      >
        <Guide
          step={this.state.step.initial}

        />

        <ButtonCircule
          ref={this.buttonRef}
        />
        {controlPanel}
      </Map>
    )
  }
}

export default Index
