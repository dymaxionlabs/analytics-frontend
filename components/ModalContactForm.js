import React, { Component } from "react";
import { Button, Form, Modal, Header } from "semantic-ui-react";

class ContactForm extends Component {
  state = {
    fields: {
      name: "",
      email: "",
      city: "",
      message: ""
    },
    invalidFields: {
      name: false,
      email: false,
      city: false,
      message: false
    }
  };

  handleOnChange = event => {
    this.setState({
      fields: {
        ...this.state.fields,
        [event.target.name]: event.target.value
      }
    });
  };

  handleOnClick = () => {
    let fields = ["name", "email", "city", "message"];
    let invalidFields = { ...this.state.invalidFields };
    for (let field of fields) {
      invalidFields[field] = this.state.fields[field] === "";
    }
    this.setState({ invalidFields });

    // FIXME Only track event if form is valid
    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(this.state.fields);
    }
  };

  render() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            required={true}
            label="Nombre"
            placeholder="Nombre"
            name="name"
            value={this.state.fields.name}
            onChange={this.handleOnChange}
            error={this.state.invalidFields.name}
          />
          <Form.Input
            fluid
            required={true}
            label="Email"
            placeholder="Email"
            name="email"
            value={this.state.fields.email}
            onChange={this.handleOnChange}
            error={this.state.invalidFields.email}
          />
          <Form.Input
            fluid
            required={true}
            label="Ciudad"
            placeholder="Ciudad"
            name="city"
            value={this.state.fields.city}
            onChange={this.handleOnChange}
            error={this.state.invalidFields.city}
          />
        </Form.Group>
        <Form.TextArea
          required={true}
          label="Mensaje"
          placeholder="Mensaje"
          name="message"
          value={this.state.fields.message}
          onChange={this.handleOnChange}
          error={this.state.invalidFields.message}
        />
        <Form.Button onClick={this.handleOnClick}>Enviar</Form.Button>
      </Form>
    );
  }
}

class ModalContactForm extends Component {
  render() {
    const { onTriggerClick, onModalClose, onSubmit } = this.props;

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
        <Header content="Cotizar" />
        <Modal.Content>
          <ContactForm onSubmit={onSubmit} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalContactForm;
