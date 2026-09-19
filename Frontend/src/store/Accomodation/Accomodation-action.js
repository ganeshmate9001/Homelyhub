import { accomodationActions } from "./Accomodation-slice";
import { axiosInstance } from "../../utils/axios";

export const createAccomodation = (accomodationData) => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());

    const response = await axiosInstance.post(
      "/v1/rent/listing/newAccommodation",
      accomodationData
    );

    console.log("CREATE ACCOMMODATION:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "CREATE ACCOMMODATION ERROR:",
      error.response?.data || error.message
    );

    dispatch(
      accomodationActions.getErrors(
        error.response?.data?.message || error.message
      )
    );

    throw error;
  }
};

export const getAllAccomodation = () => async (dispatch) => {
  try {
    dispatch(accomodationActions.getAccomodationRequest());

    const { data } = await axiosInstance.get(
      "/v1/rent/listing/myAccommodation"
    );

    console.log("MY ACCOMMODATION:", data);

    const accom = data.data || [];

    dispatch(accomodationActions.getAccomodation(accom));

    return accom;
  } catch (error) {
    console.error(
      "GET MY ACCOMMODATION ERROR:",
      error.response?.data || error.message
    );

    dispatch(
      accomodationActions.getErrors(
        error.response?.data?.message || error.message
      )
    );

    throw error;
  }
};