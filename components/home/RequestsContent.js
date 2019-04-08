import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import IconButton from "@material-ui/core/IconButton";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import cookie from "js-cookie";
import PropTypes from "prop-types";
import React from "react";
import Moment from "react-moment";
import { i18n, withNamespaces } from "../../i18n";
import { buildApiUrl } from "../../utils/api";
import { logout } from "../../utils/auth";

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

class RequestsContent extends React.Component {
  state = {
    requests: []
  };

  componentDidMount() {
    axios
      .get(buildApiUrl("/requests/"), {
        headers: { Authorization: this.props.token }
      })
      .then(response => {
        this.setState({ requests: response.data.results });
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

  formatLayers(layers) {
    const { t } = this.props;
    return layers.map(layer => t(`common:${layer}_title`)).join(", ");
  }

  formatArea(area) {
    return `${Math.round(area)} km²`;
  }

  formatState(lastStateUpdate) {
    const { t } = this.props;
    if (lastStateUpdate) {
      const state = lastStateUpdate.state.toLowerCase();
      return t(`common:request.state.${state}`);
    } else {
      return t(`common:request.state.pending`);
    }
  }

  mustRequestBePayed(request) {
    const stateUpdate = request.last_state_update;
    return stateUpdate && stateUpdate.state === "AWAITING_PAYMENT";
  }

  paymentURL(request) {
    const fields = request.extra_fields;
    return fields && fields["payment_init_point"];
  }

  render() {
    const { t, classes } = this.props;
    const { requests } = this.state;
    const locale = i18n.language;

    return (
      <div>
        <Typography
          className={classes.title}
          variant="h4"
          gutterBottom
          component="h2"
        >
          {t("requests.title")}
        </Typography>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{t("requests.created_at")}</TableCell>
                <TableCell>{t("requests.layers")}</TableCell>
                <TableCell>{t("requests.area_km2")}</TableCell>
                <TableCell>{t("requests.state")}</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Moment locale={locale} fromNow>
                      {request.created_at}
                    </Moment>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {this.formatLayers(request.layers)}
                  </TableCell>
                  <TableCell>
                    {this.formatArea(request.total_area_km2)}
                  </TableCell>
                  <TableCell>
                    {this.formatState(request.last_state_update)}
                  </TableCell>
                  <TableCell>
                    {this.mustRequestBePayed(request) && (
                      <a href={this.paymentURL(request)}>
                        <IconButton
                          className={classes.button}
                          aria-label="Proceed to Pay"
                        >
                          <CreditCardIcon />
                        </IconButton>
                      </a>
                    )}
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

RequestsContent.propTypes = {
  classes: PropTypes.object.isRequired
};

RequestsContent = withStyles(styles)(RequestsContent);
RequestsContent = withNamespaces(["me", "common"])(RequestsContent);

export default RequestsContent;
