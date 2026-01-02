import express from 'express';
import cors from 'cors';

import usuarioRoutes from './routes/usuario.routes.js';
import authRoutes from './routes/auth.routes.js';
import destileriaRoutes from './routes/destileria.routes.js';


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/destilerias', destileriaRoutes);


app.get('/', (req, res) => {
  res.send('Backend funcionando 🚀');
});

export default app;
