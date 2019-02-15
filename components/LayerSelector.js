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
    text: "Nuevas Edificaciones",
    description: "Nuevas construcciones para un período de tiempo",
    value: "recent-construction",
    categories: ["construction"]
  },
  {
    key: "roofs",
    image: "/static/icons/roofs.png",
    text: "Techos",
    description: "Contorno de techos de edificaciones",
    value: "roofs",
    categories: ["construction"]
  },
  {
    key: "pools",
    image: "/static/icons/pools.png",
    text: "Piletas",
    description: "Contorno de piscinas residenciales",
    value: "pools",
    categories: ["construction"]
  },
  {
    key: "informal-settlements",
    image: "/static/icons/slums.png",
    text: "Asentamientos Informales",
    description: "Asentamientos y barrios populares",
    value: "informal-settlements",
    categories: ["demographic"]
  },
  {
    key: "roads",
    image: "/static/icons/roads.png",
    text: "Rutas",
    description: "Rutas y caminos asfaltados",
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
    description: "Áreas rurales que se encuentran inundadas y anegadas",
    value: "floods",
    categories: ["agri"]
  },
  {
    key: "true-color",
    image: "/static/icons/sat.png",
    text: "Color verdadero",
    description: "Imagen satelital de color verdadero",
    value: "true-color",
    categories: []
  },
  {
    key: "ndvi",
    image: "/static/icons/vi.png",
    text: "Índice NDVI",
    description: "Índice de vigor de cultivo",
    value: "ndvi",
    categories: ["agri"]
  },
  {
    key: "lots",
    image: "/static/icons/soil.png",
    text: "Lotes de cultivo",
    description: "Lotes categorizados por tipo de cultivo",
    value: "lots",
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
    const { selectedLayers, availableLayers } = this.props;

    return (
      <div>
        <List selection relaxed>
          {availableLayers.map(opts => (
            <List.Item
              active={selectedLayers.includes(opts.key)}
              key={opts.key}
              onClick={e => this._onClickLayer(e, opts.key)}
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
        <style jsx global>{`
          .ui.selection.list {
            width: 300px;
          }

          .ui.selection.list > .item {
            padding: 16px 16px;
            border-radius: 0;
          }

          .ui.selection.list.list > .item:hover,
          .ui.selection.list > .item:hover {
            background: rgba(0, 0, 0, 0.06);
          }

          .ui.selection.list > .item.active {
            background: rgba(0, 0, 0, 0.12);
          }

          .ui.list .list > .item .description,
          .ui.list > .item .description {
            color: #000;
          }

          .ui.list .list > .item a.header,
          .ui.list > .item a.header {
            font-size: 16px;
            color: #000 !important;
            margin-bottom: 5px;
          }

          .ui.list .list > .item:hover a.header,
          .ui.list > .item:hover a.header {
            color: #000 !important;
          }
        `}</style>
      </div>
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
    const { availableLayers, selectedLayers } = this.props;
    const { open } = this.state;

    // If availableLayers exists, filter all layers with it
    const layers = availableLayers
      ? allLayers.filter(layer => availableLayers.includes(layer.key))
      : allLayers;
    console.log(layers.map(layer => layer.key));

    return (
      <div style={{ position: "absolute", bottom: -5, left: 10, zIndex: 1000 }}>
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
              bottom: 105,
              zIndex: 1000,
              overflow: "auto",
              maxHeight: 300,
              padding: 0
            }}
          >
            <LayersMenu
              onToggleLayer={this.handleToggleLayer}
              availableLayers={layers}
              selectedLayers={selectedLayers}
            />
          </Segment>
        </TransitionablePortal>
      </div>
    );
  }
}

export default LayerSelector;
