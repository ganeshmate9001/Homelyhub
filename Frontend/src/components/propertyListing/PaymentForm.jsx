import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { DatePicker, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { setPaymentDetails } from "../../store/Payment/payment-slice";

const PaymentForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings = [],
}) => {
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  // Guest साठी separate state
  const [guests, setGuests] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { RangePicker } = DatePicker;

  const { isAuthenticated } = useSelector(
    (state) => state.user
  );

  // =========================
  // MONGODB VALUES
  // =========================

  const pricePerNight = Number(price) || 0;
  const maxGuests = Number(maximumGuest) || 1;

  console.log("PAYMENT FORM DATA:", {
    propertyId,
    propertyName,
    price,
    pricePerNight,
    maximumGuest,
    maxGuests,
    guests,
  });

  // =========================
  // DISABLE DATES
  // =========================

  const isDateDisabled = (current) => {
    const today = moment().startOf("day");

    // Previous dates disable
    if (current.isBefore(today)) {
      return true;
    }

    // Already booked dates disable
    return currentBookings.some((booking) => {
      const startDate = moment(booking.fromDate).startOf("day");
      const endDate = moment(booking.toDate).startOf("day");
      const currentDate = moment(current).startOf("day");

      return (
        currentDate.isSameOrAfter(startDate) &&
        currentDate.isSameOrBefore(endDate)
      );
    });
  };

  // =========================
  // FORM
  // =========================

  const form = useForm({
    defaultValues: {
      dateRange: [],
      name: "",
      phoneNumber: "",
    },

    onSubmit: async ({ value }) => {
      const [checkinDate, checkoutDate] = value.dateRange;

      // =========================
      // DATE VALIDATION
      // =========================

      if (!checkinDate || !checkoutDate) {
        alert(
          "Please select a valid check-in and check-out date."
        );
        return;
      }

      // =========================
      // CALCULATE NIGHTS
      // =========================

      const nights = moment(
        checkoutDate,
        "YYYY-MM-DD"
      ).diff(
        moment(checkinDate, "YYYY-MM-DD"),
        "days"
      );

      if (nights <= 0) {
        alert("Please select a valid date range.");
        return;
      }

      // =========================
      // GUEST COUNT
      // =========================

      const guestCount = Number(guests);

      if (
        !guestCount ||
        guestCount < 1 ||
        guestCount > maxGuests
      ) {
        alert(
          `Guests must be between 1 and ${maxGuests}`
        );
        return;
      }

      // =========================
      // PRICE VALIDATION
      // =========================

      if (pricePerNight <= 0) {
        alert("Property price is not available.");
        return;
      }

      // =========================
      // TOTAL PRICE
      // =========================

      const totalPrice =
        pricePerNight * nights;

      console.log("BOOKING CALCULATION:", {
        pricePerNight,
        nights,
        totalPrice,
        guests: guestCount,
      });

      if (totalPrice <= 0) {
        alert(
          "Payment amount must be greater than ₹0."
        );
        return;
      }

      // =========================
      // NAME
      // =========================

      if (!value.name.trim()) {
        alert("Please fill your name.");
        return;
      }

      // =========================
      // PHONE
      // =========================

      if (!value.phoneNumber.trim()) {
        alert("Please fill your phone number.");
        return;
      }

      // =========================
      // SAVE PAYMENT DETAILS
      // =========================

      await dispatch(
        setPaymentDetails({
          propertyId,
          checkinDate,
          checkoutDate,
          nights,
          totalPrice,
          propertyName,
          address,

          // Selected guest count
          guests: guestCount,

          name: value.name,
          phoneNumber: value.phoneNumber,
        })
      );

      // =========================
      // PAYMENT PAGE
      // =========================

      navigate(`/payment/${propertyId}`);
    },
  });

  return (
    <div className="form-container">

      <form
        className="payment-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >

        {/* =========================
            PRICE
        ========================= */}

        <div className="price-pernight">
          Price:
          <b>₹{pricePerNight}</b>
          <span> / Per night</span>
        </div>

        <div className="payment-field">

          {/* =========================
              DATE
          ========================= */}

          <form.Field name="dateRange">
            {(field) => (
              <div className="date">

                <Space
                  direction="vertical"
                  size={12}
                >

                  <RangePicker
                    format="YYYY-MM-DD"
                    picker="date"
                    disabledDate={isDateDisabled}
                    onChange={(dates, dateStrings) => {

                      field.handleChange(dateStrings);

                      const [
                        checkin,
                        checkout,
                      ] = dateStrings;

                      // Date incomplete
                      if (!checkin || !checkout) {
                        setCalculatedPrice(0);
                        return;
                      }

                      // Calculate nights
                      const nights = moment(
                        checkout,
                        "YYYY-MM-DD"
                      ).diff(
                        moment(
                          checkin,
                          "YYYY-MM-DD"
                        ),
                        "days"
                      );

                      console.log(
                        "CHECK-IN:",
                        checkin
                      );

                      console.log(
                        "CHECK-OUT:",
                        checkout
                      );

                      console.log(
                        "NIGHTS:",
                        nights
                      );

                      // Calculate price
                      if (
                        nights > 0 &&
                        pricePerNight > 0
                      ) {
                        const total =
                          pricePerNight * nights;

                        setCalculatedPrice(total);
                      } else {
                        setCalculatedPrice(0);
                      }
                    }}
                  />

                </Space>

              </div>
            )}
          </form.Field>

          {/* =========================
              GUESTS
          ========================= */}

          <div className="guest">

            <label className="payment-labels">
              Number of guests:
            </label>

            <br />

            <input
              type="number"
              className="no-of-guest"
              min="1"
              max={maxGuests}
              value={guests}
              onChange={(e) => {

                const value = e.target.value;

                // Backspace केल्यावर empty allow
                if (value === "") {
                  setGuests("");
                  return;
                }

                const newGuests = Number(value);

                // Maximum limit
                if (newGuests > maxGuests) {
                  setGuests(String(maxGuests));
                  return;
                }

                // Minimum limit
                if (newGuests < 1) {
                  setGuests("1");
                  return;
                }

                // Set selected guest
                setGuests(value);
              }}

              onBlur={() => {
                // Empty असेल तर 1 करा
                if (guests === "") {
                  setGuests("1");
                }
              }}
            />

            <small>
              (1 - {maxGuests} guests)
            </small>

          </div>

          {/* =========================
              NAME
          ========================= */}

          <div className="name-phoneno">

            <form.Field name="name">
              {(field) => (
                <>
                  <label className="payment-labels">
                    Your full name:
                  </label>

                  <br />

                  <input
                    type="text"
                    className="full-name"
                    placeholder="Name"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />
                </>
              )}
            </form.Field>

            <br />

            {/* =========================
                PHONE
            ========================= */}

            <form.Field name="phoneNumber">
              {(field) => (
                <>
                  <label className="payment-labels">
                    Phone Number:
                  </label>

                  <br />

                  <input
                    type="tel"
                    className="phone-number"
                    placeholder="Number"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value
                      )
                    }
                  />
                </>
              )}
            </form.Field>

          </div>

        </div>

        {/* =========================
            BOOK BUTTON
        ========================= */}

        <div className="book-place">

          {!isAuthenticated ? (

            <button
              type="button"
              onClick={() => navigate("/login")}
            >
              Login to Book
            </button>

          ) : (

            <button
              type="submit"
              disabled={calculatedPrice <= 0}
            >
              Book this place ₹ {calculatedPrice}
            </button>

          )}

        </div>

      </form>

    </div>
  );
};

export default PaymentForm;