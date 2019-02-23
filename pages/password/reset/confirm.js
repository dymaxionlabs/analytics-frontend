import React from "react";
import { i18n, withNamespaces, Link, Router } from "../../../i18n";
import { Button, Form, Header, Image } from "semantic-ui-react";
import axios from "axios";
import { buildApiUrl } from "../../../utils/api";

import "semantic-ui-css/semantic.css";
import logo from "../../../static/logo.png";

const passwordRegExp = new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,28}$`);

class PasswordResetConfirm extends React.Component {
  state = {
    pass1: "",
    err_pass1_msg: "",
    pass2: "",
    err_pass2_msg: "",
    uid: "",
    token: "",
    successMsg: "",
    errorMsg: "",
    validForm: "disabled"
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  handleChangePass1 = e => {
    this.setState({ pass1: e.target.value });
  };

  onChangePass2 = e => {
    this.setState({ pass2: e.target.value });
  };

  onSubmit = e => {
    const new_pass1 = this.state.pass1;
    const new_pass2 = this.state.pass2;

    const { t } = this.props;
    const { uid, token } = this.props.query;

    const dataSend = {
      new_password1: new_pass1,
      new_password2: new_pass2,
      uid,
      token
    };

    axios
      .post(buildApiUrl("/auth/password/reset/confirm/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        this.setState({
          successMsg: t("reset_password_confirm.success_msg"),
          errorMsg: ""
        });
        Router.push("/login");
      })
      .catch(error => {
        this.setState({
          successMsg: "",
          errorMsg: t("reset_password_confirm.error_msg"),
          validForm: "disabled"
        });
      });
  };

  componentDidUpdate() {
    const isPasswordValid = passwordRegExp.test(this.state.pass1);

    if (
      this.state.pass1.length > 0 &&
      !isPasswordValid &&
      this.state.err_pass1_msg === ""
    ) {
      this.setState({
        validForm: "disabled",
        err_pass1_msg: t("reset_password_confirm.invalid_password")
      });
    } else if (
      this.state.pass1.length > 0 &&
      isPasswordValid &&
      this.state.err_pass1_msg !== ""
    ) {
      this.setState({ err_pass1_msg: "" });
    }

    if (
      isPasswordValid &&
      this.state.err_pass2_msg === "" &&
      this.state.pass2 !== this.state.pass1 &&
      this.state.pass2.length > 0
    ) {
      this.setState({
        err_pass2_msg: t("reset_password_confirm.same_password"),
        validForm: "disabled"
      });
    } else if (
      isPasswordValid &&
      this.state.pass2 === this.state.pass1 &&
      this.state.err_pass2_msg !== ""
    ) {
      this.setState({ err_pass2_msg: "", validForm: "" });
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
          {t("reset_password_confirm.title")}
        </Header>
        <div
          className="ui raised very padded text container segment"
          style={{ marginTop: 20, width: 400 + "px" }}
        >
          <Form.Field>
            <Form.Input
              label={t("reset_password_confirm.password1_label")}
              fluid
              iconPosition="left"
              icon="key"
              type="password"
              placeholder={t("reset_password_confirm.password1_placeholder")}
              onChange={this.handleChangePass1}
              value={this.state.pass1}
            />
          </Form.Field>
          <div style={{ color: "#990000" }}>{this.state.err_pass1_msg}</div>
          <Form.Field>
            <Form.Input
              label={t("reset_password_confirm.password2_label")}
              fluid
              iconPosition="left"
              icon="key"
              type="password"
              placeholder={t("reset_password_confirm.password2_placeholder")}
              onChange={this.onChangePass2}
              value={this.state.pass2}
            />
          </Form.Field>
          <div style={{ color: "#990000" }}>{this.state.err_pass2_msg}</div>
          <br />
          <br />
          <div style={{ textAlign: "right" }}>
            <Link href="/login">
              <Button className="ui button">
                {t("reset_password_confirm.cancel")}
              </Button>
            </Link>
            <Button
              onClick={this.onSubmit}
              color="orange"
              className={this.state.validForm}
            >
              {t("reset_password_confirm.change")}
            </Button>
            <div
              style={{ textAlign: "left", color: "#009900", paddingTop: 20 }}
            >
              <span>{this.state.successMsg}</span>
            </div>
            <div
              style={{ textAlign: "left", color: "#990000", paddingTop: 20 }}
            >
              <span>{this.state.errorMsg}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withNamespaces()(PasswordResetConfirm);
