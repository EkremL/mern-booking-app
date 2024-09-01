import express from "express";
import * as hotelsController from "../controllers/hotels";

const router = express.Router();

router.get("/search", hotelsController.SearchHotel);

export default router;
