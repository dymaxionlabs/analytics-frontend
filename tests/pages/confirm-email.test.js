import { mount, shallow } from "enzyme";
import React from "react";
import mockAxios from "jest-mock-axios";
import ConfirmEmail from "../../pages/confirm-email";

afterEach(() => {
  mockAxios.reset();
});

describe("ConfirmEmail", () => {
  const getWrapper = props => {
    return mount(shallow(<ConfirmEmail {...props} />).get(0));
  };

  it("checks at mount if 'k' is present in query string", () => {
    const wrapper = getWrapper({ query: {} });
    expect(wrapper.state("errorMsg")).toEqual("confirm_email.invalid_key");
    expect(wrapper.state("loading")).toBe(false);

    const wrapper2 = getWrapper({ query: { k: "" } });
    expect(wrapper2.state("errorMsg")).toEqual("confirm_email.invalid_key");
    expect(wrapper2.state("loading")).toBe(false);
  });

  it("makes a POST request to /auth/registration/verify-email/ with 'k' query string param", () => {
    const key = "secretKey";
    const wrapper = getWrapper({ query: { k: key } });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/verify-email/",
      { key },
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );
    mockAxios.mockResponse({});

    expect(wrapper.state("errorMsg")).toEqual("");
    expect(wrapper.state("successMsg")).toEqual("confirm_email.success_msg");
  });

  it("catches error if verify request fails", () => {
    const key = "secretKey";
    const wrapper = getWrapper({ query: { k: key } });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/auth/registration/verify-email/",
      { key },
      { headers: { "Accept-Language": undefined } } // FIXME i18n.language is undefined in tests
    );
    mockAxios.mockError();

    expect(wrapper.state("errorMsg")).toEqual("confirm_email.error_msg");
    expect(wrapper.state("successMsg")).toEqual("");
  });
});
