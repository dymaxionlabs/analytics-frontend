import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
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
import { routerReplace } from "../utils/router";

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

class Login extends React.Component {
  state = {
    username: "",
    password: "",
    remember: false,
    isSubmitting: false
  };

  static async getInitialProps() {
    return {
      namespacesRequired: ["common"]
    };
  }

  onUsernameChange = e => {
    this.setState({ username: e.target.value });
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
    const { username, password } = this.state;

    const dataSend = {
      username: username,
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
        const token = response.data.key;
        const expires = this.state.remember ? 30 : null;
        if (token) {
          login({ token, expires });
        }
      })
      .catch(error => {
        console.error(error);
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
              <InputLabel htmlFor="username">{t("username")}</InputLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                onInput={this.onUsernameChange}
                onChange={this.onUsernameChange}
                value={this.state.username}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">{t("password")}</InputLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                onInput={this.onPasswordChange}
                onChange={this.onPasswordChange}
                value={this.state.password}
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
              disabled={isSubmitting}
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

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

Login = withStyles(styles)(Login);
Login = withNamespaces()(Login);

export default Login;
