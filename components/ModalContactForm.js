import React, { Component } from "react";
import { Button, Form, Modal, Header } from "semantic-ui-react";


class ContactForm extends Component {

  constructor(props) {

    super(props)
    this.state = {
      fields: {
        name: '',
        email: '',
        city: '',
        message: ''
      },
      nameError: false,
      emailError: false,
      cityError: false,
      messageError: false,
    }
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
  }

  handleOnChange(event) {
    this.setState({
      fields: {
        ...this.state.fields,
        [event.target.name]: event.target.value
      },
    })
  }


  handleOnClick() {
    let fields = ["name", "email", "city", "message"];
    for (let field of fields) {
      let errorFields = field + "Error"
      this.setState({
        [errorFields]: (this.state.fields[field] === "")
      })
    }
  }

  render() {
    return (
      <Form>
        <Form.Group widths="equal">
          <Form.Input fluid required={true} label="Nombre" placeholder="Nombre" name="name" value={this.state.fields.name} onChange={this.handleOnChange} error={this.state.nameError} />
          <Form.Input fluid required={true} label="Email" placeholder="Email" name="email" value={this.state.fields.email} onChange={this.handleOnChange} error={this.state.emailError} />
          <Form.Input fluid required={true} label="Ciudad" placeholder="Ciudad" name="city" value={this.state.fields.city} onChange={this.handleOnChange} error={this.state.cityError} />
        </Form.Group>
        <Form.TextArea required={true} label='Mensaje' placeholder="Mensaje" name="message" value={this.state.fields.message} onChange={this.handleOnChange} error={this.state.messageError} />
        <Form.Button
          onClick={this.handleOnClick}>Enviar</Form.Button>
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
