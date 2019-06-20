import { shallow } from "enzyme";
import React from "react";
import OpacitySlider from "../../components/OpacitySlider";

describe("OpacitySlider", () => {
  it("(smoke test)", () => {
    const wrapper = shallow(<OpacitySlider value={42} />);
  });
});
