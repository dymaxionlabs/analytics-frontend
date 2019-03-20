import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Head from "next/head";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
import { i18n, withNamespaces, Link } from "../../i18n";
import { buildApiUrl } from "../../utils/api";

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

class PasswordReset extends React.Component {
  state = {
    email: "",
    password: "",
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

  onSubmit = event => {
    event.preventDefault();

    const { t } = this.props;
    const { email } = this.state;

    const dataSend = {
      email: email
    };

    // Reset messages
    this.setState({
      errorMsg: "",
      successMsg: "",
      isSubmitting: true
    });

    axios
      .post(buildApiUrl("/auth/password/reset/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        this.setState({
          email: "",
          successMsg: t("reset_password.success_msg")
        });
      })
      .catch(error => {
        this.setState({
          errorMsg: t("login.error_msg"),
          successMsg: ""
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
            {t("reset_password.title")}
          </Typography>
          <Typography className={classes.subheader}>
            {t("reset_password.email_label")}
          </Typography>
          <Typography className={classes.errorMessage}>
            {this.state.errorMsg}
          </Typography>
          <Typography className={classes.successMessage}>
            {this.state.successMsg}
          </Typography>
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                id="email"
                name="email"
                autoComplete="email"
                autoFocus
                type="email"
                onChange={this.onEmailChange}
                value={this.state.email}
              />
            </FormControl>
            <Grid container spacing={24}>
              <Grid item xs>
                <Link href="/login">
                  <Button
                    className={classes.submit}
                    variant="contained"
                    fullWidth
                  >
                    {t("reset_password.cancel")}
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
                  {t("login.submit")}
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

PasswordReset.propTypes = {
  classes: PropTypes.object.isRequired
};

PasswordReset = withStyles(styles)(PasswordReset);
PasswordReset = withNamespaces()(PasswordReset);

export default PasswordReset;
