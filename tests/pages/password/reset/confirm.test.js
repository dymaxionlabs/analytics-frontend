import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import React from "react";
import PasswordResetConfirm from "../../../../pages/password/reset/confirm";

afterEach(() => {
  mockAxios.reset();
});

describe("PasswordResetConfirm", () => {
  const getWrapper = props => {
    return mount(shallow(<PasswordResetConfirm {...props} />).get(0));
  };

  const assertInputChange = (wrapper, id, value) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: value } });
    expect(wrapper.state(id)).toEqual(value);
  };

  it("has a password input sets state", () => {
    const wrapper = getWrapper();
    assertInputChange(wrapper, "password1", "hunter2");
  });

  it("has a second password input sets state", () => {
    const wrapper = getWrapper();
    assertInputChange(wrapper, "password2", "hunter2");
  });

  it("has a form that makes a POST request to /auth/password/reset/confirm/ with new password", () => {
    const uid = "uid";
    const token = "userToken";

    const wrapper = getWrapper({ query: { uid, token } });

    // Mock redirect method
    const instance = wrapper.instance();
    instance._redirectTo = jest.fn();

    // Prepare form state
    wrapper.setState({ password1: "hunter2", password2: "hunter2" });

    // Simulate form submission
    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/password/reset/confirm/",
      { new_password1: "hunter2", new_password2: "hunter2", uid, token },
      { headers: { "Accept-Language": undefined } }
    );
    mockAxios.mockResponse({});

    expect(wrapper.state("successMsg")).toEqual(
      "reset_password_confirm.success_msg"
    );
    expect(wrapper.state("errorMsg")).toEqual("");
    expect(instance._redirectTo).toHaveBeenCalledWith("/login");
  });

  it("catches error if POST request fails", () => {
    const uid = "uid";
    const token = "userToken";

    const wrapper = getWrapper({ query: { uid, token } });

    // Mock redirect method
    const instance = wrapper.instance();
    instance._redirectTo = jest.fn();

    // Prepare form state
    wrapper.setState({ password1: "hunter2", password2: "hunter2" });

    // Simulate form submission
    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/password/reset/confirm/",
      { new_password1: "hunter2", new_password2: "hunter2", uid, token },
      { headers: { "Accept-Language": undefined } }
    );
    mockAxios.mockError();

    expect(wrapper.state("errorMsg")).toEqual(
      "reset_password_confirm.error_msg"
    );
    expect(wrapper.state("successMsg")).toEqual("");
    expect(wrapper.state("isSubmitting")).toBe(false);
    expect(wrapper.state("validForm")).toBe(false);
  });

  it("shows an error if password input has an invalid password", () => {
    const wrapper = getWrapper();

    wrapper.setState({ password1: "f" });

    expect(wrapper.state("err_pass1_msg")).toEqual(
      "reset_password_confirm.invalid_password"
    );
  });

  it("shows an error if passwords differ", () => {
    const wrapper = getWrapper();

    wrapper.setState({
      password1: "validPassword1234",
      password2: "different"
    });

    expect(wrapper.state("err_pass2_msg")).toEqual(
      "reset_password_confirm.same_password"
    );
  });
});
