import { mount, shallow } from "enzyme";
import React from "react";
import SelectProjectButton from "../../components/SelectProjectButton";

describe("SelectProjectButton", () => {
  const getWrapper = props => {
    return mount(shallow(<SelectProjectButton {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });
  });
});
