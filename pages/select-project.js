import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Input from "@material-ui/core/Input";
import LinearProgress from "@material-ui/core/LinearProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";
import axios from "axios";
import cookie from "js-cookie";
import Head from "next/head";
import PropTypes from "prop-types";
import React from "react";
import Moment from "react-moment";
import BasicAppbar from "../components/BasicAppbar";
import { i18n, withNamespaces } from "../i18n";
import { buildApiUrl } from "../utils/api";
import { logout, withAuthSync } from "../utils/auth";
import { routerPush } from "../utils/router";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    [theme.breakpoints.up(500 + theme.spacing.unit * 2 * 2)]: {
      width: 500,
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
  subheader: {
    marginBottom: theme.spacing.unit * 3
  },
  subsubheader: {
    fontWeight: 500
  },
  grid: {
    flexGrow: 1
  },
  list: {
    overflow: "auto",
    maxHeight: 320
  },
  inlineFormContainer: {
    display: "flex"
  },
  inlineFormControl: {
    flexGrow: 1,
    marginRight: theme.spacing.unit
  }
});

class NewProjectForm extends React.Component {
  state = {
    name: ""
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();

    const { token } = this.props;
    const { name } = this.state;

    axios
      .post(
        buildApiUrl(`/projects/`),
        { name: name },
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: token
          }
        }
      )
      .then(response => {
        const { uuid } = response.data;
        cookie.set("project", uuid);
        routerPush("/home/");
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 401) {
          logout();
        } else {
          console.error(response);
        }
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { t, classes } = this.props;
    const { name } = this.state;

    return (
      <form
        className={classes.form}
        method="post"
        autoComplete="off"
        onSubmit={this.handleSubmit}
      >
        <div className={classes.inlineFormContainer}>
          <FormControl
            required
            margin="dense"
            className={classes.inlineFormControl}
          >
            <Input
              name="name"
              placeholder={t("new.name_placeholder")}
              value={name}
              onChange={this.handleChange}
            />
          </FormControl>
          <Button type="submit" variant="contained" color="primary">
            {t("new.submit_btn")}
          </Button>
        </div>
      </form>
    );
  }
}

NewProjectForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

NewProjectForm = withStyles(styles)(NewProjectForm);
NewProjectForm = withNamespaces("select_project")(NewProjectForm);

const PROJECTS_PER_PAGE = 5;

class OpenProjectList extends React.Component {
  state = {
    loading: true,
    results: [],
    count: 0
  };

  // pages() {
  //   const { count } = this.props;
  //   return Math.ceil(count / PROJECTS_PER_PAGE);
  // }

  componentDidMount() {
    const { token } = this.props;

    axios
      .get(buildApiUrl(`/projects/`), {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: token
        }
      })
      .then(response => {
        const { count, results } = response.data;
        this.setState({ count, results });
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 401) {
          logout();
        } else {
          console.error(response);
        }
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  handleSelectProject = uuid => {
    cookie.set("project", uuid);
    routerPush("/home/");
  };

  render() {
    const { t, classes } = this.props;
    const { loading, count, results } = this.state;
    const locale = i18n.language;

    if (loading) {
      return <LinearProgress />;
    } else if (results.length > 0) {
      return (
        <List className={classes.list}>
          {results.map(project => (
            <ListItem
              button
              key={project.uuid}
              onClick={() => this.handleSelectProject(project.uuid)}
            >
              <Avatar>
                <FolderIcon />
              </Avatar>
              <ListItemText
                primary={project.name}
                secondary={
                  <Moment locale={locale} fromNow>
                    {project.updated_at}
                  </Moment>
                }
              />
            </ListItem>
          ))}
        </List>
      );
    } else {
      return <Typography>{t("open.no_projects")}</Typography>;
    }
  }
}

OpenProjectList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired
};

OpenProjectList = withStyles(styles)(OpenProjectList);
OpenProjectList = withNamespaces("select_project")(OpenProjectList);

class SelectProject extends React.Component {
  static async getInitialProps(ctx) {
    return {
      namespacesRequired: ["select_project"]
    };
  }

  render() {
    const { t, classes, token } = this.props;

    return (
      <div>
        <Head>
          <title>{t("title")}</title>
        </Head>
        <BasicAppbar />
        <main className={classes.main}>
          <Paper className={classes.paper}>
            <Typography className={classes.header} component="h1" variant="h5">
              {t("header")}
            </Typography>
            <Typography className={classes.subheader}>
              {t("subheader")}
            </Typography>
            <Grid
              container
              direction="column"
              spacing={24}
              className={classes.grid}
            >
              <Grid item xs>
                <Typography className={classes.subsubheader}>
                  {t("new.header")}
                </Typography>
                <NewProjectForm token={token} />
              </Grid>
              <Grid item xs>
                <Typography className={classes.subsubheader}>
                  {t("open.header")}
                </Typography>
                <OpenProjectList token={token} />
              </Grid>
            </Grid>
          </Paper>
        </main>
      </div>
    );
  }
}

SelectProject.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

SelectProject = withStyles(styles)(SelectProject);
SelectProject = withNamespaces("select_project")(SelectProject);
SelectProject = withAuthSync(SelectProject);

export default SelectProject;
