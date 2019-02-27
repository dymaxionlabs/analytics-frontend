import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/lab/Slider";

const styles = {
  root: {
    width: 40
  },
  slider: {
    padding: "22px 0px"
  }
};

class OpacitySlider extends React.Component {
  render() {
    const { classes, value, onChange } = this.props;

    return (
      <div className={classes.root}>
        <Slider
          classes={{ container: classes.slider }}
          value={value}
          onChange={onChange}
        />
      </div>
    );
  }
}

OpacitySlider.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number,
  onChange: PropTypes.func
};

export default withStyles(styles)(OpacitySlider);
