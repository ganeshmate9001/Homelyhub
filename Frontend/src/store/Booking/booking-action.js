import { axiosInstance } from "../../utils/axios";
import {
  setBookingDetails,
  setBookings,
} from "./booking-slice";

export const fetchBookingDetails =
  (bookingId) => async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        `/v1/rent/user/booking/${bookingId}`
      );

      console.log(
        "BOOKING DETAILS RESPONSE:",
        response.data
      );

      dispatch(
        setBookingDetails(
          response.data.data.booking
        )
      );
    } catch (error) {
      console.error(
        "GET BOOKING DETAILS ERROR:",
        error.response?.data || error.message
      );
    }
  };

export const fetchUserBookings =
  () => async (dispatch) => {
    try {
      const response = await axiosInstance.get(
        "/v1/rent/user/booking"
      );

      console.log(
        "BOOKINGS RESPONSE:",
        response.data
      );

      const bookings =
        response.data?.data?.bookings || [];

      console.log(
        "BOOKINGS ARRAY:",
        bookings
      );

      dispatch(setBookings(bookings));

    } catch (error) {
      console.error(
        "GET USER BOOKINGS ERROR:",
        error.response?.data || error.message
      );

      dispatch(setBookings([]));
    }
  };