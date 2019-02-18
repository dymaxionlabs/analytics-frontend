import React from "react";
import { Button, Modal, Header, Form, Message } from "semantic-ui-react";

const initialState = {
  fields: {
    email: "",
    message: ""
  },
  invalidFields: {
    email: true,
    message: true
  }
};

class SimpleModalContactForm extends React.Component {
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

  handleClose = () => {
    this.setState({
      ...initialState,
      loading: false,
      success: false,
      submitedOnce: false,
      error: false
    });
  };

  handleSubmit = () => {
    this.setState({ submitedOnce: true });

    if (this.isInvalid()) {
      return;
    }

    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit(this.state.fields);
    }

    this.setState({ loading: true });

    this.fakeSubmit();
    // this.submit();
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
    const params = {
      email: this.state.fields.email,
      message: this.state.fields.message,
      user: null // TODO
    };

    axios
      .post(buildApiUrl("/contact/"), params)
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
    const { trigger } = this.props;
    const {
      success,
      error,
      loading,
      fields,
      invalidFields,
      submitedOnce
    } = this.state;

    return (
      <Modal trigger={trigger} onClose={this.handleClose} closeIcon>
        <Header icon="mail" content="Contáctenos" />
        <Modal.Content>
          <Form size="large" success={success} error={error} loading={loading}>
            <Form.Input
              name="email"
              label="Email"
              type="email"
              placeholder="Ingrese su dirección de e-mail"
              required
              value={fields.email}
              onChange={this.handleInputChange}
              error={submitedOnce && invalidFields.email}
            />
            <Form.TextArea
              name="message"
              label="Mensaje"
              placeholder="Ingrese su mensaje"
              required
              value={fields.message}
              onChange={this.handleInputChange}
              error={submitedOnce && invalidFields.message}
            />
            <Message success>
              <Message.Header>Mensaje enviado</Message.Header>
              Gracias por enviar su mensaje. Le escribiremos en la brevedad con
              más información.
            </Message>
            <Message error>
              <Message.Header>Error al enviar mensaje</Message.Header>
              Ocurrió un error al enviar el mensaje. Por favor, intente de nuevo
              o contáctese con nosotros a{" "}
              <a href="mailto:contacto@dymaxionlabs.com">
                contacto@dymaxionlabs.com
              </a>
            </Message>
            <Form.Button primary onClick={this.handleSubmit}>
              Enviar
            </Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default SimpleModalContactForm;
