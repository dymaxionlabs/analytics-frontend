import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import cookie from "js-cookie";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "../i18n";
import { buildApiUrl } from "../utils/api";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const styles = theme => ({
  button: {
    color: "white"
  }
});

class SelectProjectButton extends React.Component {
  state = {
    name: null
  };

  componentDidMount() {
    const id = cookie.get("project");
    const { token } = this.props;

    axios
      .get(buildApiUrl(`/projects/${id}/`), {
        headers: { Authorization: token }
      })
      .then(response => {
        console.log(response.data);
        this.setState({ name: response.data.name });
      })
      .catch(err => {
        const response = err.response;
        if (response) {
          console.error(response);
        } else {
          console.error(err);
        }
      });
  }

  render() {
    const { classes } = this.props;
    const { name } = this.state;

    return (
      name && (
        <Link href="/select-project">
          <Button className={classes.button}>
            {name}
            <ArrowDropDownIcon />
          </Button>
        </Link>
      )
    );
  }
}

SelectProjectButton.propTypes = {
  token: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

SelectProjectButton = withStyles(styles)(SelectProjectButton);

export default SelectProjectButton;
