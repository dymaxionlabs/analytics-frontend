import React from 'react';
import { Button } from 'semantic-ui-react'
import ModalContactForm from "../src/contact-modal"
import 'semantic-ui-css/semantic.min.css'

class ControlPanel extends React.PureComponent {

  render() {
    return (
      <div >
        <div className="separator">
          <p className="Line-control">0.83km^2 </p>
          <p className="Control Line-control"> area size </p>
        </div>
        <div className="separator">
          <p className="Line-control">Cars, Ships, Boats</p>
          <p className="Control Line-control"> selected analyses</p>
        </div>
        <div>
          <Button primary>cancelar</Button>
          <ModalContactForm />
        </div>
      </div>

    );
  }
}

export default ControlPanel
