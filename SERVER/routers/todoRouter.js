import { Router } from 'express';
import checkAuth from '../middleware/checkAuthorization.js';
import connection from '../database/connectionDB.js'; 

const router = Router();

router.get('/api/gettodos', checkAuth, async (req, res) => {
    try {
        const [rows, fields] = await connection.execute(`
            SELECT * 
            FROM todos
        `);
        if (rows.length === 0) {
            return res.status(404).json({ message: "No todos found" });
        }
        return res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching todos: ", error: error.message });
    };
});

router.get('/api/todo', checkAuth, async (req, res) => {
    try {
        const [rows, fields] = await connection.execute(`
            SELECT t.* 
            FROM todo AS t
            INNER JOIN user_todos AS ut ON t.id = ut.todo_id
            WHERE ut.user_id = ?
        `, [userId]);
        return res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching todos."});
    };
});

router.get('/api/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    try {
        const [rows, fields] = await connection.execute("SELECT * FROM todos WHERE id = ?", [id]);
        const todo = rows[0];
        return res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching todo" });
    };
});

router.post('/api/todo', checkAuth, async (req, res) => {
    const { title } = req.body;
    const query = "INSERT INTO todos (title, completed) VALUES (?, ?);";
    try {
        await connection.execute(query, [title, false]);
        console.log("Todo inserted successfully");
        return res.json({ message: "Todo inserted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating todo"});
    };
});

router.put('/api/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body; // Extracts both title and completed properties from MySQL.
    let query = "UPDATE todos SET";
    const queryParams = [];
    if (title !== undefined) {
        query += " title = ?,";
        queryParams.push(title);
    };
    if (completed !== undefined) {
        query += " completed = ?,";
        queryParams.push(completed);
    };
    query = query.slice(0, -1) + " WHERE id = ?"; // Removes the trailing comma and complete the query.
    queryParams.push(id);
    try {
        await connection.execute(query, queryParams);
        console.log("Todo updated successfully");
        const updatedTodo = { id, title, completed };
        return res.json(updatedTodo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating todo"});
    };
});

router.delete('/api/todo/:id', checkAuth, async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM todos WHERE id = ?";
    try {
        await connection.execute(query, [id]);
        console.log("Todo deleted successfully.")
        return res.json({ message: "Todo deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting todo"});
    };
}); 

export default router;