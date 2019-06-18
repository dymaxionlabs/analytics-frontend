import { shallow, mount } from "enzyme";
import React from "react";
import Login from "../../pages/login";
import mockAxios from "jest-mock-axios";

afterEach(() => {
  mockAxios.reset();
});

describe("Login", () => {
  const getWrapper = props => {
    return mount(shallow(<Login {...props} />).get(0));
  };

  const assertInputChange = (wrapper, id, value) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: value } });
    expect(wrapper.state(id)).toEqual(value);
  };

  const assertCheckboxChange = (wrapper, id) => {
    const input = wrapper.find(`input#${id}`);
    expect(input.props().checked).toBe(false);

    input.simulate("change");
    expect(wrapper.state(id)).toBe(true);
  };

  it("has a title", () => {
    // const wrapper = mount(<Login query={{}} />);
    const wrapper = getWrapper({ query: {} });
    const title = wrapper.find("h1");
    expect(title.text()).toEqual("login.title");
  });

  it("has a username input sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "username", "john");
  });

  it("has a password input sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertInputChange(wrapper, "password", "hunter2");
  });

  it("has a 'Remember Me' checkbox sets state", () => {
    const wrapper = getWrapper({ query: {} });
    assertCheckboxChange(wrapper, "remember");
  });

  it("has a form that makes a POST request to /auth/login with user credentials", () => {
    const wrapper = getWrapper({ query: { redirect: "/foo" } });
    const form = wrapper.find("form");

    // Mock login function
    const mockLogin = jest.fn();
    wrapper.instance()._login = mockLogin;

    // Submit form
    wrapper.setState({ username: "john", password: "hunter2" });
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/login/",
      { username: "john", password: "hunter2" }
    );

    const response = { data: { key: "secretKey" } };
    mockAxios.mockResponse(response);

    expect(mockLogin).toHaveBeenCalledWith({
      expires: null,
      redirectTo: "/foo",
      token: response.data.key
    });
  });

  it("sets a longer expiration key when setting 'remember' state key", () => {
    const wrapper = getWrapper({ query: {} });

    const mockLogin = jest.fn();
    wrapper.instance()._login = mockLogin;

    wrapper.setState({ username: "john", password: "hunter2", remember: true });
    wrapper.find("form").simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalled();

    const response = { data: { key: "secretKey" } };
    mockAxios.mockResponse(response);

    expect(mockLogin).toHaveBeenCalledWith({
      expires: 30,
      redirectTo: undefined,
      token: response.data.key
    });
  });

  it("catches errors from API server and unlocks form", () => {
    const wrapper = getWrapper({ query: {} });
    wrapper.find("form").simulate("submit", { preventDefault: () => null });

    mockAxios.mockError();

    expect(wrapper.state("errorMsg")).toEqual("login.error_msg");
    expect(wrapper.state("isSubmitting")).toBe(false);
    expect(wrapper.state("successMsg")).toBe("");
  });
});
