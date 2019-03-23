import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Tooltip from "@material-ui/core/Tooltip";

import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import MapIcon from "@material-ui/icons/Map";
import CloseIcon from "@material-ui/icons/Close";

import { i18n, withNamespaces } from "../../i18n";
import { logout } from "../../utils/auth";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import Moment from "react-moment";
import cookie from "js-cookie";

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  title: {
    marginBottom: theme.spacing.units * 10
  }
});

class NotImplementedSnackbar extends React.Component {
  render() {
    const { classes, open, onClose } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={onClose}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Disponible pronto</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

NotImplementedSnackbar = withStyles(styles)(NotImplementedSnackbar);

class LayersContent extends React.Component {
  state = {
    layers: [],
    notImplementedOpen: false
  };

  componentDidMount() {
    const projectId = cookie.get("project");

    axios
      .get(buildApiUrl("/layers/"), {
        params: { project_uuid: projectId },
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        this.setState({ layers: response.data.results });
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 401) {
          logout();
        } else {
          console.error(response);
        }
      });
  }

  handleDownloadClick = () => {
    this.setState({ notImplementedOpen: true });
  };

  handleNotImplementedClose = () => {
    this.setState({ notImplementedOpen: false });
  };

  render() {
    const { t, classes } = this.props;
    const { layers, notImplementedOpen } = this.state;
    const locale = i18n.language;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
          {t("layers.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("layers.created_at")}</TableCell>
                <TableCell>{t("layers.name")}</TableCell>
                <TableCell>{t("layers.description")}</TableCell>
                <TableCell>{t("layers.type")}</TableCell>
                <TableCell>{t("layers.date")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {layers.map((layer, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {layer.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {layer.name}
                  </TableCell>
                  <TableCell>{layer.description}</TableCell>
                  <TableCell>
                    {t(`layers.layer_type_${layer.layer_type}`)}
                  </TableCell>
                  <TableCell>
                    <Moment locale={locale} format="DD/MM/YYYY">
                      {layer.date}
                    </Moment>
                  </TableCell>
                  <TableCell align="right">
                    <a href={`/layers/${layer.uuid}`}>
                      <Tooltip title={t("view")}>
                        <IconButton
                          className={classes.button}
                          aria-label={t("view")}
                        >
                          <MapIcon />
                        </IconButton>
                      </Tooltip>
                    </a>
                    <Tooltip title={t("download")}>
                      <IconButton
                        className={classes.button}
                        aria-label={t("download")}
                        onClick={() => this.handleDownloadClick(layer)}
                      >
                        <CloudDownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        <NotImplementedSnackbar
          open={notImplementedOpen}
          onClose={this.handleNotImplementedClose}
        />
      </div>
    );
  }
}

LayersContent.propTypes = {
  classes: PropTypes.object.isRequired
};

LayersContent = withStyles(styles)(LayersContent);
LayersContent = withNamespaces("me")(LayersContent);

export default LayersContent;
