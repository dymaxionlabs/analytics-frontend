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
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";

import { i18n, withNamespaces } from "../../i18n";
import { logout } from "../../utils/auth";
import axios from "axios";
import { buildApiUrl } from "../../utils/api";
import Moment from "react-moment";

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

class ImagesContent extends React.Component {
  state = {
    images: [],
    notImplementedOpen: false
  };

  componentDidMount() {
    axios
      .get(buildApiUrl("/files/"), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        this.setState({ images: response.data });
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

  handleNotImplementedClose = () => {
    this.setState({ notImplementedOpen: false });
  };

  render() {
    const { t, classes } = this.props;
    const { images: images, notImplementedOpen } = this.state;
    const locale = i18n.language;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
          {t("images.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("images.created_at")}</TableCell>
                <TableCell>{t("images.name")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {images.map((image, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {image.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {image.name}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t("download")}>
                      <a href={image.file} download>
                        <IconButton
                          className={classes.button}
                          aria-label={t("download")}
                        >
                          <CloudDownloadIcon />
                        </IconButton>
                      </a>
                    </Tooltip>
                    {/* <Tooltip title={t("delete")}>
                      <IconButton
                        className={classes.button}
                        aria-label={t("delete")}
                        onClick={() => this.handleDeleteClick(layer)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip> */}
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

ImagesContent.propTypes = {
  classes: PropTypes.object.isRequired
};

ImagesContent = withStyles(styles)(ImagesContent);
ImagesContent = withNamespaces("me")(ImagesContent);

export default ImagesContent;
