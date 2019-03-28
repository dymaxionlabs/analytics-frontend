import React from "react";
import { withNamespaces } from "../../i18n";
import { Modal, Header, Form, Message } from "semantic-ui-react";
import { buildApiUrl } from "../../utils/api";
import axios from "axios";

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

    //this.fakeSubmit();
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
    const params = {
      email: this.state.fields.email,
      message: this.state.fields.message
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
    const { t, trigger } = this.props;
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
        <Header icon="mail" content={t("header")} />
        <Modal.Content>
          <Form size="large" success={success} error={error} loading={loading}>
            <Form.Input
              name="email"
              label={t("email_label")}
              type="email"
              placeholder={t("email_placeholder")}
              required
              value={fields.email}
              onChange={this.handleInputChange}
              error={submitedOnce && invalidFields.email}
            />
            <Form.TextArea
              name="message"
              label={t("message_label")}
              placeholder={t("message_placeholder")}
              required
              value={fields.message}
              onChange={this.handleInputChange}
              error={submitedOnce && invalidFields.message}
            />
            <Message success>
              <Message.Header>{t("contact_success_title")}</Message.Header>
              {t("contact_success_desc")}
            </Message>
            <Message error>
              <Message.Header>{t("contact_error_title")}</Message.Header>
              {t("contact_error_desc", {
                contactEmail: (
                  <a href="mailto:contacto@dymaxionlabs.com">
                    contacto@dymaxionlabs.com
                  </a>
                )
              })}
            </Message>
            <Form.Button primary onClick={this.handleSubmit}>
              {t("send")}
            </Form.Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

export default withNamespaces("simple_modal_contact_form")(
  SimpleModalContactForm
);
