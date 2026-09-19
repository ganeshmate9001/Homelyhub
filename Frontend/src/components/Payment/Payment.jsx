import React, { useEffect, useState } from "react";
import "../../css/Payment.css";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../utils/axios";

const Payment = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();

  const [showPaymentGateaway, setShowPaymentGateaway] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

  const paymentDetails = useSelector(
    (state) => state.payment.paymentDetails
  );

  console.log("PAYMENT DETAILS:", paymentDetails);

  const {
    checkinDate,
    checkoutDate,
    totalPrice,
    propertyName,
    guests,
    nights,
    address,
  } = paymentDetails || {};

  // Check booking details
  useEffect(() => {
    if (
      !paymentDetails ||
      !totalPrice ||
      !checkinDate ||
      !checkoutDate ||
      !propertyId
    ) {
      toast.error("Booking details not found");
      navigate(`/propertylist/${propertyId}`);
    }
  }, [
    paymentDetails,
    totalPrice,
    checkinDate,
    checkoutDate,
    propertyId,
    navigate,
  ]);

  // =====================================
  // CREATE ORDER
  // =====================================

  const handleBooking = async () => {
    try {
      setLoading(true);

      const paymentData = {
        amount: Number(totalPrice),
        propertyId: propertyId,
        fromDate: checkinDate,
        toDate: checkoutDate,
        guests: Number(guests),
      };

      console.log("CREATE ORDER DATA:", paymentData);

      const response = await axiosInstance.post(
        "/v1/rent/user/booking/create-order",
        paymentData
      );

      console.log("CREATE ORDER RESPONSE:", response.data);

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Order creation failed"
        );
      }

      setOrderData(response.data);
      setShowPaymentGateaway(true);

    } catch (error) {
      console.error(
        "CREATE ORDER ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to create order"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CONFIRM PAYMENT
  // =====================================

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      const verifyData = {
        orderId: orderData.orderId,

        bookingDetails: {
          propertyId: propertyId,
          price: Number(totalPrice),
          fromDate: checkinDate,
          toDate: checkoutDate,
          guests: Number(guests),
          nights: Number(nights),
        },

        forceStatus: "success",
      };

      console.log(
        "VERIFY PAYMENT DATA:",
        verifyData
      );

      const response = await axiosInstance.post(
        "/v1/rent/user/booking/verify-payment",
        verifyData
      );

      console.log(
        "VERIFY PAYMENT RESPONSE:",
        response.data
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message ||
            "Payment verification failed"
        );
      }

      toast.success(
        "🎉 Payment Successful! Booking Confirmed!"
      );

      setOrderData(null);
      setShowPaymentGateaway(false);

      navigate("/user/mybookings");

    } catch (error) {
      console.error(
        "VERIFY PAYMENT ERROR:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message ||
          "Payment verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // CANCEL PAYMENT
  // =====================================

  const handleCancelPayment = () => {
    toast.error("Payment Cancelled");

    setOrderData(null);
    setShowPaymentGateaway(false);

    navigate(`/propertylist/${propertyId}`);
  };

  // =====================================
  // PAYMENT GATEWAY
  // =====================================

  if (showPaymentGateaway && orderData) {
    return (
      <div className="payment-gateway-overlay">
        <div className="payment-gateway-modal">

          <div className="gateway-header">

            <div className="gateway-logo">
              <h2>🏠 HomelyHub</h2>
              <span>Payment Gateway</span>
            </div>

            <div className="secure-badge">
              <span>🔒 Secure Payment</span>
            </div>

          </div>

          <div className="gateway-content">

            <div className="merchant-info">

              <h3>
                Payment to:
                <strong> HomelyHub</strong>
              </h3>

              <p>
                Order ID:
                <strong>{orderData.orderId}</strong>
              </p>

            </div>

            <div className="payment-summary">

              <div className="summary-item">
                <span>Property:</span>
                <span>{propertyName}</span>
              </div>

              <div className="summary-item">
                <span>Check-in:</span>
                <span>{checkinDate}</span>
              </div>

              <div className="summary-item">
                <span>Check-out:</span>
                <span>{checkoutDate}</span>
              </div>

              <div className="summary-item">
                <span>Guests:</span>
                <span>{guests}</span>
              </div>

              <div className="summary-item">
                <span>Nights:</span>
                <span>{nights}</span>
              </div>

              <div className="summary-item total-amount">
                <span>
                  <strong>Total Amount:</strong>
                </span>

                <span>
                  <strong>
                    ₹{Number(totalPrice).toLocaleString("en-IN")}
                  </strong>
                </span>
              </div>

            </div>

            <div className="gateway-actions">

              <button
                onClick={handleCancelPayment}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel Payment
              </button>

              <button
                onClick={handleConfirmPayment}
                className="confirm-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🔒</span>
                    Confirm Payment ₹
                    {Number(totalPrice).toLocaleString("en-IN")}
                  </>
                )}
              </button>

            </div>

            <div className="security-info">
              <p>
                <span>🛡️</span>
                Your payment information is encrypted and secure
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // BOOKING PAGE
  // =====================================

  return (
    <div className="payment-container">

      <div className="payment-header">
        <h1>Complete Your Booking</h1>
        <p>{propertyName}</p>
      </div>

      <div className="payment-content">

        <div className="booking-summary-card">

          <h3>Booking Details</h3>

          <div className="detail-row">
            <span>Check-in:</span>
            <span>{checkinDate}</span>
          </div>

          <div className="detail-row">
            <span>Check-out:</span>
            <span>{checkoutDate}</span>
          </div>

          <div className="detail-row">
            <span>Guests:</span>
            <span>{guests}</span>
          </div>

          <div className="detail-row">
            <span>Nights:</span>
            <span>{nights}</span>
          </div>

          <div className="detail-row total-row">
            <strong>Total Amount:</strong>

            <strong>
              ₹{Number(totalPrice).toLocaleString("en-IN")}
            </strong>
          </div>

        </div>

        <div className="payment-action">

          <button
            onClick={handleBooking}
            disabled={loading}
            className="book-now-btn"
          >
            {loading
              ? "Processing..."
              : `Proceed to Payment ₹${Number(
                  totalPrice
                ).toLocaleString("en-IN")}`}
          </button>

        </div>

      </div>
    </div>
  );
};

export default Payment;