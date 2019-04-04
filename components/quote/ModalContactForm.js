import React from "react";
import { Header, Modal } from "semantic-ui-react";
import { withNamespaces } from "../../i18n";
import AnonymousRequestForm from "./AnonymousRequestForm";
import RequestForm from "./RequestForm";

class ModalContactForm extends React.Component {
  render() {
    const { t, onModalClose, trigger, ...formProps } = this.props;
    const { token } = formProps;

    return (
      <Modal trigger={trigger} onClose={onModalClose} closeIcon>
        <Header content={token ? "Checkout" : t("quote")} as="h3" />
        <Modal.Content>
          {token ? (
            <RequestForm token={token} {...formProps} />
          ) : (
            <AnonymousRequestForm {...formProps} />
          )}
        </Modal.Content>
        <Modal.Actions>
          <p>{t("footer")}</p>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default withNamespaces("modal_contact_form")(ModalContactForm);
