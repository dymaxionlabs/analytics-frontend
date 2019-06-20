import { mount, shallow } from "enzyme";
import React from "react";
import LayersFab from "../../components/LayersFab";

describe("LayersFab", () => {
  it("(smoke test)", () => {
    const wrapper = mount(
      shallow(<LayersFab layers={[]} activeLayers={[]} />).get(0)
    );
  });
});
