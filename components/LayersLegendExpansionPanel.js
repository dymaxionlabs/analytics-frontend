import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withNamespaces } from "../i18n";

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    width: "18%",
    position: "fixed",
    left: 10,
    top: 10,
    zIndex: 1000
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});

const Legend = ({ layer }) => {
  const legend = layer.extra_fields && layer.extra_fields.legend;
  return legend ? (
    <ul>
      {legend.items.map(item => (
        <li key={item.value}>{item.value}</li>
      ))}
    </ul>
  ) : null;
};

class LayersLegendExpansionPanel extends React.Component {
  render() {
    const { classes, layers } = this.props;

    return (
      <div className={classes.root}>
        {layers.map(layer => (
          <ExpansionPanel key={layer.uuid}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{layer.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              {layer.description && (
                <Typography>{layer.description}</Typography>
              )}
              <Legend layer={layer} />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </div>
    );
  }
}

LayersLegendExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default withNamespaces()(withStyles(styles)(LayersLegendExpansionPanel));
