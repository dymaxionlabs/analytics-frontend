import { mount, shallow } from "enzyme";
import React from "react";
import QuoteButton from "../../components/QuoteButton";
import Button from "@material-ui/core/Button";

describe("QuoteButton", () => {
  const getWrapper = props => {
    return mount(shallow(<QuoteButton {...props} />).get(0));
  };

  const token = "userToken";

  it("redirects to /quote if authenticated, when clicked", () => {
    const wrapper = getWrapper({ token, isAuthenticated: true });

    const instance = wrapper.instance();
    instance._redirectTo = jest.fn();

    const button = wrapper.find(Button);
    expect(button.exists()).toBe(true);

    button.simulate("click");

    expect(instance._redirectTo).toHaveBeenCalledWith("/quote");
  });

  it("redirects to /login if authenticated, when clicked", () => {
    const wrapper = getWrapper({ token, isAuthenticated: false });

    const instance = wrapper.instance();
    instance._redirectTo = jest.fn();

    const button = wrapper.find(Button);
    expect(button.exists()).toBe(true);

    button.simulate("click");

    expect(instance._redirectTo).toHaveBeenCalledWith(
      "/login?redirect=%2Fquote"
    );
  });
});
