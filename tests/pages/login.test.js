// import i18n from "i18next";
// import { I18nextProvider } from "react-i18next";
import { mount } from "enzyme";
import React from "react";
import Login from "../../pages/login";

describe("Login", () => {
  it("have a title", () => {
    const wrapper = mount(<Login query={{}} />);
    expect(wrapper.find("h1").text()).toEqual("login.title");
  });
});
