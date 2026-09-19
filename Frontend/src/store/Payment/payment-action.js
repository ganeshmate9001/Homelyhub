import { paymentActions } from "./payment-slice";
import { axiosInstance } from "../../utils/axios";

// ========================================
// CREATE ORDER
// ========================================

export const initiateCheckoutSession =
  (paymentData) => async (dispatch) => {

    try {

      dispatch(
        paymentActions.getCheckoutRequest()
      );

      console.log(
        "CREATE ORDER DATA:",
        paymentData
      );

      const response = await axiosInstance.post(
        "/v1/rent/user/booking/create-order",
        paymentData
      );

      console.log(
        "CREATE ORDER RESPONSE:",
        response.data
      );

      if (!response) {
        throw new Error(
          "Failed to initiate checkout session"
        );
      }

      dispatch(
        paymentActions.getCheckoutSuccess(
          response.data
        )
      );

    } catch (error) {

      console.error(
        "Create order error:",
        error.response?.data ||
          error.message
      );

      dispatch(
        paymentActions.getError(
          error.response?.data?.message ||
            error.message
        )
      );

      throw error;
    }
  };


// ========================================
// VERIFY PAYMENT
// ========================================

export const verifyPayment =
  (verifyData) => async (dispatch) => {

    try {

      console.log(
        "VERIFY DATA:",
        JSON.stringify(
          verifyData,
          null,
          2
        )
      );

      dispatch(
        paymentActions.getVerifyRequest()
      );

      const response =
        await axiosInstance.post(
          "/v1/rent/user/booking/verify-payment",
          verifyData
        );

      console.log(
        "VERIFY PAYMENT RESPONSE:",
        response.data
      );

      if (!response) {
        throw new Error(
          "Failed to verify payment"
        );
      }

      dispatch(
        paymentActions.getVerifySuccess(
          response.data
        )
      );

      return response.data;

    } catch (error) {

      console.error(
        "Verify payment error:",
        error.response?.data ||
          error.message
      );

      dispatch(
        paymentActions.getError(
          error.response?.data?.message ||
            error.message
        )
      );

      throw error;
    }
  };