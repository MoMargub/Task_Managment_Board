const express = require("express");
const projectController = require("../controller/projectController");
const { signUp, signIn } = require("../controller/authController");
const api = express.Router();

api.get("/projects", projectController.getProjects);

api.get("/project/:id", projectController.getProjectById);

api.post("/project", projectController.createProject);

api.put("/project/:id", projectController.updateProject);

api.delete("/project/:id", projectController.deleteProject);

api.post("/project/:id/task", projectController.createTaskForProject);

api.get("/project/:id/task/:taskId", projectController.getTaskById);

api.put("/project/:id/task/:taskId", projectController.updateTask);

api.delete("/project/:id/task/:taskId", projectController.deleteTask);

api.put("/project/:id/todo", projectController.updateTodoTasks);

api.post("/signup", signUp)

api.post("/signin", signIn)

module.exports = api;
