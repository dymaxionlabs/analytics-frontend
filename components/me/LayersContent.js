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
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import MapIcon from "@material-ui/icons/Map";

import { i18n, withNamespaces } from "../../i18n";
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

function getLayerId(layer) {
  const parts = layer.url.split("/");
  return parts[parts.length - 2];
}

class LayersContent extends React.Component {
  state = {
    layers: []
  };

  componentDidMount() {
    axios
      .get(buildApiUrl("/layers/"), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        console.log(response.data[0]);
        this.setState({ layers: response.data });
      });
  }

  onDownloadClick = id => {
    alert("Not implemented yet");
  };

  render() {
    const { t, classes } = this.props;
    const { layers } = this.state;
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
              {layers.map(layer => (
                <TableRow key={layer.url}>
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
                    <a href={`/layers/${getLayerId(layer)}`}>
                      <IconButton
                        className={classes.button}
                        aria-label="View layer in a map"
                      >
                        <MapIcon />
                      </IconButton>
                    </a>
                    <IconButton
                      className={classes.button}
                      aria-label="Download layer"
                      onClick={() => this.onDownloadClick(getLayerId(layer))}
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
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
