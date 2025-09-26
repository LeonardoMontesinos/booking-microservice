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
}

export default new bookingsController();