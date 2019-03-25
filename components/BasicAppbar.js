import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  logo: {
    height: 25,
    marginRight: theme.spacing.unit
  }
});

const BasicAppbar = withStyles(styles)(({ classes }) => (
  <AppBar position="absolute" color="default" className={classes.appBar}>
    <Toolbar>
      <img src="/static/logo.png" className={classes.logo} />
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
