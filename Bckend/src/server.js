import dotenv from 'dotenv';
import app from './app.js';
import pool from './config/db.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
    try {
        await pool.query('SELECT 1');
        console.log(`Servidor corriendo en puerto ${PORT}`);
        console.log('Conectado a MySQL');
    } catch (error) {
        console.error('❌ Error al conectar a MySQL:', error.message);
    }
});
