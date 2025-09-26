import express from 'express';
const route = express.Router();

import bookingsController from '../controllers/bookingsController.js';
import bookingsModel from '../models/bookings.js';

// Crear nueva reserva
route.post('/', bookingsController.create);

// Obtener todas las reservas
route.get('/', bookingsController.getAll);

// Obtener una reserva por ID
route.get('/:id', async (req, res) => {
  try {
    const booking = await bookingsModel.getOneById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Actualizar estado de una reserva (ejemplo: confirmed, cancelled)
route.put('/:id', async (req, res) => {
  try {
    const updated = await bookingsModel.updateStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ error: 'Reserva no encontrada' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener reservas activas de un usuario
route.get('/user/:user_id/active', async (req, res) => {
  try {
    const data = await bookingsModel.getActiveByUser(req.params.user_id);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crear hold temporal de asientos
route.post('/holds', async (req, res) => {
  try {
    const { user_id, film_id, theater_id, seats, show_time } = req.body;
    const hold = await bookingsModel.createHold(user_id, film_id, theater_id, seats, new Date(show_time));
    res.status(201).json(hold);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Confirmar hold como reserva
route.post('/reservations', async (req, res) => {
  try {
    const { hold_id } = req.body;
    const updated = await bookingsModel.updateStatus(hold_id, "confirmed");
    if (!updated) return res.status(404).json({ error: "Hold no encontrado" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Obtener reserva por ID
route.get('/reservations/:id', async (req, res) => {
  try {
    const booking = await bookingsModel.getOneById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Cancelar reserva
route.post('/reservations/:id/cancel', async (req, res) => {
  try {
    const updated = await bookingsModel.updateStatus(req.params.id, "cancelled");
    if (!updated) return res.status(404).json({ error: "Reserva no encontrada" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default route;