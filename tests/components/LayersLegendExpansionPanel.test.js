import { mount, shallow } from "enzyme";
import React from "react";
import LayersLegendExpansionPanel from "../../components/LayersLegendExpansionPanel";

describe("LayersFab", () => {
  it("(smoke test)", () => {
    const wrapper = mount(
      shallow(<LayersLegendExpansionPanel layers={[]} />).get(0)
    );
  });
});
