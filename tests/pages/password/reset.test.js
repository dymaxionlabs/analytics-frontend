import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import React from "react";
import PasswordReset from "../../../pages/password/reset";

afterEach(() => {
  mockAxios.reset();
});

describe("PasswordReset", () => {
  const getWrapper = props => {
    return mount(shallow(<PasswordReset {...props} />).get(0));
  };

  const assertInputChange = (wrapper, id, value) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: value } });
    expect(wrapper.state(id)).toEqual(value);
  };

  it("has an email input sets state", () => {
    const wrapper = getWrapper();
    assertInputChange(wrapper, "email", "john@example.com");
  });

  it("has a form that makes a POST request to /auth/password/reset/ with user email address", () => {
    const wrapper = getWrapper();
    const form = wrapper.find("form");

    // Submit form
    wrapper.setState({ email: "john@example.com" });
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/password/reset/",
      { email: "john@example.com" },
      { headers: { "Accept-Language": undefined } }
    );
    mockAxios.mockResponse({});

    expect(wrapper.state("successMsg")).toEqual("reset_password.success_msg");
    expect(wrapper.state("email")).toEqual("");
  });

  it("catches error if POST request fails", () => {
    const wrapper = getWrapper();
    const form = wrapper.find("form");

    // Submit form
    wrapper.setState({ email: "john@example.com" });
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/password/reset/",
      { email: "john@example.com" },
      { headers: { "Accept-Language": undefined } }
    );
    mockAxios.mockError();

    expect(wrapper.state("successMsg")).toEqual("");
    expect(wrapper.state("errorMsg")).toEqual("login.error_msg");
  });
});
