import { mount, shallow } from "enzyme";
import mockAxios from "jest-mock-axios";
import React from "react";
import RequestsContent from "../../../components/home/RequestsContent";

describe("RequestsContent", () => {
  const getWrapper = props => {
    return mount(shallow(<RequestsContent {...props} />).get(0));
  };

  const userToken = "userToken";

  const validListRequestsResponse = {
    data: {
      results: [
        {
          created_at: "2019-01-01",
          layers: ["crops"],
          total_area_km2: 124,
          last_state_update: { state: "AWAITING_PAYMENT" },
          extra_fields: { payment_init_point: "https://example.com/pay/" }
        },
        {
          created_at: "2019-02-01",
          layers: [],
          total_area_km2: 35,
          last_state_update: null,
          extra_fields: {}
        }
      ]
    }
  };

  it("makes a GET request to /requests/ and sets state, when mounted", () => {
    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/requests/`,
      { headers: { Authorization: userToken } }
    );

    mockAxios.mockResponse(validListRequestsResponse);
    const { results } = validListRequestsResponse.data;

    expect(wrapper.state("requests")).toEqual(results);
  });

  it("catches error if GET request fails, when mounted", () => {
    const wrapper = getWrapper({ token: userToken });

    expect(mockAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/requests/`,
      { headers: { Authorization: userToken } }
    );
    mockAxios.mockError({ response: { status: 500 } });
  });
});
