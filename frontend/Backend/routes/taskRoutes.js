import express from "express";
import jwt from "jsonwebtoken";
import Task from "../models/Task.js";

const router = express.Router();

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.userId = decoded.id;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Authentication error" });
  }
};

router.post("/", auth, async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: "Task title is required" });
    }
    const task = await Task.create({ ...req.body, userId: req.userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error creating task", details: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks", details: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // only update user's task
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Error updating task", details: error.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task", details: error.message });
  }
});

export default router;
