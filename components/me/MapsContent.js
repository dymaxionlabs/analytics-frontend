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

import { i18n, withNamespaces, Router } from "../../i18n";
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

function getMapId(layer) {
  const parts = layer.url.split("/");
  return parts[parts.length - 2];
}

class MapsContent extends React.Component {
  state = {
    maps: []
  };

  componentDidMount() {
    axios
      .get(buildApiUrl("/maps/"), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        console.log(response.data);
        this.setState({ maps: response.data });
      })
      .catch(error => {
        alert("An error ocurred");
        Router.push("/login");
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
              {maps.map(map => (
                <TableRow key={map.url}>
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
                    <a href={`/maps/${map.project_slug}/${map.slug}`}>
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
