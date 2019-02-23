import React from "react";
import { withNamespaces, Link } from "../i18n";
import { login } from "../utils/auth";
import { Checkbox, Form, Icon, Button, Header, Image } from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.css";
import logo from "../static/logo.png";
import { buildApiUrl } from "../utils/api";

class Login extends React.Component {
  state = {
    user: "",
    password: "",
    remember: false,
    errorMsg: "",
    successMsg: ""
  };

  static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"]
    };
  }

  handleError = () => {
    const { t } = this.props;

    this.setState({
      errorMsg: t("login.error_msg"),
      successMsg: ""
    });
  };

  onUserChange = e => {
    this.setState({ user: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onRememberClick = e => {
    this.setState({ remember: !this.state.remember });
  };

  onSubmit = () => {
    const { t } = this.props;
    const { user, password } = this.state;

    const dataSend = {
      username: user,
      password: password
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: ""
    });

    axios
      .post(buildApiUrl("/auth/login/"), dataSend)
      .then(response => {
        const res = JSON.stringify(response.data);
        const token = res["key"];
        const expires = this.state.remember ? 30 : null;

        this.setState({
          successMsg: t("login.success_msg"),
          errorMsg: ""
        });

        login({ token, expires });
      })
      .catch(this.handleError);
  };

  render() {
    const { t } = this.props;

    return (
      <div className="container">
        <Header
          as="h1"
          textAlign="center"
          style={{ color: "#f05f40", paddingTop: 100 }}
        >
          <Image src={logo} />
          <br />
          {t("login.title")}
        </Header>
        <div
          className="ui raised very padded text container segment"
          style={{ marginTop: 20, width: 400 + "px" }}
        >
          <Form>
            <Form.Field>
              <Form.Input
                fluid
                iconPosition="left"
                icon="user"
                placeholder={t("username")}
                onChange={this.onUserChange}
                value={this.state.user}
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                fluid
                iconPosition="left"
                icon="key"
                type="password"
                placeholder={t("password")}
                onChange={this.onPasswordChange}
                value={this.state.password}
              />
            </Form.Field>
            <br />
            <Checkbox
              checked={this.state.remember}
              onClick={this.onRememberClick}
              label={t("login.remember")}
            />
            <br />
            <br />

            <Button
              fluid
              icon
              onClick={this.onSubmit}
              labelPosition="right"
              color="orange"
            >
              {t("login.submit")} <Icon name="right arrow" />
            </Button>

            <div
              style={{ textAlign: "left", color: "#990000", paddingTop: 20 }}
            >
              <span>{this.state.errorMsg}</span>
            </div>
            <div
              style={{ textAlign: "left", color: "#009900", paddingTop: 20 }}
            >
              <span>{this.state.successMsg}</span>
            </div>
          </Form>
        </div>
        <div
          className="ui raised center aligned text container segment"
          style={{ marginTop: 20, width: 400 + "px" }}
        >
          {t("login.cant_remember")}{" "}
          <Link href="/password/reset">
            <a style={{ color: "#f05f40" }}>
              {t("login.request_new_password")}
            </a>
          </Link>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(Login);
