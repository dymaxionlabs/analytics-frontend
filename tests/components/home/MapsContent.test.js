import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import cookie from "js-cookie";
import React from "react";
import MapsContent from "../../../components/home/MapsContent";

describe("MapsContent", () => {
  const getWrapper = props => {
    return mount(shallow(<MapsContent {...props} />).get(0));
  };

  const projectUuid = "1234";
  const userToken = "userToken";

  it("makes a GET request to /maps/ and sets state, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(`http://localhost:8000/maps/`, {
      params: { project_uuid: projectUuid },
      headers: { Authorization: userToken }
    });

    const response = { data: { results: [{}] } };
    mockAxios.mockResponse(response);

    expect(wrapper.state("maps")).toEqual(response.data.results);
  });

  it("catches error if GET request fails, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(`http://localhost:8000/maps/`, {
      params: { project_uuid: projectUuid },
      headers: { Authorization: userToken }
    });
    mockAxios.mockError({ response: { status: 500 } });
  });
});
