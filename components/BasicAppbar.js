import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  appBar: {
    position: "relative"
  }
});

const BasicAppbar = withStyles(styles)(({ classes }) => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <Typography variant="h6" color="inherit" noWrap>
        Analytics
      </Typography>
    </Toolbar>
  </AppBar>
));

BasicAppbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(BasicAppbar);
