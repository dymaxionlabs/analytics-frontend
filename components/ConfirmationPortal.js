import React from "react";
import { Segment, Header } from "semantic-ui-react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";

const AreaSection = ({ value }) => (
  <Header as="h4">
    {Math.round(value)} km²
    <Header.Subheader>tamaño de superficie</Header.Subheader>
  </Header>
);

const LayersSection = ({ children }) => (
  <Header as="h4">
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
    const { area } = this.props;
    const layers = this._layersSentence();

    return (
      <div className="confirmation-portal">
        <Segment>
          <AreaSection value={area} />
          {layers && <LayersSection>{layers}</LayersSection>}
        </Segment>
        <ModalContactForm />

        <style jsx>{`
          .confirmation-portal {
            background-color: #fff;
            padding: 10px;
            box-shadow: 0px 2px 4px 0px rgba(34, 36, 38, 0.12),
              0px 2px 10px 0px rgba(34, 36, 38, 0.15);
            border-radius: 4px;
            position: absolute;
            right: 80px;
            top: 50px;
            width: 300px;
            z-index: 1000;
          }
        `}</style>
      </div>
    );
  }
}

export default ConfirmationPortal;
