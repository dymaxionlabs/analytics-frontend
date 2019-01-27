import React, { Component } from "react";
import { Button, Form, Modal, Message, Header } from "semantic-ui-react";

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
    console.log("handle submit");
    event.preventDefault();
    this.setState({ submitedOnce: true });

    if (this.isInvalid()) {
      return;
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(this.state.fields);
    }

    this.setState({ loading: true });

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
  };

  render() {
    return (
      <Form
        success={this.state.success}
        error={this.state.error}
        loading={this.state.loading}
      >
        <Message
          success
          header="Form Completed"
          content="You're all signed up for the newsletter"
        />
        <Message
          error
          header="Action Forbidden"
          content="You can only sign up for an account once with a given e-mail address."
        />
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
            error={this.state.submitedOnce && this.state.invalidFields.email}
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
          error={this.state.submitedOnce && this.state.invalidFields.message}
        />
        <Form.Button onClick={this.handleSubmit}>Enviar</Form.Button>
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
