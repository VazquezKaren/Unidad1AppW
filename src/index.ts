import express from 'express';
import morgan from 'morgan';
// import authRoutes from './routes/auth.js'; 
import authRoutes from './routes/auth.routes';
import connectDB from './config/db';
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',   // la URL de tu frontend
  credentials: true,                  // para que permita cookies / auth headers
}));
// Rutas
app.use('/api/v1/auth', authRoutes);

connectDB().then(() => {

  // Servidor
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });

});
  



//Poder ejcutar el programa