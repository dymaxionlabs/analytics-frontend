import { mount, shallow } from "enzyme";
import React from "react";
import OpacitySlider from "../../components/OpacitySlider";

describe("OpacitySlider", () => {
  it("(smoke test)", () => {
    const wrapper = mount(shallow(<OpacitySlider value={42} />).get(0));
  });
});
