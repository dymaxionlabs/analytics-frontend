import { mount, shallow } from "enzyme";
import React from "react";
import SelectProjectButton from "../../components/SelectProjectButton";
import cookie from "js-cookie";
import mockAxios from "jest-mock-axios";

afterEach(() => {
  mockAxios.reset();
});

describe("SelectProjectButton", () => {
  const getWrapper = props => {
    return mount(shallow(<SelectProjectButton {...props} />).get(0));
  };

  const token = "userToken";
  const uuid = "projectUuid";

  it("makes a GET request to /projects/{uuid}/ to get project name, when mounted", () => {
    cookie.get = jest.fn(() => uuid);

    const wrapper = getWrapper({ token });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/projects/${uuid}/`,
      { headers: { Authorization: token } }
    );

    const name = "My project";
    mockAxios.mockResponse({ data: { name } });

    expect(wrapper.state("name")).toEqual(name);
  });

  it("catches error if GET request fails, when mounted", () => {
    cookie.get = jest.fn(() => uuid);

    const wrapper = getWrapper({ token });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/projects/${uuid}/`,
      { headers: { Authorization: token } }
    );
    mockAxios.mockError();
  });
});
