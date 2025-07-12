import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

app.use(cors()); 
app.use(express.json()); 


app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
    res.send('API de Gestión de Tareas funcionando!');
});

export default app;