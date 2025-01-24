import db from "../db.js";

export const getTasks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks WHERE id_user = $1", [
      req.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ errors: ["No tasks found"] });

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "SELECT * FROM tasks WHERE id = $1 AND id_user = $2",
      [id, req.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ errors: ["Task not found"] });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const createTask = async (req, res) => {
  const { title, description } = req.body;
  const errors = [];

  if (!title) {
    errors.push("Title is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    if (description) {
      await db.query(
        "INSERT INTO tasks (title, description, id_user) VALUES ($1, $2, $3)",
        [title, description, req.id]
      );
    } else {
      await db.query("INSERT INTO tasks (title, id_user) VALUES ($1, $2)", [
        title,
        req.id,
      ]);
    }
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const errors = [];
  let result;

  if (!title) {
    errors.push("Title is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    if (description) {
      result = await db.query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND id_user = $4",
        [title, description, id, req.id]
      );
    } else {
      result = await db.query(
        "UPDATE tasks SET title = $1 WHERE id = $2 AND id_user = $3",
        [title, id, req.id]
      );
    }

    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ["Task not found"] });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      "DELETE FROM tasks WHERE id = $1 AND id_user = $2",
      [id, req.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ["Task not found"] });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};
