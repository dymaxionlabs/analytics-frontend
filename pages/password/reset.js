import React from "react";
import { i18n, withNamespaces, Link } from "../../i18n";
import { Button, Form, Header, Image } from "semantic-ui-react";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";

import "semantic-ui-css/semantic.css";
import logo from "../../static/logo.png";

const emailRegExp = new RegExp(
  `^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$`
);

class PasswordReset extends React.Component {
  state = {
    email: "",
    errorMsg: "",
    successMsg: "",
    validForm: "disabled"
  };

  static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["common"]
    };
  }

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  onSubmit = e => {
    const { t } = this.props;
    const dataSend = { email: this.state.email };

    axios
      .post(buildApiUrl("/auth/password/reset/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        this.setState({
          email: "",
          validForm: "disabled",
          successMsg: t("reset_password.success_msg")
        });
      });
  };

  componentDidUpdate() {
    const isEmailValid = emailRegExp.test(this.state.email);
    const { t } = this.props;

    if (
      this.state.email.length > 0 &&
      !isEmailValid &&
      this.state.errorMsg === ""
    ) {
      this.setState({ errorMsg: t("reset_password.error_msg") });
    } else if (isEmailValid && this.state.errorMsg !== "") {
      this.setState({ errorMsg: "", validForm: "" });
    }
  }

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
          {t("reset_password.title")}
        </Header>
        <div
          className="ui raised very padded text container segment"
          style={{ marginTop: 20, width: 400 + "px" }}
        >
          <Form.Field>
            <Form.Input
              label={t("reset_password.email_label")}
              fluid
              iconPosition="left"
              icon="mail"
              placeholder={t("email")}
              onChange={this.onEmailChange}
              value={this.state.email}
            />
          </Form.Field>
          <div>{this.state.errorMsg}</div>
          <br />
          <br />
          <div style={{ textAlign: "right" }}>
            <Link href="/login">
              <Button className="ui button">
                {t("reset_password.cancel")}
              </Button>
            </Link>
            <Button
              className={this.state.validForm}
              onClick={this.onSubmit}
              color="orange"
            >
              {t("reset_password.submit")}
            </Button>
          </div>

          <div style={{ textAlign: "left", color: "#009900", paddingTop: 20 }}>
            <span>{this.state.successMsg}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PasswordReset);
