import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const generateToken = (id) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ id }, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};
