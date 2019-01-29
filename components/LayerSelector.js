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
    description: "Casas y edificios recientemente construidos",
    value: "recent-construction",
    categories: ["construction"]
  },
  {
    key: "roofs",
    image: "/static/icons/roofs.png",
    text: "Techos",
    description: "Techos de casas y edificios",
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
    key: "roads",
    image: "/static/icons/roads.png",
    text: "Rutas",
    description: "Caminos y carreteras asfaltadas",
    value: "roads",
    categories: ["demographic"]
  },
  {
    key: "soil",
    image: "/static/icons/soil.png",
    text: "Área Sembrada",
    description: "Suelo utilizado para siembra y cultivo",
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
  }
];

class LayersMenu extends React.Component {
  _onClickLayer = (_event, layerKey) => {
    this.props.onToggleLayer(layerKey);
  };

  _layersByCategory(categoryId) {
    return allLayers.filter(layer => layer.categories.includes(categoryId));
  }

  render() {
    const { selectedLayers } = this.props;

    return (
      <List selection relaxed style={{ width: 300 }}>
        {allLayers.map(opts => (
          <List.Item
            active={selectedLayers.includes(opts.key)}
            key={opts.key}
            onClick={e => this._onClickLayer(e, opts.key)}
            style={{ padding: 7 }}
          >
            <Image
              avatar
              src={opts.image}
              width={28}
              height={28}
              style={{ margin: "7px 9px 7px 0px" }}
            />
            <List.Content style={{ width: "85%" }}>
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

  handleToggleLayer = (event, layerKey) => {
    // FIXME Should close automatically if there is 0 or 1 selected layers only
    this.setState({ open: false });

    const { onToggleLayer } = this.props;
    if (onToggleLayer) {
      onToggleLayer(event, layerKey);
    }
  };

  render() {
    const { selectedLayers } = this.props;
    const { open } = this.state;

    return (
      <div style={{ position: "absolute", bottom: 0, left: 10, zIndex: 1000 }}>
        <TransitionablePortal
          closeOnTriggerClick
          open={open}
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
              onToggleLayer={this.handleToggleLayer}
              selectedLayers={selectedLayers}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default LayerSelector;
