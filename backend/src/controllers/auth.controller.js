import db from "../db.js";
import bcrypt from "bcrypt";
import { generateToken } from "../libs/jwt.js";

export const register = (req, res) => {
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

  const addUser = async () => {
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

  addUser();
};

export const login = (req, res) => {
  res.send("Login route");
};

export const logout = (req, res) => {
  res.send("Logout route");
};

export const profile = (req, res) => {
  res.send("Profile route");
};
