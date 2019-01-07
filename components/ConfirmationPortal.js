import React from "react";
import { Button } from "semantic-ui-react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";

const style = {
  position: "absolute",
  right: 80,
  top: 40,
  background: "#fff",
  padding: "12px 24px",
  zIndex: 1000
};

class ConfirmationPortal extends React.PureComponent {
  _layersSentence() {
    const selectedLayers = this.props.selectedLayers || [];
    return allLayers
      .filter(layer => selectedLayers.includes(layer.key))
      .map(layer => layer.text)
      .join(", ");
  }

  render() {
    return (
      <div style={style}>
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

export default ConfirmationPortal;
