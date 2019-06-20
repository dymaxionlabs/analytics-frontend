import { mount, shallow } from "enzyme";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import React from "react";
import mockAxios from "jest-mock-axios";
import {
  SelectProject,
  NewProjectForm,
  OpenProjectList
} from "../../pages/select-project";

afterEach(() => {
  mockAxios.reset();
});

describe("SelectProject", () => {
  const getWrapper = props => {
    return mount(shallow(shallow(<SelectProject {...props} />).get(0)).get(0));
  };

  it("contains a NewProjectForm and an OpenProjectList", () => {
    const wrapper = getWrapper({ token: "userToken" });
    expect(wrapper.contains(NewProjectForm)).toBe(true);
    expect(wrapper.contains(OpenProjectList)).toBe(true);
  });
});

describe("NewProjectForm", () => {
  const getWrapper = props => {
    return mount(shallow(<NewProjectForm {...props} />).get(0));
  };

  it("has a name input that sets state", () => {
    const wrapper = getWrapper({ token: "userToken" });

    const input = wrapper.find(`input#name`);
    expect(input.props().value).toEqual("");

    input.simulate("change", { target: { name: "name", value: "my project" } });
    expect(wrapper.state("name")).toEqual("my project");
  });

  it("has a form that makes a POST request to /projects with a new project name", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });

    const instance = wrapper.instance();
    instance._setProjectCookie = jest.fn();
    instance._redirectToHome = jest.fn();

    const state = { name: "my project" };
    wrapper.setState(state);

    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/projects/",
      state,
      {
        headers: {
          "Accept-Language": undefined, // FIXME i18n.language is undefined in tests
          Authorization: userToken
        }
      }
    );
    const response = { data: { uuid: "1234" } };
    mockAxios.mockResponse(response);

    expect(instance._setProjectCookie).toHaveBeenCalledWith("1234");
    expect(instance._redirectToHome).toHaveBeenCalled();

    // check error
    form.simulate("submit", { preventDefault: () => null });

    expect(mockAxios.post).toHaveBeenCalledWith(
      "http://localhost:8000/projects/",
      state,
      {
        headers: {
          "Accept-Language": undefined, // FIXME i18n.language is undefined in tests
          Authorization: userToken
        }
      }
    );
    mockAxios.mockError({});

    expect(wrapper.state("loading")).toBe(false);
  });
});

describe("OpenProjectList", () => {
  const getWrapper = props => {
    return mount(shallow(<OpenProjectList {...props} />).get(0));
  };

  const expectListProjectsRequest = userToken => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      "http://localhost:8000/projects/",
      {
        headers: {
          "Accept-Language": undefined, // FIXME i18n.language is undefined in tests
          Authorization: userToken
        }
      }
    );
  };

  it("makes a GET request to /projects/ to get list of projects, when mounted", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });

    expectListProjectsRequest(userToken);
    const data = {
      count: 2,
      results: [
        { uuid: "proj1", name: "project 1" },
        { uuid: "proj2", name: "project 2" }
      ]
    };
    mockAxios.mockResponse({ data });

    expect(wrapper.state("count")).toEqual(data.count);
    expect(wrapper.state("results")).toEqual(data.results);
  });

  it("catches error if GET /projects/ request fails", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });

    expectListProjectsRequest(userToken);
    mockAxios.mockError();

    expect(wrapper.state("loading")).toBe(false);
  });

  it("selects project when clicking on a project list item", () => {
    const userToken = "userToken";
    const wrapper = getWrapper({ token: userToken });

    const instance = wrapper.instance();
    instance._setProjectCookie = jest.fn();
    instance._redirectToHome = jest.fn();

    const state = {
      count: 2,
      results: [
        { uuid: "proj1", name: "project 1" },
        { uuid: "proj2", name: "project 2" }
      ],
      loading: false
    };
    wrapper.setState(state);

    instance.handleSelectProject("proj1");

    expect(instance._setProjectCookie).toHaveBeenCalledWith("proj1");
    expect(instance._redirectToHome).toHaveBeenCalled();
  });
});
