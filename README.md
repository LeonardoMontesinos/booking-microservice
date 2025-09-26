## Booking API - Pruebas locales con MongoDB en Docker y cURL

### Requisitos
- Node.js 18+
- Docker instalado y corriendo

### 1) Clonar e instalar dependencias
```bash
git clone git@github.com:LeonardoMontesinos/booking-microservice.git
cd booking-microservices/
npm i
```

### 2) Levantar MongoDB con Docker
```bash
docker run -d --name mongo --restart unless-stopped -p 27017:27017 mongo:7
```

Verificar que está arriba:
```bash
docker ps | grep mongo
```

### 3) Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/bookingdb
# Para darle al seed acceso a otras APIs
API1_URL=http://localhost:8080
API2_URL=http://localhost:8000
```

### 4) Cargar datos de ejemplo
Ejecuta solo si tienes las APIs externas configuradas:
```bash
node seed.js
```

Si no tienes esas APIs, salta este paso y crea datos con los endpoints vía cURL.

### 5) Ejecutar la API
```bash
node app.js
```

Deberías ver en consola algo como: "Servidor activo en el puerto 3000".

### Probar con cURL

En caso no tengas configuradas las apis externas, usa los siguientes comandos cURL para probar el acceso a la base de datos de mongodb

Base URL: `http://localhost:3000`

#### 6.1 Crear hold temporal de asientos
```bash
curl -s -X POST http://localhost:3000/bookings/holds \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "u1",
    "film_id": "f1",
    "theater_id": "theater_1",
    "seats": ["A1","A2"],
    "show_time": "2025-12-31T20:00:00.000Z"
  }'
```
Guarda el `_id` del objeto devuelto como `hold_id`.

#### 6.2 Confirmar hold como reserva
```bash
curl -s -X POST http://localhost:3000/bookings/reservations \
  -H "Content-Type: application/json" \
  -d '{"hold_id":"<PON_AQUI_EL_ID_DEL_HOLD>"}'
```

#### 6.3 Obtener reserva por ID
```bash
curl -s http://localhost:3000/bookings/reservations/<ID_DE_LA_RESERVA>
```

#### 6.4 Cancelar reserva
```bash
curl -s -X POST http://localhost:3000/bookings/reservations/<ID_DE_LA_RESERVA>/cancel
```

#### 6.5 Endpoints básicos CRUD
```bash
# Crear booking directo
curl -s -X POST http://localhost:3000/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id":"u2",
    "film_id":"f2",
    "theater_id":"theater_2",
    "seats":["B1"],
    "show_time":"2025-12-25T18:00:00.000Z",
    "status":"confirmed"
  }'

# Listar todos los bookings
curl -s http://localhost:3000/bookings

# Obtener por ID
curl -s http://localhost:3000/bookings/<ID>

# Actualizar estado
curl -s -X PUT http://localhost:3000/bookings/<ID> \
  -H "Content-Type: application/json" \
  -d '{"status":"cancelled"}'

# Activos por usuario
curl -s http://localhost:3000/bookings/user/u1/active
```

### 7) Solución de problemas
- Error de conexión a Mongo: verifica que el contenedor esté corriendo y la variable `MONGO_URI` apunte a `mongodb://localhost:27017/bookingdb`.
- Seed falla: probablemente por la falta de APIs externas. Omite la ejecucion del seed y crea datos con los comandos cURL presentados anteriormente.
- Puerto en uso: cambia `PORT` en `.env`.
