import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url'; 
import { v4 as uuidv4 } from 'uuid'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TASKS_FILE = path.resolve(__dirname, '../data/tasks.json');

const readTasks = async () => {
    try {
        const data = await fs.readFile(TASKS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') { 
            return [];
        }
        throw error;
    }
};

const writeTasks = async (tasks) => {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await readTasks();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
    }
};

export const createTask = async (req, res) => {
    const { description, fecha, estatus } = req.body;
    if (!description || !fecha || !estatus) {
        return res.status(400).json({ message: "Todos los campos son obligatorios: description, fecha, estatus." });
    }
    try {
        const tasks = await readTasks();
        const newTask = {
            id: uuidv4(), 
            description,
            fecha,
            estatus
        };
        tasks.push(newTask);
        await writeTasks(tasks);
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la tarea", error: error.message });
    }
};

export const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const tasks = await readTasks();
        const task = tasks.find(t => t.id === id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la tarea", error: error.message });
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { description, fecha, estatus } = req.body;
    if (!description || !fecha || !estatus) { 
         return res.status(400).json({ message: "Todos los campos (description, fecha, estatus) son obligatorios para la actualización completa." });
     }
    try {
        let tasks = await readTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], description, fecha, estatus };
            await writeTasks(tasks);
            res.json(tasks[taskIndex]);
        } else {
            res.status(404).json({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
    }
};


export const updateTaskStatus = async (req, res) => {
    const { id } = req.params;
    const { estatus } = req.body;
    if (!estatus) {
        return res.status(400).json({ message: "El estatus es obligatorio." });
    }
    try {
        let tasks = await readTasks();
        const taskIndex = tasks.findIndex(t => t.id === id);

        if (taskIndex !== -1) {
            tasks[taskIndex].estatus = estatus;
            await writeTasks(tasks);
            res.json(tasks[taskIndex]);
        } else {
            res.status(404).json({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estatus de la tarea", error: error.message });
    }
};


export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        let tasks = await readTasks();
        const initialLength = tasks.length;
        tasks = tasks.filter(t => t.id !== id);

        if (tasks.length < initialLength) {
            await writeTasks(tasks);
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: "Tarea no encontrada." });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
    }
};