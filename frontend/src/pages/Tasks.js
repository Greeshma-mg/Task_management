import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../assets/tasks.css";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await axios.post(
        `${API_URL}/api/tasks`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await axios.put(
        `${API_URL}/api/tasks/${task._id}`,
        { status: task.status === "pending" ? "completed" : "pending" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const startEditing = (task) => {
    setEditId(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await axios.put(
        `${API_URL}/api/tasks/${id}`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      setEditTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Error editing task:", err);
    }
  };

  useEffect(() => {
    if (!token) navigate("/");
    else fetchTasks();
  }, []);

  return (
    <div className="task-container">
      <h2>Task Manager</h2>

      <div className="task-input">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New Task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t._id}>
            {editId === t._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(t._id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration:
                      t.status === "completed" ? "line-through" : "none",
                  }}
                >
                  {t.title}
                </span>
                <button onClick={() => toggleStatus(t)}>
                  {t.status === "pending" ? "Mark Done" : "Mark Pending"}
                </button>
                <button onClick={() => startEditing(t)}>Edit</button>
                <button onClick={() => deleteTask(t._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
