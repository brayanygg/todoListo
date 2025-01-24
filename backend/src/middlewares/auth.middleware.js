import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ errors: ["Unauthorized"] });
  }

  try {
    const user = jwt.verify(token, TOKEN_SECRET);

    req.id = user.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errors: ["Unauthorized"] });
  }
};
