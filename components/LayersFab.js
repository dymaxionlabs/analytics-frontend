import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Fab from "@material-ui/core/Fab";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LayersIcon from "@material-ui/icons/Layers";
import { withNamespaces } from "../i18n";

const styles = theme => ({
  fab: {
    position: "fixed",
    left: 10,
    bottom: 10,
    margin: theme.spacing.unit,
    zIndex: 1000
  }
});

class LayersFab extends React.Component {
  state = {
    anchorEl: null
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleCheckboxChange = event => {
    const { onToggle } = this.props;
    if (onToggle) onToggle(this._findLayer(event.target.value), event);
  };

  handleItemClick = uuid => {
    // const { onToggle } = this.props;
    // if (onToggle) onToggle(this._findLayer(uuid), event);
  };

  _findLayer(uuid) {
    const layer = this.props.layers.find(layer => layer.uuid === uuid);
    return layer;
  }

  render() {
    const { t, classes, layers, activeLayers } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <Fab
          className={classes.fab}
          aria-label={t("toggle_layers")}
          aria-owns={anchorEl ? "layers-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <LayersIcon />
        </Fab>
        <Menu
          id="layers-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          disableAutoFocusItem={true}
        >
          {layers.map(layer => (
            <MenuItem
              key={layer.uuid}
              onClick={this.handleItemClick(layer.uuid)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={activeLayers.includes(layer.uuid)}
                    onChange={this.handleCheckboxChange}
                    value={layer.uuid}
                  />
                }
                label={layer.name}
              />
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }
}

LayersFab.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  layers: PropTypes.array.isRequired,
  activeLayers: PropTypes.array.isRequired,
  onToggle: PropTypes.func
};

export default withNamespaces()(withStyles(styles)(LayersFab));
