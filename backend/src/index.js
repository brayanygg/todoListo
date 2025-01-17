import express from "express";
import authRouter from "./routes/auth.routes.js";
import { APP_PORT } from "./config.js";

const app = express();
const PORT = APP_PORT;

app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
