// models/bookings.js
import Booking from "./bookingSchema.js";

class bookingsModel {
  generateBookingId() {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `bkg_${dateStr}_${randomNum}`;
  }

  async create(data) {
    // Generar ID único si no se proporciona
    if (!data._id) {
      data._id = this.generateBookingId();
    }
    
    const booking = new Booking(data);
    return await booking.save();
  }

  async getAll() {
    return await Booking.find();
  }

  async getOneById(id) {
    return await Booking.findById(id);
  }

  async getByUserId(user_id) {
    return await Booking.find({ "user.user_id": user_id });
  }

  async updateStatus(id, newStatus) {
    return await Booking.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );
  }

  async delete(id) {
    return await Booking.findByIdAndDelete(id);
  }

  async getActiveByUser(user_id) {
    return await Booking.find({ 
      "user.user_id": user_id, 
      status: { $nin: ["CANCELLED", "REFUNDED"] } 
    });
  }

  async checkSeatAvailability(showtime_id, cinema_id, sala_id, seats) {
    const existingBookings = await Booking.find({
      showtime_id,
      cinema_id,
      sala_id,
      status: { $in: ["CONFIRMED", "HOLD"] }
    });

    const occupiedSeats = new Set();
    existingBookings.forEach(booking => {
      booking.seats.forEach(seat => {
        occupiedSeats.add(`${seat.seat_row}${seat.seat_number}`);
      });
    });

    return seats.filter(seat => {
      const seatKey = `${seat.seat_row}${seat.seat_number}`;
      return !occupiedSeats.has(seatKey);
    });
  }

  async createHold(showtime_id, movie_id, cinema_id, sala_id, sala_number, seats, user, payment_method, source, price_total) {
    const availableSeats = await this.checkSeatAvailability(showtime_id, cinema_id, sala_id, seats);
    if (availableSeats.length === 0) {
      throw new Error("No hay asientos disponibles");
    }

    const holdData = {
      showtime_id,
      movie_id,
      cinema_id,
      sala_id,
      sala_number,
      seats: availableSeats,
      user,
      payment_method,
      source,
      price_total,
      currency: "PEN",
      status: "HOLD"
    };

    return await this.create(holdData);
  }

  async confirmHold(hold_id) {
    return await this.updateStatus(hold_id, "CONFIRMED");
  }

  async cancelBooking(booking_id) {
    return await this.updateStatus(booking_id, "CANCELLED");
  }

  async refundBooking(booking_id) {
    return await this.updateStatus(booking_id, "REFUNDED");
  }

  async getByShowtime(showtime_id) {
    return await Booking.find({ showtime_id });
  }

  async getByCinema(cinema_id) {
    return await Booking.find({ cinema_id });
  }
}

export default new bookingsModel();