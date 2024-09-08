import express from "express";
import * as hotelsController from "../controllers/hotels";
import { param } from "express-validator";

import verifyToken from "../middlewares/auth";

const router = express.Router();

router.get("/search", hotelsController.SearchHotel);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  hotelsController.HotelDetail
);

//! Stripe Route
router.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  hotelsController.StripePayment
);

//!Create Hotel Booking
router.post(
  "/:hotelId/bookings",
  verifyToken,
  hotelsController.CreateHotelBooking
);

export default router;
