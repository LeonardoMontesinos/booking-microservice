import express from 'express';
const route = express.Router();

import bookingsController from '../controllers/bookingsController.js';

// ===== ENDPOINTS BÁSICOS CRUD =====

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Crear nueva reserva
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Error en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
route.post('/', bookingsController.create);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       500:
 *         description: Error interno del servidor
 */
route.get('/', bookingsController.getAll);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Obtener reserva por ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
route.get('/:id', bookingsController.getOne);

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: Actualizar estado de una reserva
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, CANCELLED, REFUNDED, HOLD]
 *                 description: Nuevo estado de la reserva
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 */
route.put('/:id', bookingsController.updateStatus);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Eliminar reserva
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Reserva eliminada"
 *       404:
 *         description: Reserva no encontrada
 */
route.delete('/:id', bookingsController.delete);

// ===== ENDPOINTS ESPECÍFICOS DE BOLETERÍA =====

/**
 * @swagger
 * /bookings/holds:
 *   post:
 *     summary: Crear hold temporal de asientos
 *     tags: [Holds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HoldRequest'
 *     responses:
 *       201:
 *         description: Hold creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Error en los datos o asientos no disponibles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
route.post('/holds', bookingsController.createHold);

/**
 * @swagger
 * /bookings/reservations:
 *   post:
 *     summary: Confirmar hold como reserva
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmHoldRequest'
 *     responses:
 *       200:
 *         description: Hold confirmado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Hold no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
route.post('/reservations', bookingsController.confirmHold);

/**
 * @swagger
 * /bookings/reservations/{id}:
 *   get:
 *     summary: Obtener reserva por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 */
route.get('/reservations/:id', bookingsController.getOne);

/**
 * @swagger
 * /bookings/reservations/{id}/cancel:
 *   post:
 *     summary: Cancelar reserva
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva cancelada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 */
route.post('/reservations/:id/cancel', bookingsController.cancelBooking);

/**
 * @swagger
 * /bookings/reservations/{id}/refund:
 *   post:
 *     summary: Reembolsar reserva
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva reembolsada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 */
route.post('/reservations/:id/refund', bookingsController.refundBooking);

// ===== ENDPOINTS DE CONSULTA =====

/**
 * @swagger
 * /bookings/user/{user_id}/active:
 *   get:
 *     summary: Obtener reservas activas de un usuario
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de reservas activas del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
route.get('/user/:user_id/active', bookingsController.getByUser);

/**
 * @swagger
 * /bookings/showtime/{showtime_id}:
 *   get:
 *     summary: Obtener reservas por showtime
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: showtime_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del showtime
 *     responses:
 *       200:
 *         description: Lista de reservas para el showtime
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
route.get('/showtime/:showtime_id', bookingsController.getByShowtime);

/**
 * @swagger
 * /bookings/cinema/{cinema_id}:
 *   get:
 *     summary: Obtener reservas por cinema
 *     tags: [Queries]
 *     parameters:
 *       - in: path
 *         name: cinema_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cinema
 *     responses:
 *       200:
 *         description: Lista de reservas para el cinema
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 */
route.get('/cinema/:cinema_id', bookingsController.getByCinema);

export default route;