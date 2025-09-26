// Config/dbClient.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/bookings';
    console.log('Conectando a MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado exitosamente');
  } catch (err) {
    console.error(' Error al conectar con MongoDB:', err.message);
    process.exit(1);
  }
};

// Ejecuta la conexión al cargar el módulo
connectDB();