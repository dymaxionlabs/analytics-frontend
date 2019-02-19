import React from "react";
import {
  TransitionablePortal,
  Image,
  Segment,
  Header
} from "semantic-ui-react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";
import { withNamespaces } from "../i18n";

const Item = ({ icon, title, description }) => (
  <Header as="h4">
    <Image
      src={`/static/icons/${icon}.png`}
      style={{ float: "left", width: 20, height: 20 }}
    />
    <div style={{ paddingLeft: 30 }}>
      {title}
      <Header.Subheader>{description}</Header.Subheader>
    </div>
  </Header>
);

export const AreaSection = ({ value }) => (
  <Item
    icon="area"
    title={`${Math.ceil(value).toLocaleString()} km² / ${Math.ceil(
      value * 100
    ).toLocaleString()} ha`}
    description="tamaño de superficie"
  />
);

export const LayersSection = ({ layers }) => (
  <Item icon="layers" title={layers} description="capas seleccionadas" />
);

class ConfirmationPortal extends React.Component {
  _layersSentence() {
    const { t, selectedLayers } = this.props;
    const selLayers = selectedLayers || [];

    return allLayers
      .filter(layer => selLayers.includes(layer.key))
      .map(layer => t(layer.key + "_title"))
      .join(", ");
  }

  render() {
    const {
      open,
      area,
      selectedLayers,
      polygonLayers,
      onConfirmClick,
      onContactFormModalClose,
      onContactFormSubmit
    } = this.props;

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
            {layers && <LayersSection layers={layers} />}
            <ModalContactForm
              selectedLayers={selectedLayers}
              polygonLayers={polygonLayers}
              area={area}
              layers={layers}
              onTriggerClick={onConfirmClick}
              onModalClose={onContactFormModalClose}
              onSubmit={onContactFormSubmit}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default withNamespaces("layer_selector", "confirmation_portal")(
  ConfirmationPortal
);
