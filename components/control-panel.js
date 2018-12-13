import React from "react";
import { Button } from "semantic-ui-react";
import ModalContactForm from "./contact-modal";

class ControlPanel extends React.PureComponent {
  _layersSentence() {
    const layers = this.props.selectedLayers || [];
    return layers.join(", ");
  }

  render() {
    return (
      <div>
        <div className="separator">
          <p className="Line-control">
            <b>0.83</b> km²{" "}
          </p>
          <p className="Control Line-control">tamaño de superficie</p>
        </div>
        <div className="separator">
          <p className="Line-control">{this._layersSentence()}</p>
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

export default ControlPanel;
