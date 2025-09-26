// seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Booking from "./models/bookingSchema.js";

dotenv.config();

async function seed() {
  // 1) Conectar a MongoDB
  const uri =
    process.env.MONGO_URI ||
    `mongodb://${process.env.SERVER_DB}/${process.env.DB_NAME}`;
  await mongoose.connect(uri);
  console.log("🔌 MongoDB conectado para seed");

  // 2) Verificar si ya existen reservas
  const existentes = await Booking.countDocuments();
  if (existentes > 0) {
    console.log(`Omitido seed: ya hay ${existentes} bookings`);
    await mongoose.disconnect();
    return;
  }

  // 3) Traer datos de las otras APIs (users y trips)
  const API1 = (process.env.API1_URL || "http://localhost:8080").replace(/\/+$/, "");
  const API2 = (process.env.API2_URL || "http://localhost:8000").replace(/\/+$/, "");

  try {
    const [usersResp, tripsResp] = await Promise.all([
      axios.get(`${API1}/users`),
      axios.get(`${API2}/trips`)
    ]);

    const userIds = usersResp.data.map(u => String(u.id));
    const tripIds = tripsResp.data.map(t => String(t.id));

    console.log(`Encontrados ${userIds.length} users y ${tripIds.length} trips`);
    if (userIds.length === 0 || tripIds.length === 0) {
      throw new Error("No se encontraron users o trips en las APIs externas");
    }

    // 4) Insertar 20k bookings en batches
    const batchSize = 1000;
    const batch = [];
    for (let i = 1; i <= 20000; i++) {
      const user_id = userIds[Math.floor(Math.random() * userIds.length)];
      const film_id = tripIds[Math.floor(Math.random() * tripIds.length)];
      const theater_id = `theater_${Math.floor(Math.random() * 10) + 1}`;
      const seats = [`A${Math.floor(Math.random() * 20) + 1}`, `B${Math.floor(Math.random() * 20) + 1}`];
      const show_time = new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Próximos 30 días
      
      batch.push({
        user_id,
        film_id,
        theater_id,
        seats,
        show_time,
        status: "confirmed",
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
    console.log("\nSeed completo: 20 000 bookings insertados");
  } catch (err) {
    console.error("Error al obtener datos de las APIs externas:", err.message);
  }

  // 5) Desconectar
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Error en seed:", err);
  process.exit(1);
});
