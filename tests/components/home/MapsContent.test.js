import { mount, shallow } from "enzyme";
import React from "react";
import MapsContent from "../../../components/home/MapsContent";

describe("MapsContent", () => {
  const getWrapper = props => {
    return mount(shallow(<MapsContent {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
