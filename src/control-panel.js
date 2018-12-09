import React from 'react';
import { Button } from 'semantic-ui-react'
import ModalContactForm from "../src/contact-modal"
import 'semantic-ui-css/semantic.min.css'

class ControlPanel extends React.PureComponent {

  render() {
    return (
      <div >
        <div className="separator">
          <p className="Line-control"><b>0.83</b> km² </p>
          <p className="Control Line-control">tamaño de superficie</p>
        </div>
        <div className="separator">
          <p className="Line-control">Cars, Ships, Boats</p>
          <p className="Control Line-control">capas seleccionadas</p>
        </div>
        <div>
          <Button primary>Cancelar</Button>
          <ModalContactForm />
        </div>
      </div>
    );
  }
}

export default ControlPanel
