import { shallow, mount } from "enzyme";
import React from "react";
import Login from "../../pages/login";
import mockAxios from "jest-mock-axios";

afterEach(() => {
  mockAxios.reset();
});

describe("Login", () => {
  it("has a title", () => {
    const wrapper = mount(<Login query={{}} />);
    const title = wrapper.find("h1");
    expect(title.text()).toEqual("login.title");
  });

  it("has a username input sets state", () => {
    const wrapper = shallow(<Login query={{}} />).dive();
    const input = wrapper.find("#username").dive();
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: "john" } });
    expect(wrapper.state("username")).toEqual("john");
  });

  it("has a password input sets state", () => {
    const wrapper = shallow(<Login query={{}} />).dive();
    const input = wrapper.find("#password").dive();
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { value: "hunter2" } });
    expect(wrapper.state("password")).toEqual("hunter2");
  });

  // it("has a 'Remember Me' checkbox sets state", () => {
  //   const wrapper = shallow(<Login query={{}} />).dive();
  //   wrapper.update();
  //   // FIXME: Enzyme fails to find checkbox!!!
  //   const input = wrapper.find("#remember").dive();
  //   expect(input.props().checked).toBe(false);

  //   input.simulate("change");
  //   expect(wrapper.state("remember")).toBe(true);
  // });

  it("has a form that makes a POST request to /auth/login with user credentials", () => {
    const wrapper = shallow(<Login query={{ redirect: "/foo" }} />).shallow();
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
    const wrapper = shallow(<Login query={{}} />).shallow();

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
    const wrapper = shallow(<Login query={{}} />).shallow();
    wrapper.find("form").simulate("submit", { preventDefault: () => null });

    mockAxios.mockError();

    expect(wrapper.state("errorMsg")).toEqual("login.error_msg");
    expect(wrapper.state("isSubmitting")).toBe(false);
    expect(wrapper.state("successMsg")).toBe("");
  });
});
