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

  const assertValidInvitationRequest = key => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/projects/invitations/${key}/`
    );
    mockAxios.mockResponse({
      data: { email: "john@example.com", project: 1234 }
    });
  };

  it("shows an 'invalid key' error if not key is provided in querystring", () => {
    const wrapper = getWrapper({ query: {} });
    expect(wrapper.state("fatalError")).toEqual("invite.invalid_key");
    expect(wrapper.state("loading")).toBe(false);
  });

  it("shows an 'already confirmed' error if already confirmed", () => {
    const wrapper = getWrapper({ query: { key: "alreadyConfirmedKey" } });

    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8000/projects/invitations/alreadyConfirmedKey/"
    );

    const response = { data: { email: "john@example.com", confirmed: true } };
    mockAxios.mockResponse(response);

    expect(wrapper.state("fatalError")).toEqual("invite.already_confirmed");
    expect(wrapper.state("loading")).toBe(false);
  });

  it("shows an 'invalid key' error if invite key request fails", () => {
    const wrapper = getWrapper({ query: { key: "invalidKey" } });

    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8000/projects/invitations/invalidKey/"
    );

    mockAxios.mockError();

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

  it("has a form that makes a POST request to /auth/registration with user credentials and tries to confirm invitation token", () => {
    const wrapper = getWrapper({ query: { key: "secretKey" } });
    assertValidInvitationRequest("secretKey");

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

    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/",
      state,
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );
    const response = { data: { key: "secretKey" } };
    mockAxios.mockResponse(response);

    expect(instance._confirmInvitationToken).toHaveBeenCalledWith(
      response.data.key
    );

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
    expect(wrapper.state("loading")).toBe(false);
  });

  it("confirms invitation token by making a POST request to /projects/invitations/{key}/confirm", () => {
    const inviteKey = "inviteKey";
    const userToken = "userToken";
    const redirect = "/home";

    const wrapper = getWrapper({
      query: { key: inviteKey, redirect }
    });
    assertValidInvitationRequest(inviteKey);

    const instance = wrapper.instance();
    instance._login = jest.fn();

    instance._confirmInvitationToken(userToken);

    expect(mockAxios.post).toHaveBeenCalledWith(
      `http://localhost:8000/projects/invitations/${inviteKey}/confirm/`,
      {},
      {
        headers: {
          "Accept-Language": undefined, // FIXME i18n.language is undefined in tests
          Authorization: userToken
        }
      }
    );
    mockAxios.mockResponse({});

    // FIXME not working?
    // expect(instance._login).toHaveBeenCalledWith({
    //   token: userToken,
    //   redirectTo: redirect
    // });
  });
});
