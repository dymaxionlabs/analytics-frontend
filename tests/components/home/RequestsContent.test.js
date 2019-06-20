import { mount, shallow } from "enzyme";
import React from "react";
import RequestsContent from "../../../components/home/RequestsContent";

describe("RequestsContent", () => {
  const getWrapper = props => {
    return mount(shallow(<RequestsContent {...props} />).get(0));
  };

  it("(smoke test)", () => {
    const wrapper = getWrapper({});
  });
});
