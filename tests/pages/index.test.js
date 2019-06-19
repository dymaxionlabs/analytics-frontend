import { mount, shallow } from "enzyme";
import React from "react";
import mockAxios from "jest-mock-axios";
import Index from "../../pages/index";

describe("Index", () => {
  const getWrapper = props => {
    return mount(shallow(shallow(<Index {...props} />).get(0)).get(0));
  };

  const originalLocation = window.location;

  beforeAll(() => {
    delete window.location;
    window.location = { href: "#" };
  });

  afterAll(() => {
    window.locaiton = originalLocation;
  });

  it("redirects to Home when authenticated", () => {
    const wrapper = getWrapper({ token: "userToken", query: {} });
    expect(window.location.href).toEqual("/home");
  });

  it("redirects to Quote when authenticated", () => {
    const wrapper = getWrapper({ query: {} });
    expect(window.location.href).toEqual("/quote");
  });
});
