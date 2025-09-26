// controllers/bookingsController.js
import bookingsModel from "../models/bookings.js";

class bookingsController {
  async create(req, res) {
    try {
      const savedBooking = await bookingsModel.create(req.body);
      res.status(201).json(savedBooking);
    } catch (e) {
      console.error("ERROR EN POST /bookings:", e);
      res.status(400).json({ error: e.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await bookingsModel.getAll();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async getOne(req, res) {
    try {
      const booking = await bookingsModel.getOneById(req.params.id);
      if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
      res.json(booking);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getByUser(req, res) {
    try {
      const data = await bookingsModel.getByUserId(req.params.user_id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async updateStatus(req, res) {
    try {
      const updated = await bookingsModel.updateStatus(req.params.id, req.body.status);
      if (!updated) return res.status(404).json({ error: "Reserva no encontrada" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await bookingsModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Reserva no encontrada" });
      res.json({ message: "Reserva eliminada" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  // Nuevos métodos para la especificación
  async createHold(req, res) {
    try {
      const { 
        showtime_id, 
        movie_id, 
        cinema_id, 
        sala_id, 
        sala_number, 
        seats, 
        user, 
        payment_method, 
        source, 
        price_total 
      } = req.body;

      const hold = await bookingsModel.createHold(
        showtime_id, 
        movie_id, 
        cinema_id, 
        sala_id, 
        sala_number, 
        seats, 
        user, 
        payment_method, 
        source, 
        price_total
      );
      
      res.status(201).json(hold);
    } catch (e) {
      console.error("ERROR EN POST /holds:", e);
      res.status(400).json({ error: e.message });
    }
  }

  async confirmHold(req, res) {
    try {
      const { hold_id } = req.body;
      const confirmed = await bookingsModel.confirmHold(hold_id);
      if (!confirmed) return res.status(404).json({ error: "Hold no encontrado" });
      res.json(confirmed);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async cancelBooking(req, res) {
    try {
      const cancelled = await bookingsModel.cancelBooking(req.params.id);
      if (!cancelled) return res.status(404).json({ error: "Reserva no encontrada" });
      res.json(cancelled);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async refundBooking(req, res) {
    try {
      const refunded = await bookingsModel.refundBooking(req.params.id);
      if (!refunded) return res.status(404).json({ error: "Reserva no encontrada" });
      res.json(refunded);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getByShowtime(req, res) {
    try {
      const data = await bookingsModel.getByShowtime(req.params.showtime_id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  async getByCinema(req, res) {
    try {
      const data = await bookingsModel.getByCinema(req.params.cinema_id);
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

export default new bookingsController();