import React from "react";
import {
  Button,
  Dropdown,
  TransitionablePortal,
  Menu
} from "semantic-ui-react";

class LayersMenu extends React.Component {
  optionsConstruccion = [
    {
      key: "recent-construction",
      icon: "tree",
      text: "Construcción Reciente",
      value: "recent-construction"
    },
    { key: "roofs", icon: "tree", text: "Techos", value: "roofs" },
    { key: "pools", icon: "tree", text: "Piletas", value: "pools" },
    {
      key: "urban-sprawl",
      icon: "tree",
      text: "Mancha Urbana",
      value: "urban-sprawl"
    },
    {
      key: "informal-settlements",
      icon: "tree",
      text: "Asentamientos Informales",
      value: "informal-settlements"
    },
    {
      key: "green-areas",
      icon: "tree",
      text: "Areas Verdes",
      value: "green-areas"
    },
    { key: "streets", icon: "tree", text: "Calles", value: "streets" },
    {
      key: "nighttime",
      icon: "tree",
      text: "Imagen Nocturna",
      value: "nighttime"
    }
  ];

  optionsAgricultura = [
    {
      key: "soil",
      icon: "tree",
      text: "Área Sembrada",
      value: "soil"
    },
    {
      key: "floods",
      icon: "tree",
      text: "Área Anegada",
      value: "floods"
    },
    {
      key: "water-wheels",
      icon: "tree",
      text: "Pivotes Circulares",
      value: "water-wheels"
    },
    { key: "silobags", icon: "tree", text: "Silobolsas", value: "silobags" },
    {
      key: "ndvi",
      icon: "tree",
      text: "Índice NDVI",
      value: "ndvi"
    },
    {
      key: "evi",
      icon: "tree",
      text: "Índice EVI",
      value: "evi"
    }
  ];

  optionsDatosDemograficos = [
    {
      key: "informal-settlements",
      icon: "tree",
      text: "Asentamientos Informales",
      value: "informal-settlements"
    },
    { key: "schools", icon: "tree", text: "Escuelas", value: "schools" },
    {
      key: "hospitals",
      icon: "tree",
      text: "Hospitales",
      value: "hospitals"
    }
  ];

  _onClickLayer = (event, data) => {
    this.props.onToggleLayer(data.value);
  };

  render() {
    const { style, selectedLayers } = this.props;

    return (
      <Menu vertical style={style}>
        <Dropdown text="Construcción" pointing="left" className="link item">
          <Dropdown.Menu>
            {this.optionsConstruccion.map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Agricultura" pointing="left" className="link item">
          <Dropdown.Menu>
            {this.optionsAgricultura.map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
              />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Demográficos" pointing="left" className="link item">
          <Dropdown.Menu>
            {this.optionsDatosDemograficos.map(opts => (
              <Dropdown.Item
                {...opts}
                active={selectedLayers.includes(opts.key)}
                onClick={this._onClickLayer}
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
