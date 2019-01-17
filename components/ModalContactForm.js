import React, { Component } from "react";
import { Button, Form, Modal, Header, Message } from "semantic-ui-react";


class ContactForm extends Component {

  constructor(props) {

    super(props)
    this.state = {
      name: '',
      email: '',
      city: '',
      message: '',
      formError: false,
      nameError: false,
      emailError: false,
      cityError: false,
      messageError: false,
    }
  }


  updateName(event) {
    this.setState({
      name: event.target.value

    });
  }


  updateEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  updateCity(event) {
    this.setState({
      city: event.target.value
    });
  }

  updateMessage(event) {
    this.setState({
      message: event.target.value
    });
  }



  validate(event) {
    this.setState({
      isActive: event.target.checked

    })
  }

  handleOnClick() {

    if (this.state.name === '') {
      this.setState({ nameError: true })
    } else {
      this.setState({ nameError: false })
    }

    if (this.state.email === '') {
      this.setState({ emailError: true })
    } else {
      this.setState({ emailError: false })
    }

    if (this.state.city === '') {
      this.setState({ cityError: true })
    } else {
      this.setState({ cityError: false })
    }

    if (this.state.message === '') {
      this.setState({ messageError: true })
    } else {
      this.setState({ messageError: false })
    }

  }

  render() {
    return (
      <Form error={this.state.formError}>
        <Form.Group widths="equal">
          <Form.Input fluid required={true} label="Nombre" placeholder="Nombre" value={this.state.name} onChange={(this.updateName.bind(this))} error={this.state.nameError} />
          <Form.Input fluid required={true} label="Email" placeholder="Email" value={this.state.email} onChange={(this.updateEmail.bind(this))} error={this.state.emailError} />
          <Form.Input fluid required={true} label="Ciudad" placeholder="Ciudad" value={this.state.city} onChange={(this.updateCity.bind(this))} error={this.state.cityError} />
        </Form.Group>
        <Form.TextArea required={true} label='Mensaje' placeholder="Mensaje" value={this.state.message} onChange={(this.updateMessage.bind(this))} error={this.state.messageError} />
        <Form.Button
          onClick={this.handleOnClick.bind(this)}>Enviar</Form.Button>
      </Form>
    );
  }
}

class ModalContactForm extends Component {
  render() {
    return (
      <Modal
        trigger={
          <Button floated="left" hoverable>
            Confirmar
          </Button>
        }
        closeIcon>
        <Header content="Cotizar Imagenes" />
        <Modal.Content>
          <ContactForm />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalContactForm;
