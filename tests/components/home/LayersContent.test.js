import { mount, shallow } from "enzyme";
import React from "react";
import LayersContent from "../../../components/home/LayersContent";

describe("LayersContent", () => {
  const getWrapper = props => {
    return mount(shallow(<LayersContent {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
