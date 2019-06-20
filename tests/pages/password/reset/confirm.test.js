import { mount, shallow } from "enzyme";
import React from "react";
import PasswordResetConfirm from "../../../../pages/password/reset/confirm";

describe("PasswordResetConfirm", () => {
  const getWrapper = props => {
    return mount(shallow(<PasswordResetConfirm {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
