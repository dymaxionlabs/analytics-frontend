import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import cookie from "js-cookie";
import React from "react";
import LayersContent from "../../../components/home/LayersContent";

describe("LayersContent", () => {
  const getWrapper = props => {
    return mount(shallow(<LayersContent {...props} />).get(0));
  };

  const projectUuid = "1234";
  const userToken = "userToken";

  it("makes a GET request to /layers/ and sets state, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/layers/`,
      {
        params: { project_uuid: projectUuid },
        headers: { Authorization: userToken }
      }
    );

    const response = { data: { results: [{}] } };
    mockAxios.mockResponse(response);

    expect(wrapper.state("layers")).toEqual(response.data.results);
  });

  it("catches error if GET request fails, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/layers/`,
      {
        params: { project_uuid: projectUuid },
        headers: { Authorization: userToken }
      }
    );
    mockAxios.mockError({ response: { status: 500 } });
  });

  it("sets state when clicking Download link or when closing snackbar", () => {
    const wrapper = getWrapper({ token: userToken });

    wrapper.instance().handleDownloadClick();
    expect(wrapper.state("notImplementedOpen")).toBe(true);

    wrapper.instance().handleNotImplementedClose();
    expect(wrapper.state("notImplementedOpen")).toBe(false);
  });
});
