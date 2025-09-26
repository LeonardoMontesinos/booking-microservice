import express from 'express';
const route = express.Router();

import bookingsController from '../controllers/bookingsController.js';

// ===== ENDPOINTS BÁSICOS CRUD =====
// Crear nueva reserva
route.post('/', bookingsController.create);

// Obtener todas las reservas
route.get('/', bookingsController.getAll);

// Obtener una reserva por ID
route.get('/:id', bookingsController.getOne);

// Actualizar estado de una reserva
route.put('/:id', bookingsController.updateStatus);

// Eliminar reserva
route.delete('/:id', bookingsController.delete);

// ===== ENDPOINTS ESPECÍFICOS DE BOLETERÍA =====
// Crear hold temporal de asientos
route.post('/holds', bookingsController.createHold);

// Confirmar hold como reserva
route.post('/reservations', bookingsController.confirmHold);

// Obtener reserva por ID (alias para /reservations/:id)
route.get('/reservations/:id', bookingsController.getOne);

// Cancelar reserva
route.post('/reservations/:id/cancel', bookingsController.cancelBooking);

// Reembolsar reserva
route.post('/reservations/:id/refund', bookingsController.refundBooking);

// ===== ENDPOINTS DE CONSULTA =====
// Obtener reservas activas de un usuario
route.get('/user/:user_id/active', bookingsController.getByUser);

// Obtener reservas por showtime
route.get('/showtime/:showtime_id', bookingsController.getByShowtime);

// Obtener reservas por cinema
route.get('/cinema/:cinema_id', bookingsController.getByCinema);

export default route;