import db from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name) {
    errors.push("Name is required");
  }
  if (!email) {
    errors.push("Email is required");
  }
  if (!password) {
    errors.push("Password is required");
  }
  if (password && password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      "INSERT INTO usuarios (nombre, email, contraseña) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const token = await generateToken(result.rows[0].id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ errors: ["Email already exists"] });
    }

    if (error.code === "23514") {
      return res.status(400).json({ errors: ["Invalid email"] });
    }

    console.log(error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email) {
    errors.push("Email is required");
  }
  if (!password) {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const result = await db.query(
      "SELECT * FROM usuarios WHERE email = $1 LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ errors: ["Invalid credentials"] });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.contraseña);

    if (!isPasswordValid) {
      return res.status(400).json({ errors: ["Invalid credentials"] });
    }

    const token = await generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({ message: "Login successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: ["Server error"] });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};
