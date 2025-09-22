import express from "express";
import {
  createBooking,
  getBookedDates,
  getUserBookings,
  getPostBookings,
  cancelBooking,
  checkAvailability,
} from "../controllers/booking.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);

router.get("/booked-dates/:postId", getBookedDates);

router.get("/user-bookings", verifyToken, getUserBookings);

router.get("/post-bookings/:postId", verifyToken, getPostBookings);

router.delete("/:bookingId", verifyToken, cancelBooking);

router.get("/check-availability/:postId", checkAvailability);

export default router;
