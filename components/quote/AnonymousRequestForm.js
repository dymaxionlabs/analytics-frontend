import axios from "axios";
import React from "react";
import { Form, Grid, Header, Message } from "semantic-ui-react";
import { i18n, withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { AreaSection, LayersSection } from "./ConfirmationPortal";

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

class AnonymousRequestForm extends React.Component {
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

    this.submit();
  };

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
        headers: { "Accept-Language": i18n.language }
      })
      .then(() => {
        this.setState({
          ...initialState,
          success: true,
          error: false
        });
      })
      .catch(error => {
        console.error(error);
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
    const { t, area, layers } = this.props;
    const {
      success,
      error,
      loading,
      submitedOnce,
      fields,
      invalidFields
    } = this.state;

    return (
      <Grid>
        <Grid.Column width={12}>
          <Form size="large" success={success} error={error} loading={loading}>
            <Form.Group widths="equal">
              <Form.Input
                fluid
                required
                label={t("name_label")}
                placeholder={t("name_placeholder")}
                name="name"
                value={fields.name}
                onChange={this.handleInputChange}
                error={submitedOnce && invalidFields.name}
              />
              <Form.Input
                fluid
                required
                label={t("email_label")}
                placeholder={t("email_placeholder")}
                type="email"
                name="email"
                value={fields.email}
                onChange={this.handleInputChange}
                error={submitedOnce && invalidFields.email}
              />
              <Form.Input
                fluid
                required
                label={t("city_label")}
                placeholder={t("city_placeholder")}
                name="city"
                value={fields.city}
                onChange={this.handleInputChange}
                error={submitedOnce && invalidFields.city}
              />
            </Form.Group>
            <Form.TextArea
              label={t("message_label")}
              placeholder={t("message_placeholder")}
              name="message"
              value={fields.message}
              onChange={this.handleInputChange}
              error={submitedOnce && invalidFields.message}
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
          <AreaSection value={area} />
          {layers && <LayersSection layers={layers} />}
        </Grid.Column>
      </Grid>
    );
  }
}

AnonymousRequestForm = withNamespaces("modal_contact_form")(
  AnonymousRequestForm
);

export default AnonymousRequestForm;
