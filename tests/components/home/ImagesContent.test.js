import { mount, shallow } from "enzyme";
import React from "react";
import ImagesContent from "../../../components/home/ImagesContent";

describe("ImagesContent", () => {
  const getWrapper = props => {
    return mount(shallow(<ImagesContent {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
