import { mount, shallow } from "enzyme";
import React from "react";
import cookie from "js-cookie";
import Home from "../../../pages/home/index";

describe("Home", () => {
  const getWrapper = props => {
    return mount(shallow(shallow(<Home {...props} />).get(0)).get(0));
  };

  it("(smoke test)", () => {
    cookie.get = jest.fn(() => "projectUuid");

    const userToken = "userToken";
    const wrapper = getWrapper({
      token: userToken,
      query: { section: "maps" }
    });
  });
});
