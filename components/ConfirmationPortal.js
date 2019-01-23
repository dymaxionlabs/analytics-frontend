import React from "react";
import {
  TransitionablePortal,
  Image,
  Segment,
  Header
} from "semantic-ui-react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";

const AreaSection = ({ value }) => (
  <Header as="h4">
    <Image
      src="/static/icons/area.png"
      verticalAlign="middle"
      style={{ width: 20, height: 20, margin: 10, marginLeft: 0 }}
    />
    {Math.ceil(value)} km² / {Math.ceil(value * 100)} ha
    <Header.Subheader>tamaño de superficie</Header.Subheader>
  </Header>
);

const LayersSection = ({ children }) => (
  <Header as="h4">
    <Image
      src="/static/icons/layers.png"
      verticalAlign="middle"
      style={{ width: 20, height: 20, margin: 10, marginLeft: 0 }}
    />
    {children}
    <Header.Subheader>capas seleccionadas</Header.Subheader>
  </Header>
);

class ConfirmationPortal extends React.Component {
  _layersSentence() {
    const selectedLayers = this.props.selectedLayers || [];

    return allLayers
      .filter(layer => selectedLayers.includes(layer.key))
      .map(layer => layer.text)
      .join(", ");
  }

  render() {
    const { open, area } = this.props;
    const layers = this._layersSentence();

    return (
      <div>
        <TransitionablePortal
          open={open}
          closeOnDocumentClick={false}
          closeOnEscape={false}
          transition={{ animation: "fade left" }}
        >
          <Segment
            style={{
              position: "fixed",
              top: 40,
              right: 80,
              zIndex: 1000,
              width: 300
            }}
          >
            <AreaSection value={area} />
            {layers && <LayersSection>{layers}</LayersSection>}
            <ModalContactForm />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default ConfirmationPortal;
