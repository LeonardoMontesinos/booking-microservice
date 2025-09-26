// models/bookingSchema.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  film_id: { type: String, required: true },
  theater_id: { type: String, required: true },
  seats: [{ type: String, required: true }],
  show_time: { type: Date, required: true },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "hold"],
    default: "confirmed"
  }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema, "bookings");
export default Booking;