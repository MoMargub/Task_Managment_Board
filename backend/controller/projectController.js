const joi = require("joi");
const mongoose = require("mongoose");
const Project = require("../models/project");

// Get all projects
const getProjects = async (req, res) => {
  try {
    const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 });
    return res.send(data);
  } catch (error) {
    return res.send(error);
  }
};

// Get a specific project by ID
const getProjectById = async (req, res) => {
  if (!req.params.id) {
    res.status(422).send({ data: { error: true, message: "Id is required" } });
  }
  try {
    const data = await Project.find({
      _id: new mongoose.mongo.ObjectId(req.params.id),
    }).sort({ order: 1 });
    return res.send(data);
  } catch (error) {
    return res.send(error);
  }
};

// Create a new project
const createProject = async (req, res) => {
  const project = joi.object({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().required(),
  });

  const { error, value } = project.validate({
    title: req.body.title,
    description: req.body.description,
  });

  if (error) {
    return res.status(422).send(error);
  }

  try {
    const data = await new Project(value).save();
    res.send({
      data: {
        title: data.title,
        description: data.description,
        updatedAt: data.updatedAt,
        _id: data._id,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(422).send({
        data: { error: true, message: "title must be unique" },
      });
    } else {
      return res
        .status(500)
        .send({ data: { error: true, message: "server error" } });
    }
  }
};

// Update an existing project
const updateProject = async (req, res) => {
  const project = joi.object({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().required(),
  });

  const { error, value } = project.validate({
    title: req.body.title,
    description: req.body.description,
  });

  if (error) {
    return res.status(422).send(error);
  }

  try {
    const result = await Project.updateOne(
      { _id: new mongoose.mongo.ObjectId(req.params.id) },
      { ...value },
      { upsert: true }
    );

    if (result.modifiedCount === 0 && !result.upserted) {
      return res
        .status(404)
        .send({ error: true, message: "No project found with that ID" });
    }

    return res.send(result);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  try {
    const data = await Project.deleteOne({
      _id: new mongoose.mongo.ObjectId(req.params.id),
    });
    res.send(data);
  } catch (error) {
    res.send(error);
  }
};

// Create a task for a project
const createTaskForProject = async (req, res) => {
  if (!req.params.id) {
    return res.status(500).send("server error");
  }

  const task = joi.object({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().required(),
    dueDate: joi.date().optional(),
    priority: joi.string().valid('Low', 'Medium', 'High').optional()
  });

  const { error, value } = task.validate({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority,
  });

  if (error) {
    return res.status(422).send(error);
  }

  try {
    const [{ task }] = await Project.find(
      { _id: new mongoose.mongo.ObjectId(req.params.id) },
      { "task.index": 1 }
    ).sort({ "task.index": 1 });

    let countTaskLength = [
      task.length,
      task.length > 0 ? Math.max(...task.map((o) => o.index)) : task.length,
    ];

    const data = await Project.updateOne(
      { _id: new mongoose.mongo.ObjectId(req.params.id) },
      {
        $push: {
          task: {
            ...value,
            stage: "To-do",
            order: countTaskLength[0],
            index: countTaskLength[1] + 1,
            priority: value.priority || 'Medium',
          },
        },
      }
    );

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Get a specific task by taskId
const getTaskById = async (req, res) => {
  if (!req.params.id || !req.params.taskId) {
    return res.status(500).send("server error");
  }

  try {
    const data = await Project.find(
      { _id: new mongoose.mongo.ObjectId(req.params.id) },
      {
        task: {
          $filter: {
            input: "$task",
            as: "task",
            cond: {
              $in: [
                "$$task._id",
                [new mongoose.mongo.ObjectId(req.params.taskId)],
              ],
            },
          },
        },
      }
    );

    if (data[0].task.length < 1)
      return res.status(404).send({ error: true, message: "record not found" });

    return res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Update a specific task
const updateTask = async (req, res) => {
  if (!req.params.id || !req.params.taskId)
    return res.status(500).send("server error");

  const task = joi.object({
    title: joi.string().min(3).max(30).required(),
    description: joi.string().required(),
    dueDate: joi.date().optional(),
    priority: joi.string().valid('Low', 'Medium', 'High').optional(),
  });

  const { error, value } = task.validate({
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    priority: req.body.priority, 
  });

  if (error) return res.status(422).send(error);

  try {
    const data = await Project.updateOne(
      {
        _id: new mongoose.mongo.ObjectId(req.params.id),
        task: {
          $elemMatch: { _id: new mongoose.mongo.ObjectId(req.params.taskId) },
        },
      },
      {
        $set: {
          "task.$.title": value.title,
          "task.$.description": value.description,
          "task.$.dueDate": value.dueDate,
          "task.$.priority": value.priority || 'Medium',
        },
      }
    );

    return res.send(data);
  } catch (error) {
    return res.status(500).send(error);
  }
};

// Delete a specific task
const deleteTask = async (req, res) => {
  if (!req.params.id || !req.params.taskId) {
    return res.status(500).send("Server error");
  }

  try {
    const data = await Project.updateOne(
      { _id: new mongoose.mongo.ObjectId(req.params.id) },
      {
        $pull: {
          task: { _id: new mongoose.mongo.ObjectId(req.params.taskId) },
        },
      }
    );
    return res.send(data);
  } catch (error) {
    return res.send(error);
  }
};

// Update tasks in the "To-Do" stage
const updateTodoTasks = async (req, res) => {
  let todo = [];
  for (const key in req.body) {
    for (const index in req.body[key].items) {
      req.body[key].items[index].stage = req.body[key].name;
      todo.push({
        name: req.body[key].items[index]._id,
        stage: req.body[key].items[index].stage,
        order: index,
      });
    }
  }

  todo.map(async (item) => {
    await Project.updateOne(
      {
        _id: new mongoose.mongo.ObjectId(req.params.id),
        task: { $elemMatch: { _id: new mongoose.mongo.ObjectId(item.name) } },
      },
      { $set: { "task.$.order": item.order, "task.$.stage": item.stage } }
    );
  });

  res.send(todo);
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  createTaskForProject,
  getTaskById,
  updateTask,
  deleteTask,
  updateTodoTasks,
};
