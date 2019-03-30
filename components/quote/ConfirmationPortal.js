import React from "react";

import {
  Button,
  TransitionablePortal,
  Image,
  Segment,
  Header
} from "semantic-ui-react";
import ModalContactForm from "./ModalContactForm";
import { allLayers } from "./LayerSelector";
import { withNamespaces } from "../../i18n";

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

export const AreaSection = withNamespaces("confirmation_portal")(
  ({ t, value }) => (
    <Item
      icon="area"
      title={`${Math.ceil(value).toLocaleString()} km² / ${Math.ceil(
        value * 100
      ).toLocaleString()} ha`}
      description={t("surface_area")}
    />
  )
);

export const LayersSection = withNamespaces([
  "confirmation_portal",
  "layer_selector"
])(({ t, layers }) => {
  return (
    <Item
      icon="layers"
      title={layers
        .map(layer => t(`layer_selector:${layer.key}_title`))
        .join(", ")}
      description={t("selected_layers")}
    />
  );
});

class ConfirmationPortal extends React.Component {
  render() {
    const {
      t,
      token,
      open,
      area,
      selectedLayers,
      polygonLayers,
      onConfirmClick,
      onContactFormModalClose,
      onContactFormSubmit
    } = this.props;

    const selLayers = selectedLayers || [];
    const layers = allLayers.filter(layer => selLayers.includes(layer.key));

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
              token={token}
              trigger={
                <Button fluid primary onClick={onConfirmClick}>
                  {t("confirm")}
                </Button>
              }
              selectedLayers={selectedLayers}
              polygonLayers={polygonLayers}
              area={area}
              layers={layers}
              onModalClose={onContactFormModalClose}
              onSubmit={onContactFormSubmit}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default withNamespaces("confirmation_portal")(ConfirmationPortal);
