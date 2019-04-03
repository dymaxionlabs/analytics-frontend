import axios from "axios";
import React from "react";
import {
  Checkbox,
  Form,
  Grid,
  Header,
  Image,
  List,
  Message
} from "semantic-ui-react";
import { i18n, withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { AreaSection, LayersSection, PriceSection } from "./ConfirmationPortal";

class RequestForm extends React.Component {
  state = {
    loading: false,
    success: false,
    error: false,
    onlyRequest: false
  };

  handleOnlyRequestChange = () => {
    this.setState({ onlyRequest: !this.state.onlyRequest });
  };

  handleSubmit = () => {
    this.setState({ submitedOnce: true });

    const { onSubmit } = this.props;
    if (onSubmit) {
      onSubmit();
    }

    this.setState({ loading: true });

    this.submit();
  };

  submit() {
    const { token } = this.props;
    const { onlyRequest } = this.state;

    const areas_geom = this.props.polygonLayers.map(layer => ({
      area_geom: layer.toGeoJSON()["geometry"]
    }));

    const params = {
      areas: areas_geom,
      layers: this.props.selectedLayers
    };

    const apiPath = onlyRequest ? "/requests/?only_request=1" : "/requests/";

    axios
      .post(buildApiUrl(apiPath), params, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token
        }
      })
      .then(response => {
        console.log(response);
        this.setState({
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
    const { t, area, layers, price } = this.props;
    const { onlyRequest, success, error, loading } = this.state;

    return (
      <Grid>
        <Grid.Column width={4}>
          <Header as="h4">{t("specifications")}</Header>
          <AreaSection value={area} />
          {layers && <LayersSection layers={layers} />}
          <PriceSection price={price} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Form success={success} error={error} loading={loading}>
            <List>
              {layers.map(layer => (
                <List.Item key={layer.key} style={{ marginBottom: "1em" }}>
                  <Image
                    avatar
                    src={layer.image}
                    width={28}
                    height={28}
                    style={{ margin: "7px 9px 7px 0px" }}
                  />
                  <List.Content style={{ width: "90%" }}>
                    <List.Header>
                      {t(`layer_selector:${layer.key}_title`)}
                    </List.Header>
                    <List.Description>
                      {t(`layer_selector:${layer.key}_desc_long`)}
                      {layer.categories.map(category => (
                        <Message
                          key={category}
                          size="small"
                          info
                          style={{ marginTop: "0.5em" }}
                        >
                          <p>{t(`layer_info.${category}`)}</p>
                        </Message>
                      ))}
                    </List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
            <Form.Field>
              <Checkbox
                label={t("only_request_checkbox")}
                checked={onlyRequest}
                onChange={this.handleOnlyRequestChange}
              />
            </Form.Field>
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
            <Form.Group>
              <Form.Button primary onClick={this.handleSubmit}>
                {onlyRequest ? t("request_btn") : t("pay_btn")}
              </Form.Button>
              {!onlyRequest && (
                <img
                  src="/static/icons/mercadopago.png"
                  height={25}
                  style={{ margin: "5px 0px" }}
                />
              )}
            </Form.Group>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

RequestForm = withNamespaces(["modal_contact_form", "layer_selector"])(
  RequestForm
);

export default RequestForm;
