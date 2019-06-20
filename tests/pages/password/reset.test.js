import { mount, shallow } from "enzyme";
import React from "react";
import PasswordReset from "../../../pages/password/reset";

describe("PasswordReset", () => {
  const getWrapper = props => {
    return mount(shallow(<PasswordReset {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
