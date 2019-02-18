import React, { Component } from "react";
import { Button, Form, Modal, Message, Header, Grid } from "semantic-ui-react";
import { AreaSection, LayersSection } from "./ConfirmationPortal";
import { buildApiUrl } from "../lib/api";
import axios from "axios";

const initialState = {
  fields: {
    name: "",
    email: "",
    city: "",
    message: ""
  },
  invalidFields: {
    name: true,
    email: true,
    city: true,
    message: false
  }
};

class ContactForm extends Component {
  state = {
    ...initialState,
    loading: false,
    success: false,
    submitedOnce: false,
    error: false
  };

  handleInputChange = event => {
    const target = event.target;
    const name = target.name;
    const isInvalid = target.checkValidity() === false;

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: target.value
      },
      invalidFields: {
        ...this.state.invalidFields,
        [name]: isInvalid
      }
    });
  };

  isInvalid() {
    for (const key in this.state.invalidFields) {
      if (this.state.invalidFields[key]) {
        return true;
      }
    }
    return false;
  }

  handleSubmit = event => {
    this.setState({ submitedOnce: true });

    if (this.isInvalid()) {
      return;
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(this.state.fields);
    }

    this.setState({ loading: true });

    // this.fakeSubmit();
    this.submit();
  };

  fakeSubmit() {
    setTimeout(() => {
      this.setState({
        ...initialState,
        loading: false,
        success: true,
        validated: false,
        submitedOnce: false,
        error: false
      });
    }, 1000);
  }

  submit() {
    const areas_geom = this.props.polygonLayers.map(layer => ({
      area_geom: layer.toGeoJSON()["geometry"]
    }));

    const params = {
      name: this.state.fields.name,
      email: this.state.fields.email,
      message: this.state.fields.message,
      areas: areas_geom,
      layers: this.props.selectedLayers,
      extra_fields: { city: this.state.fields.city },
      user: null // TODO
    };

    axios
      .post(buildApiUrl("/quotations/"), params)
      .then(() => {
        this.setState({
          ...initialState,
          success: true,
          error: false
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({
          success: false,
          error: true
        });
      })
      .then(() => {
        this.setState({
          validated: false,
          loading: false,
          submitedOnce: false
        });
      });
  }

  render() {
    return (
      <Grid>
        <Grid.Column width={12}>
          <Form
            size="large"
            success={this.state.success}
            error={this.state.error}
            loading={this.state.loading}
          >
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                label="Nombre"
                placeholder="Ingrese su nombre"
                name="name"
                value={this.state.fields.name}
                onChange={this.handleInputChange}
                error={this.state.submitedOnce && this.state.invalidFields.name}
              />
              <Form.Input
                fluid
                required
                label="Email"
                placeholder="Ingrese su dirección de e-mail"
                type="email"
                name="email"
                value={this.state.fields.email}
                onChange={this.handleInputChange}
                error={
                  this.state.submitedOnce && this.state.invalidFields.email
                }
              />
              <Form.Input
                fluid
                required
                label="Ciudad"
                placeholder="Ingrese su ciudad"
                name="city"
                value={this.state.fields.city}
                onChange={this.handleInputChange}
                error={this.state.submitedOnce && this.state.invalidFields.city}
              />
            </Form.Group>
            <Form.TextArea
              label="Mensaje"
              placeholder="Ingrese un comentario adicional"
              name="message"
              value={this.state.fields.message}
              onChange={this.handleInputChange}
              error={
                this.state.submitedOnce && this.state.invalidFields.message
              }
            />
            <Message success>
              <Message.Header>Cotización enviada</Message.Header>
              Gracias por enviar su cotización. Le escribiremos en la brevedad
              con más información.
            </Message>
            <Message error>
              <Message.Header>Error al enviar cotización</Message.Header>
              Ocurrió un error al enviar la cotización. Por favor, intente de
              nuevo o contáctese con nosotros a{" "}
              <a href="mailto:contacto@dymaxionlabs.com">
                contacto@dymaxionlabs.com
              </a>
            </Message>
            <Form.Button primary onClick={this.handleSubmit}>
              Enviar
            </Form.Button>
          </Form>
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h4">Especificaciones</Header>
          <AreaSection value={this.props.area} />
          {this.props.layers && <LayersSection layers={this.props.layers} />}
        </Grid.Column>
      </Grid>
    );
  }
}

class ModalContactForm extends Component {
  render() {
    const { onTriggerClick, onModalClose, ...contactFormProps } = this.props;

    return (
      <Modal
        trigger={
          <Button fluid primary onClick={onTriggerClick}>
            Confirmar
          </Button>
        }
        closeIcon
        onClose={onModalClose}
      >
        <Header content="Cotizar" as="h3" />
        <Modal.Content>
          <ContactForm {...contactFormProps} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalContactForm;
