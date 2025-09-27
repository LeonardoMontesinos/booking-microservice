// app.js
import 'dotenv/config';
import './config/dbClient.js';      // conexión MongoDB
import express from 'express';
import routesBookings from './routes/bookings.js';
import bodyParser from 'body-parser';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booking Microservice API',
      version: '1.0.0',
      description: 'API para gestión de reservas de boletería de cine',
      contact: {
        name: 'API Support',
        email: 'support@bookingapi.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      schemas: {
        Booking: {
          type: 'object',
          required: ['showtime_id', 'movie_id', 'cinema_id', 'sala_id', 'sala_number', 'seats', 'user', 'payment_method', 'source', 'price_total'],
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del booking (formato: bkg_YYYYMMDD_XXXX)',
              example: 'bkg_20241225_1234'
            },
            showtime_id: {
              type: 'string',
              description: 'ID de la función/horario',
              example: 'st_1001'
            },
            movie_id: {
              type: 'string',
              description: 'ID de la película',
              example: 'mv_001'
            },
            cinema_id: {
              type: 'string',
              description: 'ID del cine',
              example: 'cin_001'
            },
            sala_id: {
              type: 'string',
              description: 'ID de la sala',
              example: 'sala_1'
            },
            sala_number: {
              type: 'integer',
              description: 'Número de la sala',
              example: 1
            },
            seats: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Seat'
              }
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            payment_method: {
              type: 'string',
              enum: ['card', 'cash', 'yape', 'plin', 'stripe'],
              description: 'Método de pago'
            },
            source: {
              type: 'string',
              enum: ['web', 'mobile', 'kiosk', 'partner'],
              description: 'Fuente de la reserva'
            },
            status: {
              type: 'string',
              enum: ['CONFIRMED', 'CANCELLED', 'REFUNDED', 'HOLD'],
              description: 'Estado de la reserva',
              default: 'HOLD'
            },
            price_total: {
              type: 'number',
              description: 'Precio total en PEN',
              example: 25.50
            },
            currency: {
              type: 'string',
              description: 'Moneda',
              default: 'PEN'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          }
        },
        Seat: {
          type: 'object',
          required: ['seat_row', 'seat_number'],
          properties: {
            seat_row: {
              type: 'string',
              description: 'Fila del asiento',
              example: 'A'
            },
            seat_number: {
              type: 'integer',
              description: 'Número del asiento',
              example: 10
            }
          }
        },
        User: {
          type: 'object',
          required: ['user_id', 'name', 'email'],
          properties: {
            user_id: {
              type: 'string',
              description: 'ID del usuario',
              example: 'u-001'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Luciana García'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'luciana@email.com'
            }
          }
        },
        HoldRequest: {
          type: 'object',
          required: ['showtime_id', 'movie_id', 'cinema_id', 'sala_id', 'sala_number', 'seats', 'user', 'payment_method', 'source', 'price_total'],
          properties: {
            showtime_id: {
              type: 'string',
              example: 'st_1001'
            },
            movie_id: {
              type: 'string',
              example: 'mv_001'
            },
            cinema_id: {
              type: 'string',
              example: 'cin_001'
            },
            sala_id: {
              type: 'string',
              example: 'sala_1'
            },
            sala_number: {
              type: 'integer',
              example: 1
            },
            seats: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Seat'
              }
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            payment_method: {
              type: 'string',
              enum: ['card', 'cash', 'yape', 'plin', 'stripe']
            },
            source: {
              type: 'string',
              enum: ['web', 'mobile', 'kiosk', 'partner']
            },
            price_total: {
              type: 'number',
              example: 25.50
            }
          }
        },
        ConfirmHoldRequest: {
          type: 'object',
          required: ['hold_id'],
          properties: {
            hold_id: {
              type: 'string',
              description: 'ID del hold a confirmar',
              example: 'bkg_20241225_1234'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Booking API Documentation'
}));

// Rutas
app.use('/bookings', routesBookings);

// Ruta raíz con información de la API
app.get('/', (req, res) => {
  res.json({
    message: 'Booking Microservice API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      bookings: '/bookings',
      holds: '/bookings/holds',
      reservations: '/bookings/reservations'
    }
  });
});

// Servidor
try {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('Servidor activo en el puerto ' + PORT);
    console.log('Documentación Swagger: http://localhost:' + PORT + '/api-docs');
  });
} catch (e) {
  console.error('Error al iniciar el servidor:', e);
}
