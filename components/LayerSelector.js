import React from "react";
import {
  Button,
  Dropdown,
  Segment,
  TransitionablePortal,
  List,
  Menu,
  Icon,
  Header
} from "semantic-ui-react";

class ListDivided extends React.Component {
  render() {
    const optionsConstruccion = [
      {
        key: "recent-construction",
        icon: "tree",
        text: "Construcción Reciente",
        value: "construc"
      },
      { key: "roofs", icon: "tree", text: "Techos", value: "techos" },
      { key: "pools", icon: "tree", text: "Piletas", value: "piletas" },
      {
        key: "urban-sprawl",
        icon: "tree",
        text: "Mancha Urbana",
        value: "mancha"
      },
      {
        key: "informal-settlements",
        icon: "tree",
        text: "Asentamientos Informales",
        value: "asentamiento"
      },
      { key: "green-areas", icon: "tree", text: "Areas Verdes", value: "area" },
      { key: "streets", icon: "tree", text: "Calles", value: "calles" },
      {
        key: "nighttime",
        icon: "tree",
        text: "Imagen Nocturna",
        value: "imagen"
      }
    ];

    const optionsAgricultura = [
      {
        key: "soil",
        icon: "tree",
        text: "Área Sembrada",
        value: "area sembrada"
      },
      {
        key: "floods",
        icon: "tree",
        text: "Área Anegada",
        value: "area anegada"
      },
      {
        key: "water-wheels",
        icon: "tree",
        text: "Pivotes Circulares",
        value: "pivotes"
      },
      { key: "silobags", icon: "tree", text: "Silobolsas", value: "simbolsa" },
      {
        key: "ndvi",
        icon: "tree",
        text: "Índice NDVI",
        value: "indice ndvi"
      },
      {
        key: "evi",
        icon: "tree",
        text: "Índice EVI",
        value: "indice evi"
      }
    ];

    const optionsDatosDemograficos = [
      {
        key: "informal-settlements",
        icon: "tree",
        text: "Asentamientos Informales",
        value: "asentamientos informales"
      },
      { key: "schools", icon: "tree", text: "Escuelas", value: "escuelas" },
      {
        key: "hospitals",
        icon: "tree",
        text: "Hospitales",
        value: "hospitales"
      }
    ];

    return (
      <Menu vertical style={this.props.style}>
        <Dropdown text="Construcción" pointing="left" className="link item">
          <Dropdown.Menu>
            {optionsConstruccion.map(opts => (
              <Dropdown.Item {...opts} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Agricultura" pointing="left" className="link item">
          <Dropdown.Menu>
            {optionsAgricultura.map(opts => (
              <Dropdown.Item {...opts} />
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown text="Demográficos" pointing="left" className="link item">
          <Dropdown.Menu>
            {optionsDatosDemograficos.map(opts => (
              <Dropdown.Item {...opts} />
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
        <ListDivided
          style={{
            left: "16px",
            position: "fixed",
            bottom: "100px",
            zIndex: 1000
          }}
        />
      </TransitionablePortal>
    );
  }
}

export default LayerSelector;
