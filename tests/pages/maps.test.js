import { mount, shallow } from "enzyme";
import React from "react";
import mockAxios from "jest-mock-axios";
import Maps from "../../pages/maps";

afterEach(() => {
  mockAxios.reset();
});

describe("Maps", () => {
  const getWrapper = props => {
    return mount(shallow(<Maps {...props} />).get(0));
  };

  const expectRetrieveMapRequest = (userToken, uuid) => {
    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/maps/${uuid}/`,
      {
        headers: {
          Authorization: userToken
        }
      }
    );
  };

  const userToken = "userToken";
  const uuid = "1234";

  const validRetrieveMapResponse = {
    data: {
      map: {
        uuid,
        extent: [0, 1, 2, 3],
        layers: [
          { is_active: false, layer: { uuid: 1 } },
          { is_active: true, layer: { uuid: 2 } },
          { is_active: true, layer: { uuid: 3 } }
        ]
      }
    }
  };

  it("makes a GET request to /maps/{uuid}/ and sets state, when mounted", () => {
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const instance = wrapper.instance();
    instance._toggleActiveLayers = jest.fn();

    expectRetrieveMapRequest(userToken, uuid);
    mockAxios.mockResponse(validRetrieveMapResponse);

    instance._loadMap();

    const { map } = validRetrieveMapResponse.data;
    expect(wrapper.state("map")).toEqual(map);
    expect(wrapper.state("bounds")).toEqual([[1, 0], [3, 2]]);
    expect(instance._toggleActiveLayers).toHaveBeenCalledWith(map.layers);
  });

  it("shows an alert if map does not exist or server fails", () => {
    const uuid = "999";
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const instance = wrapper.instance();
    instance._alert = jest.fn();

    // Not found
    expectRetrieveMapRequest(userToken, uuid);
    mockAxios.mockError({ response: { status: 404 } });

    instance._loadMap();

    expect(instance._alert).toHaveBeenCalledWith("Map was not found.");

    // Other exception
    expectRetrieveMapRequest(userToken, uuid);
    mockAxios.mockError({ response: { status: 500 } });

    instance._loadMap();

    expect(instance._alert).toHaveBeenCalledWith(
      "An error ocurred when trying to load map. Please try accessing again later."
    );
  });

  it("sets active layers in state for all active layers in map", () => {
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const { map } = validRetrieveMapResponse.data;
    wrapper.instance()._toggleActiveLayers(map.layers);

    expect(wrapper.state("activeLayers")).toEqual([2, 3]);
  });

  it("updates viewport state when map viewport changes", () => {
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const viewport = { bounds: [0, 1, 2, 3] };
    wrapper.instance().handleMapViewportChanged(viewport);

    expect(wrapper.state("viewport")).toEqual(viewport);
  });

  it("adds or removes a layer from activeLayers when toggled", () => {
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const instance = wrapper.instance();
    instance._trackEvent = jest.fn();

    // do nothing
    wrapper.instance().handleToggleLayer();

    wrapper.setState({ activeLayers: ["layer2"] });

    // toggle an inactive layer
    const layer1 = { uuid: "layer1" };
    wrapper.instance().handleToggleLayer(layer1);

    // expect to add layer1 as an active layer and track event
    expect(wrapper.state("activeLayers")).toEqual(["layer2", "layer1"]);
    expect(instance._trackEvent).toHaveBeenCalledWith("enable-layer", "layer1");

    // toggle an active layer
    const layer2 = { uuid: "layer2" };
    wrapper.instance().handleToggleLayer(layer2);

    // expect to remove layer2 as an active layer and track event
    expect(wrapper.state("activeLayers")).toEqual(["layer1"]);
    expect(instance._trackEvent).toHaveBeenCalledWith(
      "disable-layer",
      "layer2"
    );
  });

  it("updates layers opacity state when slider changed", () => {
    const wrapper = getWrapper({ token: userToken, query: { uuid } });

    const layerUuid = "layer1";
    wrapper.instance().handleOpacityChange(layerUuid, 75);

    expect(wrapper.state("layersOpacity")).toEqual({ layer1: 75 });
  });
});
