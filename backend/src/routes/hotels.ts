import express from "express";
import * as hotelsController from "../controllers/hotels";
import { param } from "express-validator";

const router = express.Router();

router.get("/search", hotelsController.SearchHotel);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  hotelsController.HotelDetail
);

export default router;
