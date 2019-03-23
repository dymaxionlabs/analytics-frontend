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
import MapIcon from "@material-ui/icons/Map";

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

function getMapId(layer) {
  const parts = layer.url.split("/");
  return parts[parts.length - 2];
}

class MapsContent extends React.Component {
  state = {
    maps: []
  };

  componentDidMount() {
    const projectId = cookie.get("project");

    axios
      .get(buildApiUrl("/maps/"), {
        params: { project_uuid: projectId },
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        this.setState({ maps: response.data.results });
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

  render() {
    const { t, classes } = this.props;
    const { maps } = this.state;
    const locale = i18n.language;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
          {t("maps.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("maps.created_at")}</TableCell>
                <TableCell>{t("maps.name")}</TableCell>
                <TableCell>{t("maps.description")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {maps.map((map, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {map.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {map.name}
                  </TableCell>
                  <TableCell>{map.description}</TableCell>
                  <TableCell align="right">
                    <a href={`/maps/${map.uuid}`}>
                      <IconButton
                        className={classes.button}
                        aria-label="View map"
                      >
                        <MapIcon />
                      </IconButton>
                    </a>
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

MapsContent.propTypes = {
  classes: PropTypes.object.isRequired
};

MapsContent = withStyles(styles)(MapsContent);
MapsContent = withNamespaces("me")(MapsContent);

export default MapsContent;
