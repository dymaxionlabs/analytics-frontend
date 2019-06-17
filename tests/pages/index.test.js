import { mount } from "enzyme";
import React from "react";
import Index from "../../pages/index";

describe("Index", () => {
  it("redirects to home when authenticated", () => {
    // FIXME Does not currently work because Index has multiple HoC wrappers...
    // const redirectTo = jest
    //   .spyOn(Index.prototype, "_redirectTo")
    //   .mockImplementation(() => {});
    //
    // const wrapper = mount(<Index token="mytoken" query={{}} />);
    // expect(redirectTo).toBeCalledWith("/home");
    // redirectTo.mockClear();
  });
});
