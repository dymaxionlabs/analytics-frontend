import React, { Component } from "react";

import { Form, Modal, Message, Header, Grid } from "semantic-ui-react";
import { AreaSection, LayersSection } from "./ConfirmationPortal";
import { buildApiUrl } from "../../utils/api";
import { i18n, withNamespaces } from "../../i18n";
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
    const { token } = this.props;

    const areas_geom = this.props.polygonLayers.map(layer => ({
      area_geom: layer.toGeoJSON()["geometry"]
    }));

    const params = {
      name: this.state.fields.name,
      email: this.state.fields.email,
      message: this.state.fields.message,
      areas: areas_geom,
      layers: this.props.selectedLayers,
      extra_fields: { city: this.state.fields.city }
    };

    axios
      .post(buildApiUrl("/requests/"), params, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token
        }
      })
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
    const { t } = this.props;

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
                label={t("name_label")}
                placeholder={t("name_placeholder")}
                name="name"
                value={this.state.fields.name}
                onChange={this.handleInputChange}
                error={this.state.submitedOnce && this.state.invalidFields.name}
              />
              <Form.Input
                fluid
                required
                label={t("email_label")}
                placeholder={t("email_placeholder")}
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
                label={t("city_label")}
                placeholder={t("city_placeholder")}
                name="city"
                value={this.state.fields.city}
                onChange={this.handleInputChange}
                error={this.state.submitedOnce && this.state.invalidFields.city}
              />
            </Form.Group>
            <Form.TextArea
              label={t("message_label")}
              placeholder={t("message_placeholder")}
              name="message"
              value={this.state.fields.message}
              onChange={this.handleInputChange}
              error={
                this.state.submitedOnce && this.state.invalidFields.message
              }
            />
            <Message success>
              <Message.Header>{t("quote_success_title")}</Message.Header>
              {t("quote_success_desc")}
            </Message>
            <Message error>
              <Message.Header>{t("quote_error_title")}</Message.Header>
              {t("quote_error_desc", {
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
        </Grid.Column>
        <Grid.Column width={4}>
          <Header as="h4">{t("specifications")}</Header>
          <AreaSection value={this.props.area} />
          {this.props.layers && <LayersSection layers={this.props.layers} />}
        </Grid.Column>
      </Grid>
    );
  }
}

ContactForm = withNamespaces("modal_contact_form")(ContactForm);

class ModalContactForm extends Component {
  render() {
    const { t, onModalClose, trigger, ...contactFormProps } = this.props;

    return (
      <Modal trigger={trigger} onClose={onModalClose} closeIcon>
        <Header content={t("quote")} as="h3" />
        <Modal.Content>
          <ContactForm {...contactFormProps} />
        </Modal.Content>
      </Modal>
    );
  }
}

export default withNamespaces("modal_contact_form")(ModalContactForm);
