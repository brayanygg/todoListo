export const getTasks = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM tasks");
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const getTask = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query("SELECT * FROM tasks WHERE id = $1", [id]);

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
  if (!description) {
    errors.push("Description is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    await db.query("INSERT INTO tasks (title, description) VALUES ($1, $2)", [
      title,
      description,
    ]);
    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};

export const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  const errors = [];

  if (!title) {
    errors.push("Title is required");
  }
  if (!description) {
    errors.push("Description is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const result = await db.query(
      "UPDATE tasks SET title = $1, description = $2 WHERE id = $3",
      [title, description, id]
    );

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
  const id = req.params.id;

  try {
    const result = await db.query("DELETE FROM tasks WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ errors: ["Task not found"] });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errors: ["Server error"] });
  }
};
