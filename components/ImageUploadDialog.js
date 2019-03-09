import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import DropzoneDialog from "./upload/DropzoneDialog";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Typography } from "@material-ui/core";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
});

class ImageUploadDialog extends Component {
  state = {
    open: false,
    files: []
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = files => {
    // Saving files to state for further use and closing Modal.
    this.setState({
      files: files,
      open: false
    });
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    return (
      <div>
        <Button onClick={this.handleOpen} className={classes.button}>
          <CloudUploadIcon className={classes.leftIcon} />
          Upload images
        </Button>
        <DropzoneDialog
          open={open}
          onSave={this.handleSave}
          acceptedFiles={["image/jpeg"]}
          filesLimit={2000}
          dropzoneText={
            <Typography>Drag and drop an image file here or click</Typography>
          }
          showPreviews={true}
          showAlerts={false}
          // maxFileSize={5000000}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

ImageUploadDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageUploadDialog);
