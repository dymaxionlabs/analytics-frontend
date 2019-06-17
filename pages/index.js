import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import { withNamespaces } from "../i18n";
import { withAuthSync } from "../utils/auth";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(200 + theme.spacing.unit * 2 * 2)]: {
      width: 200,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    textAlign: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  header: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 3
  },
  progressContainer: {
    flexGrow: 1
  }
});

class Index extends React.Component {
  static async getInitialProps({ res }) {
    return {
      namespacesRequired: []
    };
  }

  componentDidMount() {
    const { token } = this.props;

    // for some reason, Router does not work
    if (token) {
      this._redirectTo("/home");
    } else {
      this._redirectTo("/quote");
    }
  }

  _redirectTo(path) {
    window.location.href = path;
  }

  render() {
    const { t, classes } = this.props;

    return (
      <div>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <img src="/static/logo.png" />
            <Typography className={classes.header} component="h1" variant="h5">
              {t("loading")}
            </Typography>
            <div className={classes.progressContainer}>
              <LinearProgress />
            </div>
          </Paper>
        </main>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

Index = withStyles(styles)(Index);
Index = withNamespaces()(Index);
Index = withAuthSync(Index, { redirect: false });

export default Index;
