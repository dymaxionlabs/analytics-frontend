import { mount, shallow } from "enzyme";
import React from "react";
import mockAxios from "jest-mock-axios";
import Signup from "../../pages/signup";

afterEach(() => {
  mockAxios.reset();
});

describe("Signup", () => {
  const getWrapper = props => {
    return mount(shallow(<Signup {...props} />).get(0));
  };

  const assertInputChange = (wrapper, id, value) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: value } });
    expect(wrapper.state(id)).toEqual(value);
  };

  it("has a username input that sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "username", "john");
  });

  it("has an email input that sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "email", "john@example.com");
  });

  it("has a password input that sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "password1", "hunter2");
  });

  it("has a second password input that sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "password2", "hunter2");
  });

  it("has a form that makes a POST request to /auth/registration with user credentials", () => {
    const redirect = "/maps/1234";
    const wrapper = getWrapper({ query: { redirect: redirect } });

    const instance = wrapper.instance();
    instance._login = jest.fn();

    // Submit form
    const state = {
      username: "john",
      email: "john@example.com",
      password1: "hunter2",
      password2: "hunter2"
    };
    wrapper.setState(state);

    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/",
      state,
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );
    const response = { data: { key: "secretKey" } };
    mockAxios.mockResponse(response);

    expect(instance._login).toHaveBeenCalledWith({
      token: response.data.key,
      redirectTo: redirect
    });

    // check error
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/",
      state,
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );
    mockAxios.mockError({
      response: { status: 400, non_field_errors: "Custom error" }
    });

    expect(wrapper.state("errorMsg")).toEqual("Custom error");
    expect(wrapper.state("successMsg")).toEqual("");
    expect(wrapper.state("isSubmitting")).toBe(false);
  });
});
