import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";


dotenv.config();

import usuarioRoutes from './routes/usuario.routes.js';
import authRoutes from './routes/auth.routes.js';
import destileriaRoutes from './routes/destileria.routes.js';
import productoRoutes from './routes/producto.routes.js';
import bartenderRoutes from './routes/bartender.routes.js';
import coctelRoutes from './routes/coctel.routes.js';
import favoritosRoutes from './routes/favoritos.routes.js';
import deseosRoutes from './routes/deseos.routes.js';
import passwordRoutes from "./routes/password.routes.js";
import eventosRoutes from "./routes/eventos.routes.js";
import valoracionesRoutes from "./routes/valoraciones.routes.js";

const app = express();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));



app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

/* =========================
   BODY PARSER
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ARCHIVOS
========================= */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/* =========================
   RUTAS
========================= */
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destilerias', destileriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/bartenders', bartenderRoutes);
app.use('/api/cocteles', coctelRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/deseos', deseosRoutes);
app.use('/api/password', passwordRoutes);
app.use("/api/eventos", eventosRoutes);
app.use("/api/valoraciones", valoracionesRoutes);


/* =========================
   HEALTH
========================= */
app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

/* =========================
   ERROR GLOBAL
========================= */
app.use((err, req, res, next) => {
  console.error(' ERROR GLOBAL:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: err.message,
  });
});



export default app;
