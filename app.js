// app.js
import 'dotenv/config';
import './config/dbClient.js';      // conexión MongoDB
import express from 'express';
import routesBookings from './routes/bookings.js';
import bodyParser from 'body-parser';

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use('/bookings', routesBookings);

// Servidor
try {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log('Servidor activo en el puerto ' + PORT)
  );
} catch (e) {
  console.error('Error al iniciar el servidor:', e);
}
