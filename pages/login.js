import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Head from "next/head";
import withStyles from "@material-ui/core/styles/withStyles";
import { withNamespaces, Link } from "../i18n";
import axios from "axios";
import { buildApiUrl } from "../utils/api";
import { login } from "../utils/auth";

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
  passwordReset: {
    marginTop: theme.spacing.unit * 2
  }
});

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    remember: false,
    isSubmitting: false
  };

  static async getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onRememberClick = e => {
    this.setState({ remember: !this.state.remember });
  };

  onSubmit = event => {
    event.preventDefault();

    const { t } = this.props;
    const { email, password } = this.state;

    const dataSend = {
      email: email,
      password: password
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: "",
      isSubmitting: true
    });

    axios
      .post(buildApiUrl("/auth/login/"), dataSend)
      .then(response => {
        console.log(response.data);
        const token = response.data.key;
        const expires = this.state.remember ? 30 : null;
        if (token) {
          login({ token, expires });
        }
      })
      .catch(error => {
        this.setState({
          errorMsg: t("login.error_msg"),
          isSubmitting: false,
          successMsg: ""
        });
      });
  };

  render() {
    const { t, classes } = this.props;
    const { isSubmitting } = this.state;

    return (
      <main className={classes.main}>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {t("login.title")}
          </Typography>
          <Typography style={{ color: "red" }}>
            {this.state.errorMsg}
          </Typography>
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">{t("email")}</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                type="email"
                onChange={this.onEmailChange}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">{t("password")}</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.onPasswordChange}
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label={t("login.remember")}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              {t("login.submit")}
            </Button>
            {isSubmitting && <LinearProgress />}
          </form>
          <Typography className={classes.passwordReset}>
            {t("login.cant_remember")}{" "}
            <Link href="/password/reset">
              <a>{t("login.request_new_password")}</a>
            </Link>
          </Typography>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withNamespaces()(withStyles(styles)(SignIn));