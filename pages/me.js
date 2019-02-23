import React from "react";
import { withAuthSync, logout } from "../utils/auth";
import { withNamespaces } from "../i18n";
import { Button } from "semantic-ui-react";

import "semantic-ui-css/semantic.css"; // FIXME Move this Layout

class Me extends React.Component {
  static async getInitialProps() {
    return {
      namespacesRequired: ["common", "me"]
    };
  }

  onLogoutClick = () => {
    logout();
  };

  render() {
    const { t } = this.props;

    return (
      <div>
        <h1>Me</h1>
        <Button onClick={this.onLogoutClick}>{t("logout_btn")}</Button>
      </div>
    );
  }
}

export default withAuthSync(withNamespaces(["common", "me"])(Me));
