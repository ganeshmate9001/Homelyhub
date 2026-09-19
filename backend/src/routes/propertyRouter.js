import express from "express";

import {
  getProperties,
  getProperty,
  getMyAccommodation,
  createProperty
} from "../controllers/propertyController.js";

import { protect } from "../controllers/authController.js";

const propertyRouter = express.Router();

propertyRouter
  .route("/myAccommodation")
  .get(protect, getMyAccommodation);

propertyRouter
  .route("/newAccommodation")
  .post(protect, createProperty);

propertyRouter
  .route("/")
  .get(getProperties);

propertyRouter
  .route("/:id")
  .get(getProperty);

export { propertyRouter };