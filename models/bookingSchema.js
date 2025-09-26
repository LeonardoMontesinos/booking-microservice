// models/bookingSchema.js
import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seat_row: { type: String, required: true },
  seat_number: { type: Number, required: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Formato: bkg_YYYYMMDD_XXXX
  showtime_id: { type: String, required: true },
  movie_id: { type: String, required: true },
  cinema_id: { type: String, required: true },
  sala_id: { type: String, required: true },
  sala_number: { type: Number, required: true },
  seats: [seatSchema],
  user: userSchema,
  payment_method: {
    type: String,
    enum: ["card", "cash", "yape", "plin", "stripe"],
    required: true
  },
  source: {
    type: String,
    enum: ["web", "mobile", "kiosk", "partner"],
    required: true
  },
  status: {
    type: String,
    enum: ["CONFIRMED", "CANCELLED", "REFUNDED", "HOLD"],
    default: "HOLD"
  },
  price_total: { type: Number, required: true },
  currency: { type: String, default: "PEN" },
  created_at: { type: Date, default: Date.now }
}, { 
  timestamps: false, // Usamos created_at personalizado
  _id: true // Permitimos _id personalizado
});

const Booking = mongoose.model("Booking", bookingSchema, "bookings");
export default Booking;