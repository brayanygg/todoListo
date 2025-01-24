import { Router } from "express";

import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  updateTask,
} from "../controllers/tasks.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";

const tasksRouter = Router();

tasksRouter.get("/", userAuth, getTasks);

tasksRouter.get("/:id", userAuth, getTask);

tasksRouter.post("/", userAuth, createTask);

tasksRouter.put("/:id", userAuth, updateTask);

tasksRouter.delete("/:id", userAuth, deleteTask);

export default tasksRouter;
