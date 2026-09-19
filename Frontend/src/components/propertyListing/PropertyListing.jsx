import React, { useEffect } from "react";
import "../../css/PropertyListing.css";
import PropertyImg from "./PropertyImg";
import PaymentForm from "./PaymentForm";
import PropertyAmenities from "./PropertyAmenities";
import PropertMapInfo from "./PropertyMapInfo";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import {
  getPropertyDetails,
} from "../../store/PropertyDetails/propertyDetails-action";
import { useDispatch, useSelector } from "react-redux";

const PropertyListing = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, propertydetails, error } = useSelector(
    (state) => state.propertydetails
  );

  useEffect(() => {
    console.log("PROPERTY ID:", id);
    dispatch(getPropertyDetails(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="row justify-content-around mt-5">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h4>Property not found</h4>
        <p>{error}</p>
      </div>
    );
  }

  if (!propertydetails) {
    return (
      <div className="text-center mt-5">
        <h4>Property not found</h4>
      </div>
    );
  }

  // MongoDB मधील actual field names
  const {
    propertyName,
    address,
    description,
    images,
    amenities,
    maximumGuest,
    price,
    currentBookings,
  } = propertydetails;

  console.log("PROPERTY DETAILS:", propertydetails);
  console.log("PRICE:", price);
  console.log("MAXIMUM GUEST:", maximumGuest);

  return (
    <div className="property-container">

      {/* Property Name */}
      <p className="property-header">
        {propertyName}
      </p>

      {/* Property Location */}
      <h6 className="property-location">
        <span className="material-symbols-outlined">
          house
        </span>

        <span className="location">
          {`${address?.area || ""}, ${address?.city || ""}, ${
            address?.state || ""
          }`}
        </span>
      </h6>

      {/* Images */}
      <PropertyImg images={images || []} />

      <div className="middle-container row">

        {/* Description + Amenities */}
        <div className="des-and-amenities col-md-8 col-sm-12 col-12">

          <h2 className="property-description-header">
            Description
          </h2>

          <p className="property-description">
            {description}

            <br />
            <br />

            Max number of guests:{" "}
            <b>{maximumGuest}</b>
          </p>

          <hr />

          <PropertyAmenities
            amenities={amenities || []}
          />
        </div>

        {/* Payment Form */}
        <div className="property-payment col-md-4 col-sm-12 col-12">

          <PaymentForm
            propertyId={id}
            price={price}
            propertyName={propertyName}
            address={address}
            maximumGuest={maximumGuest}
            currentBookings={currentBookings || []}
          />

        </div>
      </div>

      <hr />

      {/* Map */}
      <div className="property-map">
        <div className="map-image-exinfo-container row">

          <PropertMapInfo
            address={address}
          />

        </div>
      </div>

    </div>
  );
};

export default PropertyListing;