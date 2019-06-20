import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import cookie from "js-cookie";
import React from "react";
import ImagesContent from "../../../components/home/ImagesContent";

afterEach(() => {
  mockAxios.reset();
});

describe("ImagesContent", () => {
  const getWrapper = props => {
    return mount(shallow(<ImagesContent {...props} />).get(0));
  };

  const projectUuid = "1234";
  const userToken = "userToken";

  it("makes a GET request to /files/ and sets state, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(`http://localhost:8000/files/`, {
      params: { project_uuid: projectUuid },
      headers: { Authorization: userToken }
    });

    const response = { data: { results: [{}] } };
    mockAxios.mockResponse(response);

    expect(wrapper.state("images")).toEqual(response.data.results);
  });

  it("catches error if GET request fails, when mounted", () => {
    cookie.get = jest.fn(() => projectUuid);

    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(`http://localhost:8000/files/`, {
      params: { project_uuid: projectUuid },
      headers: { Authorization: userToken }
    });
    mockAxios.mockError({ response: { status: 500 } });
  });

  it("sets state when NotImplementedSnackbar is closed", () => {
    const wrapper = getWrapper({ token: userToken });

    wrapper.instance().handleNotImplementedClose();

    expect(wrapper.state("notImplementedOpen")).toBe(false);
  });
});
