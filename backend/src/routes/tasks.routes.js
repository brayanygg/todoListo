import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/tasks.controller.js";

const tasksRouter = Router();

tasksRouter.get("/", getTasks);

tasksRouter.get("/:id", getTask);

tasksRouter.post("/", createTask);

tasksRouter.put("/:id", updateTask);

tasksRouter.delete("/:id", deleteTask);

export default tasksRouter;
