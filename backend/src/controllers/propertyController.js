import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";

// Get all properties
const getProperties = async (req, res) => {
  try {
    const features = new APIFeatures(
      Property.find(),
      req.query
    )
      .filter()
      .search()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: "success",
      no_of_responses: doc.length,
      data: doc,
    });
  } catch (error) {
    console.error("Error searching properties:", error);

    res.status(500).json({
      status: "fail",
      message: "Internal server Error",
    });
  }
};

// Get property by ID
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: "fail",
        message: "Property not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Create new accommodation
const createProperty = async (req, res) => {
  try {
    console.log("CREATE PROPERTY BODY:", req.body);
    console.log("LOGGED IN USER:", req.user);

    // Check user login
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "User not logged in",
      });
    }

    const property = await Property.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      status: "success",
      message: "Property created successfully",
      data: property,
    });
  } catch (error) {
    console.error("CREATE PROPERTY ERROR:", error);

    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Get only logged-in user's accommodations
const getMyAccommodation = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "fail",
        message: "User not logged in",
      });
    }

    const properties = await Property.find({
      userId: req.user._id,
    });

    res.status(200).json({
      status: "success",
      no_of_responses: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("GET MY ACCOMMODATION ERROR:", error);

    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

export {
  getProperties,
  getProperty,
  createProperty,
  getMyAccommodation,
};