const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'tasks.json');

let tasks = [];
let nextId = 1;

function loadTasks() {
  try {
    const file = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(file);
    tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
    if (typeof parsed.nextId === 'number') {
      nextId = parsed.nextId;
    } else {
      const maxId = tasks.reduce((max, t) => (t.id > max ? t.id : max), 0);
      nextId = maxId + 1;
    }
  } catch (err) {
    // File does not exist or is invalid – start fresh
    tasks = [];
    nextId = 1;
  }
}

function saveTasks() {
  const payload = { tasks, nextId };
  fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), (err) => {
    if (err) {
      console.error('Failed to save tasks:', err);
    }
  });
}

loadTasks();

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const { text, dueDate, priority } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text is required' });
  }

  const allowedPriorities = ['low', 'medium', 'high'];
  const normalizedPriority = allowedPriorities.includes(priority)
    ? priority
    : 'medium';

  const newTask = {
    id: nextId++,
    text,
    done: false,
    createdAt: new Date().toISOString(),
    dueDate: dueDate || null,
    priority: normalizedPriority,
  };

  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { text, done, dueDate, priority } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (typeof text === 'string') {
    task.text = text;
  }
  if (typeof done === 'boolean') {
    task.done = done;
  }
  if (typeof dueDate === 'string' || dueDate === null) {
    task.dueDate = dueDate;
  }
  if (typeof priority === 'string') {
    const allowedPriorities = ['low', 'medium', 'high'];
    if (allowedPriorities.includes(priority)) {
      task.priority = priority;
    }
  }

  saveTasks();
  res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);

  if (tasks.length === initialLength) {
    return res.status(404).json({ error: 'Task not found' });
  }

  saveTasks();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});