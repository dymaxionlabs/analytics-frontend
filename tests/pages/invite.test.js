import { mount, shallow } from "enzyme";
import React from "react";
import mockAxios from "jest-mock-axios";
import Invite from "../../pages/invite";

afterEach(() => {
  mockAxios.reset();
});

describe("Invite", () => {
  const getWrapper = props => {
    return mount(shallow(shallow(<Invite {...props} />).get(0)).get(0));
  };

  const assertInputChange = (wrapper, id, value) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: value } });
    expect(wrapper.state(id)).toEqual(value);
  };

  it("shows an 'invalid key' error if not key is provided in querystring", () => {
    const wrapper = getWrapper({ query: {} });
    expect(wrapper.state("fatalError")).toEqual("invite.invalid_key");
    expect(wrapper.state("loading")).toBe(false);
  });

  it("has a username input that sets state", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    assertInputChange(wrapper, "username", "john");
  });

  it("has an email input that sets state", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    assertInputChange(wrapper, "email", "john@example.com");
  });

  it("has a password input that sets state", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    assertInputChange(wrapper, "password1", "hunter2");
  });

  it("has a second password input that sets state", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    assertInputChange(wrapper, "password2", "hunter2");
  });

  it("has a form that makes a POST request to /auth/login with user credentials", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    const form = wrapper.find("form");

    const instance = wrapper.instance();
    instance._confirmInvitationToken = jest.fn();

    // Submit form
    const state = {
      username: "john",
      email: "john@example.com",
      password1: "hunter2",
      password2: "hunter2"
    };
    wrapper.setState(state);

    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/",
      state,
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );

    const response = { data: { key: "secretKey" } };
    mockAxios.mockResponse(response);

    // expect(instance._confirmInvitationToken).toHaveBeenCalledWith(
    //   response.data.key
    // );
  });
});
