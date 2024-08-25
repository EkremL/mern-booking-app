import express from "express";
import * as myhotelsController from "../controllers/myhotels";
import verifyToken from "../middlewares/auth";
import { body } from "express-validator";

const router = express.Router();

//!create hotel
//?api/myhotels
router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Hotel type is required"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities are required"),
  ],
  myhotelsController.upload.array("imageFiles", 6),
  myhotelsController.CreateHotel
);

export default router;
