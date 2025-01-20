import express, { json } from "express";
import authRouter from "./routes/auth.routes.js";
import { APP_PORT } from "./config.js";
import tasksRouter from "./routes/tasks.routes.js";

const app = express();
const PORT = APP_PORT;

app.use(json());
app.use("/auth", authRouter);
app.use("/tasks", tasksRouter);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
