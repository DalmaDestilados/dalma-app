import express from 'express';
import cors from 'cors';
import path from 'path';

import usuarioRoutes from './routes/usuario.routes.js';
import authRoutes from './routes/auth.routes.js';
import destileriaRoutes from './routes/destileria.routes.js';
import productoRoutes from './routes/producto.routes.js';
import bartenderRoutes from './routes/bartender.routes.js';
import coctelRoutes from './routes/coctel.routes.js';
import favoritosRoutes from './routes/favoritos.routes.js';
import deseosRoutes from './routes/deseos.routes.js';
import passwordRoutes from "./routes/password.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destilerias', destileriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/bartenders', bartenderRoutes);
app.use('/api/cocteles', coctelRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/deseos', deseosRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api/password", passwordRoutes);



app.get('/', (req, res) => {
  res.send('Backend funcionando');
});

export default app;
