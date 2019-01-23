import React from "react";
import {
  Button,
  TransitionablePortal,
  Segment,
  List,
  Image
} from "semantic-ui-react";

export const allLayers = [
  {
    key: "recent-construction",
    image: "/static/icons/recent.png",
    text: "Construcción Reciente",
    description: "Casas y edificios recientemente construidos.",
    value: "recent-construction",
    categories: ["construction"]
  },
  {
    key: "roofs",
    image: "/static/icons/roofs.png",
    text: "Techos",
    description: "Techos de casas y edificios.",
    value: "roofs",
    categories: ["construction"]
  },
  {
    key: "pools",
    image: "/static/icons/pools.png",
    text: "Piletas",
    description: "Piscinas residenciales y pequeñas piletas",
    value: "pools",
    categories: ["construction"]
  },
  {
    key: "informal-settlements",
    image: "/static/icons/slums.png",
    text: "Asentamientos Informales",
    description: "Barrios precarios y asentamientos informales",
    value: "informal-settlements",
    categories: ["demographic"]
  },
  {
    key: "soil",
    image: "/static/icons/soil.png",
    text: "Área Sembrada",
    description: "Suelo utilizado para siembra y cultivo.",
    value: "soil",
    categories: ["agri"]
  },
  {
    key: "floods",
    image: "/static/icons/flood.png",
    text: "Área Inundada y Anegada",
    description: "Suelo que se encuentra inundado y/o presenta anegamiento",
    value: "floods",
    categories: ["agri"]
  },
  {
    key: "ndvi",
    image: "/static/icons/vi.png",
    text: "Índice NDVI",
    description: "Índice que indica áreas con vegetación",
    value: "ndvi",
    categories: ["agri"]
  },
  {
    key: "schools",
    image: "/static/icons/schools.png",
    text: "Escuelas",
    description: "Escuelas y otros asentamientos educativos.",
    value: "schools",
    categories: ["demographic"]
  },
  {
    key: "hospitals",
    image: "/static/icons/hospitals.png",
    text: "Hospitales",
    description: "Hospitales y clínicas.",
    value: "hospitals",
    categories: ["demographic"]
  }
];

class LayersMenu extends React.Component {
  _onClickLayer = (_event, data) => {
    this.props.onToggleLayer(data.value);
  };

  _layersByCategory(categoryId) {
    return allLayers.filter(layer => layer.categories.includes(categoryId));
  }

  render() {
    const { selectedLayers } = this.props;

    return (
      <List divided relaxed style={{ width: 300 }}>
        {allLayers.map(opts => (
          <List.Item
            active={selectedLayers.includes(opts.key)}
            onClick={this._onClickLayer}
            key={opts.key}
          >
            {opts.image ? (
              <Image src={opts.image} width={24} height={24} />
            ) : (
              <List.Icon
                name={opts.icon}
                size="large"
                verticalAlign="middle"
                inline="true"
              />
            )}
            <List.Content>
              <List.Header as="a">{opts.text}</List.Header>
              <List.Description as="a">{opts.description}</List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}

class LayerSelector extends React.Component {
  state = { open: false };

  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  render() {
    const { onToggleLayer, selectedLayers } = this.props;

    return (
      <div style={{ position: "absolute", bottom: 0, left: 10, zIndex: 1000 }}>
        <TransitionablePortal
          closeOnTriggerClick
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          openOnTriggerClick
          transition={{ animation: "fade up" }}
          trigger={
            <Button
              className="controlButton"
              circular
              icon="osi"
              size="massive"
              color="blue"
            />
          }
        >
          <Segment
            style={{
              position: "fixed",
              left: 20,
              bottom: 110,
              zIndex: 1000,
              overflow: "auto",
              maxHeight: 300
            }}
          >
            <LayersMenu
              onToggleLayer={onToggleLayer}
              selectedLayers={selectedLayers}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default LayerSelector;
