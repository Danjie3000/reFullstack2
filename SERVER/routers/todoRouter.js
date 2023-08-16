import { Router } from 'express';
import checkAuth from '../middleware/checkAuthorization.js';
import connection from '../database/connectionDB.js';

const router = Router();

router.get('/todo', checkAuth, async (req, res) => {
    try {
        const [rows, fields] = await connection.execute("SELECT * FROM todos;");
        return res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching todos' });
    }
});

router.get('/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows, fields] = await connection.execute("SELECT * FROM todos WHERE id = ?", [id]);
        const todo = rows[0];
        return res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching todo' });
    }
});

router.post('/todo', checkAuth, async (req, res) => {
    const { title } = req.body;
    const query = "INSERT INTO todos (title, completed) VALUES (?, ?);";
    try {
        await connection.execute(query, [title, false]);
        console.log('Todo inserted successfully');
        return res.json({ message: 'Todo inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating todo' });
    }
});

router.put('/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const query = "UPDATE todos SET completed = NOT completed WHERE id = ?";
    try {
        await connection.execute(query, [id]);
        const updatedTodo = { id, completed: !todo[index].completed };
        return res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating todo' });
    }
});

router.delete('/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM todos WHERE id = ?";
    try {
        await connection.execute(query, [id]);
        return res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

export default router;