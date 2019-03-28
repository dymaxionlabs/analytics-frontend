import React from "react";
import { withNamespaces } from "../../i18n";

import { Popup } from "semantic-ui-react";

const stepPosition = {
  initial: "left bottom",
  search_done: "right center",
  polygon_drawn: "right center",
  layer_selected: "left center"
};

class Guide extends React.Component {
  state = { isOpen: true };

  render() {
    const { t } = this.props;

    return (
      <Popup
        style={{ transition: "all 0.25s ease", zIndex: 500 }}
        content={t(this.props.step)}
        open={this.state.isOpen}
        size="large"
        className={this.props.step + " " + stepPosition[this.props.step]}
        position="top right"
      />
    );
  }
}

export default withNamespaces("guide")(Guide);
