import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { i18n, withNamespaces } from "../i18n";
import withStyles from "@material-ui/core/styles/withStyles";
import axios from "axios";
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
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  successMsg: {},
  errorMsg: {
    color: "red"
  }
});

class ConfirmEmail extends React.Component {
  state = {
    loading: true,
    successMsg: "",
    errorMsg: ""
  };

  static async getInitialProps({ query }) {
    return {
      query,
      namespacesRequired: ["common"]
    };
  }

  componentDidMount() {
    const { t, query } = this.props;
    const key = query["k"];

    if (!key) {
      this.setState({
        errorMsg: t("confirm_email.invalid_key"),
        loading: false
      });
      return;
    }

    const dataSend = { key };

    axios
      .post(buildApiUrl("/auth/registration/verify-email/"), dataSend, {
        headers: { "Accept-Language": i18n.language }
      })
      .then(response => {
        this.setState({
          errorMsg: "",
          successMsg: t("confirm_email.success_msg")
        });
      })
      .catch(error => {
        console.error(error);
        this.setState({
          errorMsg: t("confirm_email.error_msg"),
          successMsg: ""
        });
      })
      .then(() => {
        this.setState({
          loading: false
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { loading, successMsg, errorMsg } = this.state;

    return (
      <main className={classes.main}>
        <Paper className={classes.paper}>
          {loading && <LinearProgress />}
          <Typography className={classes.successMsg}>{successMsg}</Typography>
          <Typography className={classes.errorMsg}>{errorMsg}</Typography>
        </Paper>
      </main>
    );
  }
}

ConfirmEmail = withStyles(styles)(ConfirmEmail);
ConfirmEmail = withNamespaces()(ConfirmEmail);

export default ConfirmEmail;
