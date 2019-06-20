import { shallow } from "enzyme";
import React from "react";
import CliengoLoader from "../../components/CliengoLoader";

describe("CliengoLoader", () => {
  it("(smoke test)", () => {
    const wrapper = shallow(<CliengoLoader />);
  });
});
