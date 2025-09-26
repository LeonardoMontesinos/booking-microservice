// models/bookings.js
import Booking from "./bookingSchema.js";

class bookingsModel {
  async create(data) {
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
    return await Booking.find({ user_id });
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
      user_id, 
      status: { $ne: "cancelled" } 
    });
  }

  async checkSeatAvailability(theater_id, show_time, seats) {
    const existingBookings = await Booking.find({
      theater_id,
      show_time: {
        $gte: new Date(show_time.getTime() - 2 * 60 * 60 * 1000), // 2 horas antes
        $lte: new Date(show_time.getTime() + 2 * 60 * 60 * 1000)  // 2 horas después
      },
      status: "confirmed"
    });

    const occupiedSeats = new Set();
    existingBookings.forEach(booking => {
      booking.seats.forEach(seat => occupiedSeats.add(seat));
    });

    return seats.filter(seat => !occupiedSeats.has(seat));
  }

  async createHold(user_id, film_id, theater_id, seats, show_time) {
    const availableSeats = await this.checkSeatAvailability(theater_id, show_time, seats);
    if (availableSeats.length === 0) {
      throw new Error("No hay asientos disponibles");
    }

    const hold = new Booking({
      user_id,
      film_id,
      theater_id,
      seats: availableSeats,
      show_time,
      status: "hold"
    });

    return await hold.save();
  }
}

export default new bookingsModel();