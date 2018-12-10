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
        key: "construc",
        icon: "tree",
        text: "Construcción reciente",
        value: "construc"
      },
      { key: "techos", icon: "tree", text: "Techos", value: "techos" },
      { key: "piletas", icon: "tree", text: "Piletas", value: "piletas" },
      { key: "mancha", icon: "tree", text: "Mancha Urbano", value: "mancha" },
      {
        key: "asentamiento",
        icon: "tree",
        text: "Asentamiento Informales",
        value: "asentamiento"
      },
      { key: "area", icon: "tree", text: "Areas Verdes", value: "area" },
      { key: "calles", icon: "tree", text: "Calles", value: "calles" },
      { key: "imagen", icon: "tree", text: "Imagen Nocturna", value: "imagen" }
    ];

    const optionsAgricultura = [
      {
        key: "area sembrada",
        icon: "tree",
        text: "Área sembrada",
        value: "area sembrada"
      },
      {
        key: "area anegada",
        icon: "tree",
        text: "Área anegada",
        value: "area anegada"
      },
      { key: "pivotes", icon: "tree", text: "Pivotes", value: "pivotes" },
      { key: "simbolsa", icon: "tree", text: "Silobolsa", value: "simbolsa" },
      {
        key: "indice ndvi",
        icon: "tree",
        text: "Índice NDVI",
        value: "indice ndvi"
      },
      {
        key: "indice evi",
        icon: "tree",
        text: "Índice EVI",
        value: "indice evi"
      }
    ];

    const optionsDatosDemograficos = [
      {
        key: "asentamientos informales",
        icon: "tree",
        text: "Asentamientos informales",
        value: "asentamientos informales"
      },
      { key: "escuelas", icon: "tree", text: "Escuelas", value: "escuelas" },
      {
        key: "hospitales",
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

class ButtonCircule extends React.Component {
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

export default ButtonCircule;
