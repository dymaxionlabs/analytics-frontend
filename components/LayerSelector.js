import React from "react";
import {
  Button,
  Dropdown,
  TransitionablePortal,
  Menu
} from "semantic-ui-react";

const dropdownItemStyle = {
  width: 250
};

export const allLayers = [
  {
    key: "recent-construction",
    image: { src: "/static/icons/recent-construction.svg" },
    text: "Construcción Reciente",
    value: "recent-construction",
    categories: ["construction"]
  },
  {
    key: "roofs",
    image: { src: "/static/icons/roofs.svg" },
    text: "Techos",
    value: "roofs",
    categories: ["construction"]
  },
  {
    key: "pools",
    image: { src: "/static/icons/pools.svg" },
    text: "Piletas",
    value: "pools",
    categories: ["construction"]
  },
  {
    key: "informal-settlements",
    icon: "tree",
    text: "Asentamientos Informales",
    value: "informal-settlements",
    categories: ["demographic"]
  },
  {
    key: "soil",
    icon: "tree",
    text: "Área Sembrada",
    value: "soil",
    categories: ["agri"]
  },
  {
    key: "floods",
    icon: "tree",
    text: "Área Anegada",
    value: "floods",
    categories: ["agri"]
  },
  {
    key: "ndvi",
    icon: "tree",
    text: "Índice NDVI",
    value: "ndvi",
    categories: ["agri"]
  },
  {
    key: "schools",
    icon: "tree",
    text: "Escuelas",
    value: "schools",
    categories: ["demographic"]
  },
  {
    key: "hospitals",
    icon: "tree",
    text: "Hospitales",
    value: "hospitals",
    categories: ["demographic"]
  }
];

class LayersMenu extends React.Component {
  _onClickLayer = (event, data) => {
    this.props.onToggleLayer(data.value);
  };

  _layersByCategory(categoryId) {
    return allLayers.filter(layer => layer.categories.includes(categoryId));
  }

  render() {
    const { style, selectedLayers } = this.props;

    return (
      <Menu vertical style={style}>
        <Dropdown text="Construcción" pointing="left" className="link item">
          <Dropdown.Menu>
            {this._layersByCategory("construction").map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
                style={dropdownItemStyle}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Agricultura" pointing="left" className="link item">
          <Dropdown.Menu>
            {this._layersByCategory("agri").map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
                style={dropdownItemStyle}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Demográficos" pointing="left" className="link item">
          <Dropdown.Menu>
            {this._layersByCategory("demographic").map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
                style={dropdownItemStyle}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
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
      <TransitionablePortal
        closeOnTriggerClick
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        openOnTriggerClick
        trigger={
          <Button
            className="controlButton"
            style={{ zIndex: 1000 }}
            circular
            icon="osi"
            size="massive"
            color="blue"
          />
        }
      >
        <LayersMenu
          style={{
            left: "16px",
            position: "fixed",
            bottom: "100px",
            zIndex: 1000
          }}
          onToggleLayer={onToggleLayer}
          selectedLayers={selectedLayers}
        />
      </TransitionablePortal>
    );
  }
}

export default LayerSelector;
