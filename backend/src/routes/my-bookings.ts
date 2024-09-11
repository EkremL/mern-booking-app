import express from "express";
import verifyToken from "../middlewares/auth";
import * as myBookingsController from "../controllers/mybookings";

const router = express.Router();

router.get("/", verifyToken, myBookingsController.GetMyBookings);

export default router;
