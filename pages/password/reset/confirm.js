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
import { i18n, withNamespaces, Router, Link } from "../../../i18n";
import { buildApiUrl } from "../../../utils/api";

const passwordRegExp = new RegExp(`^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,28}$`);

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
    marginTop: theme.spacing.unit
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
  }
});

class PasswordResetConfirm extends React.Component {
  state = {
    pass1: "",
    pass2: "",
    err_pass1_msg: "",
    err_pass2_msg: "",
    isSubmitting: false,
    validForm: false
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  onPassword1Change = e => {
    this.setState({ pass1: e.target.value });
  };

  onPassword2Change = e => {
    this.setState({ pass2: e.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { t } = this.props;
    const { uid, token } = this.props.query;
    const { pass1, pass2 } = this.state;

    const dataSend = {
      new_password1: pass1,
      new_password2: pass2,
      uid,
      token
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: "",
      isSubmitting: true
    });

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
          errorMsg: t("reset_password_confirm.error_msg"),
          successMsg: "",
          isSubmitting: false,
          validForm: false
        });
      });
  };

  componentDidUpdate() {
    const { t } = this.props;
    const isPasswordValid = passwordRegExp.test(this.state.pass1);

    if (
      this.state.pass1.length > 0 &&
      !isPasswordValid &&
      this.state.err_pass1_msg === ""
    ) {
      this.setState({
        validForm: false,
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
        validForm: false,
        err_pass2_msg: t("reset_password_confirm.same_password")
      });
    } else if (
      isPasswordValid &&
      this.state.pass2 === this.state.pass1 &&
      this.state.err_pass2_msg !== ""
    ) {
      this.setState({ err_pass2_msg: "", validForm: true });
    }
  }

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
            {t("reset_password_confirm.title")}
          </Typography>
          {this.state.errorMsg && (
            <Typography className={classes.errorMessage}>
              {this.state.errorMsg}
            </Typography>
          )}
          {this.state.successMsg && (
            <Typography className={classes.successMessage}>
              {this.state.successMsg}
            </Typography>
          )}
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">
                {t("reset_password_confirm.password1_placeholder")}
              </InputLabel>
              <Input
                name="password1"
                type="password"
                id="password1"
                onChange={this.onPassword1Change}
                value={this.state.pass1}
              />
              {this.state.err_pass1_msg && (
                <FormHelperText>{this.state.err_pass1_msg}</FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">
                {t("reset_password_confirm.password2_placeholder")}
              </InputLabel>
              <Input
                name="password2"
                type="password"
                id="password2"
                onChange={this.onPassword2Change}
                value={this.state.pass2}
              />
              {this.state.err_pass2_msg && (
                <FormHelperText>{this.state.err_pass2_msg}</FormHelperText>
              )}
            </FormControl>
            <Grid container spacing={24}>
              <Grid item xs>
                <Link href="/login">
                  <Button
                    className={classes.submit}
                    variant="contained"
                    fullWidth
                  >
                    {t("reset_password_confirm.cancel")}
                  </Button>
                </Link>
              </Grid>
              <Grid item xs>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!this.state.validForm}
                  className={classes.submit}
                >
                  {t("reset_password_confirm.change")}
                </Button>
              </Grid>
            </Grid>
            {isSubmitting && <LinearProgress />}
          </form>
        </Paper>
      </main>
    );
  }
}

PasswordResetConfirm.propTypes = {
  classes: PropTypes.object.isRequired
};

PasswordResetConfirm = withStyles(styles)(PasswordResetConfirm);
PasswordResetConfirm = withNamespaces()(PasswordResetConfirm);

export default PasswordResetConfirm;
