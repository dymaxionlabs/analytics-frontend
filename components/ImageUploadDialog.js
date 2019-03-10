import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "../i18n";
import { withStyles } from "@material-ui/core/styles";
import { buildApiUrl } from "../utils/api";
import DropzoneDialog from "./upload/DropzoneDialog";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
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

class UploadProgressDialog extends Component {
  handleClose = event => {
    const { onClose } = this.props;
    if (onClose) onClose(event);
  };

  render() {
    const { t, open, progress } = this.props;

    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t("upload_progress.title")}
        </DialogTitle>
        <DialogContent>
          <LinearProgress variant="determinate" value={progress} />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            {t("cancel_btn")}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

UploadProgressDialog = withStyles(styles)(UploadProgressDialog);
UploadProgressDialog = withNamespaces("image_upload_dialog")(
  UploadProgressDialog
);

class ImageUploadDialog extends Component {
  state = {
    open: false,
    uploading: false,
    uploadProgress: 0
  };

  handleClose = () => {
    // FIXME if uploading, ask user if she wants to cancel...
    this.setState({ open: false, uploading: false });
  };

  handleSave = files => {
    if (files.length == 0) return;

    this.setState({ uploading: true, uploadProgress: 0 });

    let count = 0;
    files.forEach(file => {
      axios
        .post(buildApiUrl(`/images/upload/${file.name}`), file, {
          headers: { Authorization: this.props.token }
        })
        .then(() => {})
        .catch(err => {
          console.error(err);
        })
        .then(() => {
          count += 1;
          this.setState({ uploadProgress: (count / files.length) * 100 });
          if (count === files.length) {
            this.setState({ open: false, uploading: false });
          }
        });

      if (!this.state.uploading) return;
    });
  };

  handleOpen = () => {
    this.setState({
      open: true
    });
  };

  handleUploadCancel = () => {
    this.setState({ uploading: false });
  };

  render() {
    const { t, classes } = this.props;
    const { open, uploading, uploadProgress } = this.state;

    return (
      <div>
        <Button onClick={this.handleOpen} className={classes.button}>
          <CloudUploadIcon className={classes.leftIcon} />
          {t("upload_btn")}
        </Button>
        <DropzoneDialog
          title={t("dialog.title")}
          submitButtonText={t("dialog.submit")}
          cancelButtonText={t("dialog.cancel")}
          dropzoneText={t("dialog.dropzone")}
          open={open}
          onSave={this.handleSave}
          acceptedFiles={["image/jpeg"]}
          filesLimit={250}
          showPreviews={true}
          maxFileSize={50000000}
          onClose={this.handleClose}
        />
        <UploadProgressDialog
          onClose={this.handleUploadCancel}
          open={uploading}
          progress={uploadProgress}
        />
      </div>
    );
  }
}

ImageUploadDialog.propTypes = {
  classes: PropTypes.object.isRequired
};

ImageUploadDialog = withStyles(styles)(ImageUploadDialog);
ImageUploadDialog = withNamespaces("image_upload_dialog")(ImageUploadDialog);

export default ImageUploadDialog;
