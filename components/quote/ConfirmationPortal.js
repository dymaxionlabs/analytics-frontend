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
  "common"
])(({ t, layers }) => {
  return (
    <Item
      icon="layers"
      title={layers
        .map(layer => t(`common:${layer.key}_title`))
        .join(", ")}
      description={t("selected_layers")}
    />
  );
});

export let PriceSection = ({ t, price }) => (
  <Item icon="price" title={`U$S ${price}`} description={t("price")} />
);

PriceSection = withNamespaces(["confirmation_portal", "common"])(
  PriceSection
);

class ConfirmationPortal extends React.Component {
  calculatePrice() {
    const { area } = this.props;
    return Math.round(area * 10);
  }

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

    const price = this.calculatePrice();
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
              price={price}
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
