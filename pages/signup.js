import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Head from "next/head";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import { i18n, withNamespaces, Link } from "../i18n";
import { login } from "../utils/auth";
import { buildApiUrl } from "../utils/api";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  subheader: {
    marginTop: theme.spacing.unit,
    textAlign: "center"
  },
  errorMessage: {
    marginTop: theme.spacing.unit,
    textAlign: "center",
    color: "red"
  },
  successMessage: {
    marginTop: theme.spacing.unit,
    textAlign: "center",
    color: "green"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  loginPar: {
    marginTop: theme.spacing.unit * 2
  }
});

class Register extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    err_username_msg: "",
    err_email_msg: "",
    err_password1_msg: "",
    err_password2_msg: "",
    isSubmitting: false
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query
    };
  }

  onUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  onPassword1Change = e => {
    this.setState({ password1: e.target.value });
  };

  onPassword2Change = e => {
    this.setState({ password2: e.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { t } = this.props;
    const { username, email, password1, password2 } = this.state;

    const dataSend = {
      username: username,
      email: email,
      password1: password1,
      password2: password2
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: "",
      err_username_msg: "",
      err_email_msg: "",
      err_password1_msg: "",
      err_password2_msg: "",
      isSubmitting: true
    });

    axios
      .post(buildApiUrl("/auth/registration/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        const token = response.data.key;
        this.setState({
          successMsg: t("signup.success_msg")
        });
        if (token) {
          const { redirect } = this.props.query;
          login({ token, redirectTo: redirect });
        }
      })
      .catch(error => {
        console.error(error);

        // Generic error message
        let errorMsg = t("signup.error_msg");

        // Parse error messages in response
        if (error.response && error.response.status === 400) {
          const { data } = error.response;
          for (let key in data) {
            this.setState({ [`err_${key}_msg`]: data[key] });
          }
          // Update general error message if available
          if (error.response.non_field_errors) {
            errorMsg = error.response.non_field_errors;
          }
        }

        this.setState({
          errorMsg: errorMsg,
          successMsg: "",
          isSubmitting: false
        });
      })
      .then(() => {
        this.setState({
          isSubmitting: false
        });
      });
  };

  render() {
    const { t, classes } = this.props;
    const { redirect } = this.props.query;
    const { isSubmitting } = this.state;

    return (
      <main className={classes.main}>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("signup.header")}
          </Typography>
          <Typography className={classes.subheader}>
            {t("signup.subheader")}
          </Typography>
          <Typography className={classes.successMessage}>
            {this.state.successMsg}
          </Typography>
          <Typography className={classes.errorMessage}>
            {this.state.errorMsg}
          </Typography>
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">
                {t("signup.username_placeholder")}
              </InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="user"
                autoFocus
                onChange={this.onUsernameChange}
                value={this.state.username}
              />
              {this.state.err_username_msg && (
                <FormHelperText error>
                  {this.state.err_username_msg}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">
                {t("signup.email_placeholder")}
              </InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                type="email"
                onChange={this.onEmailChange}
                value={this.state.email}
              />
              {this.state.err_email_msg && (
                <FormHelperText error>
                  {this.state.err_email_msg}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password1">
                {t("signup.password1_placeholder")}
              </InputLabel>
              <Input
                name="password1"
                type="password"
                id="password1"
                onChange={this.onPassword1Change}
                value={this.state.password1}
              />
              {this.state.err_password1_msg && (
                <FormHelperText error>
                  {this.state.err_password1_msg}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password2">
                {t("signup.password2_placeholder")}
              </InputLabel>
              <Input
                name="password2"
                type="password"
                id="password2"
                onChange={this.onPassword2Change}
                value={this.state.password2}
              />
              {this.state.err_password2_msg && (
                <FormHelperText error>
                  {this.state.err_password2_msg}
                </FormHelperText>
              )}
            </FormControl>
            <Grid container spacing={24}>
              <Grid item xs>
                <Link
                  href={{ pathname: "login", query: { redirect: redirect } }}
                >
                  <Button
                    className={classes.submit}
                    variant="contained"
                    fullWidth
                  >
                    {t("signup.cancel")}
                  </Button>
                </Link>
              </Grid>
              <Grid item xs>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                  className={classes.submit}
                >
                  {t("signup.submit")}
                </Button>
              </Grid>
            </Grid>
            {isSubmitting && <LinearProgress />}
          </form>
          <Typography className={classes.loginPar}>
            {t("signup.already_has_account")}{" "}
            <Link href={{ pathname: "login", query: { redirect: redirect } }}>
              <a>{t("signup.login")}</a>
            </Link>
          </Typography>
        </Paper>
      </main>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

Register = withStyles(styles)(Register);
Register = withNamespaces()(Register);

export default Register;
