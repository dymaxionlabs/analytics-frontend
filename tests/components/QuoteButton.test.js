import { mount, shallow } from "enzyme";
import React from "react";
import QuoteButton from "../../components/QuoteButton";

describe("QuoteButton", () => {
  const getWrapper = props => {
    return mount(shallow(<QuoteButton {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });
  });
});
