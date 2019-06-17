import { mount } from "enzyme";
import React from "react";
import { I18nextProvider } from "react-i18next";
import Index from "../../pages/index";
// import i18n from "../i18n";
import jest from "jest";

describe("Index", () => {
  it("redirects to home when authenticated", () => {
    // const wrapper = mount(
    //   <I18nextProvider i18n={i18n}>
    //     <Index />
    //   </I18nextProvider>
    // );
    // const instance = wrapper.instance();
    // const redirectTo = jest.spyOn(instance, "_redirectTo");
    // expect(redirectTo).toHaveBeenCalledWith("/home");
    // spy.mockRestore();
  });
});
