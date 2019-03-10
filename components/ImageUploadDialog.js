import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "../i18n";
import { withStyles } from "@material-ui/core/styles";
import { buildApiUrl } from "../utils/api";
import DropzoneDialog from "./upload/DropzoneDialog";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Typography } from "@material-ui/core";
import axios from "axios";

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
    files.forEach(file => {
      axios
        .post(
          buildApiUrl(`/images/upload/${file.name}`),
          { data: file },
          { headers: { Authorization: this.props.token } }
        )
        .then(data => {
          console.log(data);
        });
    });
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
          filesLimit={250}
          dropzoneText={
            <Typography>Drag and drop an image file here or click</Typography>
          }
          showPreviews={true}
          maxFileSize={50000000}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

ImageUploadDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

ImageUploadDialog = withStyles(styles)(ImageUploadDialog);
ImageUploadDialog = withNamespaces()(ImageUploadDialog);

export default ImageUploadDialog;
