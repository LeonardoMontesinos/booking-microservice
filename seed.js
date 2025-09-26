// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Booking from "./models/bookingSchema.js";

dotenv.config();

function generateBookingId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `bkg_${dateStr}_${randomNum}`;
}

function generateSampleData() {
  const movies = [
    { id: "mv_001", name: "Avengers: Endgame" },
    { id: "mv_002", name: "Spider-Man: No Way Home" },
    { id: "mv_003", name: "Black Widow" },
    { id: "mv_004", name: "Shang-Chi" },
    { id: "mv_005", name: "Eternals" }
  ];

  const cinemas = [
    { id: "cin_001", name: "Cineplanet Jockey Plaza", city: "Lima", district: "Santiago de Surco" },
    { id: "cin_002", name: "Cineplanet San Miguel", city: "Lima", district: "San Miguel" },
    { id: "cin_003", name: "Cineplanet Megaplaza", city: "Lima", district: "Independencia" },
    { id: "cin_004", name: "Cineplanet Plaza Norte", city: "Lima", district: "Independencia" },
    { id: "cin_005", name: "Cineplanet Mall del Sur", city: "Lima", district: "Chorrillos" }
  ];

  const users = [
    { user_id: "u-001", name: "Luciana García", email: "luciana@email.com" },
    { user_id: "u-002", name: "Carlos Mendoza", email: "carlos@email.com" },
    { user_id: "u-003", name: "Ana Rodríguez", email: "ana@email.com" },
    { user_id: "u-004", name: "Miguel Torres", email: "miguel@email.com" },
    { user_id: "u-005", name: "Sofia López", email: "sofia@email.com" }
  ];

  return { movies, cinemas, users };
}

async function seed() {
  // 1) Conectar a MongoDB
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/bookingdb";
  await mongoose.connect(uri);
  console.log("🔌 MongoDB conectado para seed");

  // 2) Verificar si ya existen reservas
  const existentes = await Booking.countDocuments();
  if (existentes > 0) {
    console.log(`Omitido seed: ya hay ${existentes} bookings`);
    await mongoose.disconnect();
    return;
  }

  // 3) Generar datos de muestra
  const { movies, cinemas, users } = generateSampleData();
  console.log(`Generando datos con ${movies.length} películas, ${cinemas.length} cines, ${users.length} usuarios`);

  // 4) Insertar 1000 bookings en batches
  const batchSize = 100;
  const batch = [];
  const paymentMethods = ["card", "cash", "yape", "plin", "stripe"];
  const sources = ["web", "mobile", "kiosk", "partner"];
  const statuses = ["CONFIRMED", "CANCELLED", "HOLD"];

  for (let i = 1; i <= 1000; i++) {
    const movie = movies[Math.floor(Math.random() * movies.length)];
    const cinema = cinemas[Math.floor(Math.random() * cinemas.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const salaNumber = Math.floor(Math.random() * 10) + 1;
    const salaId = `sala_${salaNumber}`;
    const showtimeId = `st_${Math.floor(Math.random() * 1000) + 1}`;
    
    // Generar asientos aleatorios
    const numSeats = Math.floor(Math.random() * 4) + 1; // 1-4 asientos
    const seats = [];
    for (let j = 0; j < numSeats; j++) {
      const row = String.fromCharCode(65 + Math.floor(Math.random() * 10)); // A-J
      const number = Math.floor(Math.random() * 20) + 1; // 1-20
      seats.push({ seat_row: row, seat_number: number });
    }

    const showTime = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Próximos 30 días
    const priceTotal = Math.round((Math.random() * 50 + 10) * 100) / 100; // 10-60 PEN

    batch.push({
      _id: generateBookingId(),
      showtime_id: showtimeId,
      movie_id: movie.id,
      cinema_id: cinema.id,
      sala_id: salaId,
      sala_number: salaNumber,
      seats: seats,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email
      },
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      price_total: priceTotal,
      currency: "PEN",
      created_at: new Date()
    });

    if (batch.length === batchSize) {
      await Booking.insertMany(batch);
      process.stdout.write(`Inserted ${i} bookings\r`);
      batch.length = 0;
    }
  }
  
  if (batch.length) {
    await Booking.insertMany(batch);
  }
  console.log("\nSeed completo: 1000 bookings insertados");

  // 5) Desconectar
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Error en seed:", err);
  process.exit(1);
});
