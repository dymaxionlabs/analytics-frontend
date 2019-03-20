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
import { withAuthSync, login } from "../utils/auth";
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
  }
});

class Invite extends React.Component {
  state = {
    username: "",
    email: "",
    password1: "",
    password2: "",
    err_username_msg: "",
    err_email_msg: "",
    err_password1_msg: "",
    err_password2_msg: "",
    inviteHasEmail: false,
    fatalError: "",
    loading: true
  };

  static async getInitialProps({ query }) {
    return {
      namespacesRequired: ["common"],
      query
    };
  }

  constructor(props) {
    super(props);

    const { t } = props;
    const { key } = props.query;

    if (!key) {
      this.state = {
        fatalError: t("invite.invalid_key"),
        loading: false
      };
    }
  }

  componentDidMount() {
    const { t } = this.props;
    const { key } = this.props.query;

    if (this.state.fatalError) return;

    this.setState({ loading: true });

    // Retrieve token for validation
    axios
      .get(buildApiUrl(`/projects/invitations/${key}/`))
      .then(response => {
        const { data } = response;
        if (data.email && data.confirmed) {
          this.setState({ fatalError: t("invite.already_confirmed") });
        } else {
          this.setState({
            project: data.project,
            email: data.email,
            inviteHasEmail: !!data.email
          });
        }

        // If already logged in, show Confirm button only
        const { token } = this.props;
        if (token) {
          // TODO
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({ fatalError: t("invite.invalid_key") });
      })
      .then(() => {
        this.setState({ loading: false });
      });
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

  _confirmInvitationToken(userToken) {
    const { t } = this.props;
    const { key, redirect } = this.props.query;
    console.log(`confirm with ${userToken}`);

    axios
      .post(
        buildApiUrl(`/projects/invitations/${key}/confirm/`),
        {},
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: userToken
          }
        }
      )
      .then(() => {})
      .catch(err => {
        if (err.response) {
          console.error(err);
        }
      })
      .then(() => {
        // Regardless of confirmation, login user
        this.setState({
          successMsg: t("invite.success_msg")
        });

        if (userToken) {
          login({ token: userToken, redirectTo: redirect });
        }
      });
  }

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
      loading: true
    });

    axios
      .post(buildApiUrl("/auth/registration/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        const token = response.data.key;
        this._confirmInvitationToken(token);
      })
      .catch(error => {
        console.error(error);

        // Generic error message
        let errorMsg = t("invite.error_msg");

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
          loading: false
        });
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { t, classes } = this.props;
    const { loading, email, project, fatalError } = this.state;

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
            {t("invite.header")}
          </Typography>
          <Typography className={classes.subheader}>
            {!loading &&
              !fatalError &&
              t("invite.subheader", { project, email })}
          </Typography>
          <Typography className={classes.successMessage}>
            {this.state.successMsg}
          </Typography>
          <Typography className={classes.errorMessage}>
            {this.state.errorMsg || fatalError}
          </Typography>
          <form className={classes.form} method="post" onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">
                {t("invite.username_placeholder")}
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
            {!this.state.inviteHasEmail && (
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">
                  {t("invite.email_placeholder")}
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
            )}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password1">
                {t("invite.password1_placeholder")}
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
                {t("invite.password2_placeholder")}
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={fatalError !== "" || loading}
                  className={classes.submit}
                >
                  {t("invite.submit")}
                </Button>
              </Grid>
            </Grid>
            {loading && <LinearProgress />}
          </form>
        </Paper>
      </main>
    );
  }
}

Invite.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

Invite = withStyles(styles)(Invite);
Invite = withNamespaces()(Invite);
Invite = withAuthSync(Invite, { redirect: false });

export default Invite;
