import React from "react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";

const style = {
  position: "absolute",
  right: 40,
  top: 80,
  background: "#fff",
  padding: "12px 24px",
  width: "300px",
  zIndex: 1000,

};

class ConfirmationPortal extends React.Component {
  _layersSentence() {
    const selectedLayers = this.props.selectedLayers || [];
    return allLayers
      .filter(layer => selectedLayers.includes(layer.key))
      .map(layer => layer.text)
      .join(", ");
  }

  render() {
    const { area } = this.props;

    return (
      <div style={style}>
        <div className="separator">
          <p className="Line-control">
            <b>{area}</b> km²{" "}
          </p>
          <p className="Control Line-control">tamaño de superficie</p>
        </div>
        <div className="separator">
          <p className="Line-control">{this._layersSentence()}</p>
          <p className="Control Line-control">capas seleccionadas</p>
        </div>
        <ModalContactForm />
      </div>
    );
  }
}

export default ConfirmationPortal;
