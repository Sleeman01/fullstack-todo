import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newText, setNewText] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  async function fetchTasks() {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!newText.trim()) return;

    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newText.trim(),
          dueDate: newDueDate || null,
          priority: newPriority,
        }),
      });
      if (!res.ok) {
        throw new Error('Failed to add task');
      }
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewText('');
      setNewDueDate('');
      setNewPriority('medium');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  }

  async function toggleDone(task) {
    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done }),
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  }

  async function deleteTask(id) {
    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        throw new Error('Failed to delete task');
      }
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  }

  async function updateTaskText(id, text) {
    if (!text.trim()) {
      setEditingId(null);
      setEditingText('');
      return;
    }
    try {
      setError('');
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingId(null);
      setEditingText('');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditingText(task.text);
  }

  function clearCompleted() {
    const completed = tasks.filter((t) => t.done);
    Promise.all(completed.map((t) => fetch(`${API_URL}/tasks/${t.id}`, { method: 'DELETE' })))
      .then(() => fetchTasks())
      .catch(() => setError('Failed to clear some tasks'));
  }

  const doneCount = tasks.filter((t) => t.done).length;
  const filteredTasks =
    filter === 'active'
      ? tasks.filter((t) => !t.done)
      : filter === 'completed'
        ? tasks.filter((t) => t.done)
        : tasks;

  return (
    <>
      <style>{`
        :root {
          --bg: #08080a;
          --surface: #121216;
          --surface-hover: #1a1a20;
          --surface-elevated: #18181e;
          --border: rgba(255, 255, 255, 0.06);
          --border-strong: rgba(255, 255, 255, 0.1);
          --text: #f0f0f4;
          --text-muted: #7c7c8c;
          --accent: #ff6b6b;
          --accent-hover: #ff8585;
          --accent-soft: rgba(255, 107, 107, 0.12);
          --accent-glow: rgba(255, 107, 107, 0.25);
          --success: #51cf66;
          --success-soft: rgba(81, 207, 102, 0.15);
          --radius: 16px;
          --radius-sm: 12px;
          --radius-pill: 999px;
          --font: 'Outfit', system-ui, sans-serif;
          --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
          --shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
          --shadow-glow: 0 0 40px var(--accent-glow);
        }

        html {
          scroll-behavior: smooth;
        }

        html, body, #root {
          height: 100%;
          margin: 0;
          width: 100%;
          background: var(--bg);
        }

        .app {
          min-height: 100vh;
          width: 100%;
          background: var(--bg);
          font-family: var(--font);
          padding: 56px 24px 80px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .app::before {
          content: '';
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background:
            radial-gradient(ellipse 70% 60% at 50% -30%, var(--accent-soft), transparent 55%),
            radial-gradient(ellipse 50% 50% at 85% 70%, rgba(81, 207, 102, 0.05), transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          width: 100%;
          max-width: 640px;
          position: relative;
          z-index: 1;
          padding: 0 clamp(20px, 5vw, 32px);
          box-sizing: border-box;
        }

        .header {
          text-align: center;
          margin-bottom: 48px;
        }

        .title {
          font-size: clamp(2rem, 5vw, 2.75rem);
          font-weight: 700;
          color: var(--text);
          letter-spacing: -0.03em;
          margin: 0 0 8px 0;
          line-height: 1.15;
        }

        .subtitle {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 400;
          letter-spacing: 0.01em;
        }

        .form-card {
          background: var(--surface-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 24px 28px;
          margin-bottom: 28px;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
        }

        .form-card:hover {
          border-color: var(--border-strong);
        }

        .form-card:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent), var(--shadow-glow);
        }

        .form {
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .form-meta {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          align-items: center;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .input {
          flex: 1;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 16px 20px;
          font-family: var(--font);
          font-size: 1rem;
          color: var(--text);
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input::placeholder {
          color: var(--text-muted);
        }

        .input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        .input-date {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          font-family: var(--font);
          font-size: 0.85rem;
          color: var(--text);
        }

        .select-priority {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 12px;
          font-family: var(--font);
          font-size: 0.85rem;
          color: var(--text);
        }

        .btn-add {
          background: linear-gradient(180deg, var(--accent) 0%, #e85a5a 100%);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 16px 26px;
          font-family: var(--font);
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s;
          white-space: nowrap;
          box-shadow: 0 4px 14px var(--accent-glow);
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px var(--accent-glow);
          filter: brightness(1.05);
        }

        .btn-add:active {
          transform: translateY(0);
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
        }

        .filters {
          display: flex;
          gap: 8px;
          background: var(--surface);
          padding: 6px;
          border-radius: var(--radius-pill);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }

        .filter-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          border-radius: var(--radius-pill);
          padding: 10px 20px;
          font-family: var(--font);
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }

        .filter-btn:hover {
          color: var(--text);
          background: var(--surface-hover);
        }

        .filter-btn.active {
          color: #fff;
          background: var(--accent);
          box-shadow: 0 2px 12px var(--accent-glow);
        }

        .stats {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .stats strong {
          color: var(--text);
          font-weight: 600;
        }

        .btn-clear {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          padding: 10px 18px;
          font-family: var(--font);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          margin-left: auto;
        }

        .btn-clear:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-soft);
        }

        .loading {
          text-align: center;
          padding: 64px 24px;
          color: var(--text-muted);
          font-size: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .error {
          background: rgba(255, 107, 107, 0.1);
          border: 1px solid rgba(255, 107, 107, 0.25);
          color: #ff9a9a;
          padding: 16px 20px;
          border-radius: var(--radius-sm);
          margin-bottom: 24px;
          font-size: 0.9rem;
          animation: fadeIn 0.25s ease;
        }

        .empty {
          text-align: center;
          padding: 64px 32px;
          background: var(--surface);
          border: 1px dashed var(--border);
          border-radius: var(--radius);
          animation: fadeIn 0.35s ease;
        }

        .empty-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
          opacity: 0.6;
        }

        .empty-title {
          font-size: 1.2rem;
          color: var(--text);
          margin: 0 0 8px 0;
          font-weight: 600;
        }

        .empty-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin: 0;
        }

        .list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .task {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 18px 22px;
          box-shadow: var(--shadow-sm);
          transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.15s ease;
        }

        .task:hover {
          background: var(--surface-hover);
          border-color: var(--border-strong);
          box-shadow: var(--shadow-md);
        }

        .task-done {
          opacity: 0.9;
        }

        .task-done .task-text {
          text-decoration: line-through;
          color: var(--text-muted);
        }

        .checkbox {
          width: 24px;
          height: 24px;
          border: 2px solid var(--border);
          border-radius: 8px;
          background: var(--bg);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          cursor: pointer;
        }

        .task:hover .checkbox {
          border-color: var(--text-muted);
        }

        .task-done .checkbox {
          background: var(--success);
          border-color: var(--success);
          box-shadow: 0 0 12px var(--success-soft);
        }

        .task-done .checkbox::after {
          content: '✓';
          color: #08080a;
          font-size: 13px;
          font-weight: 700;
        }

        .task-text {
          flex: 1;
          font-size: 1.05rem;
          color: var(--text);
          cursor: pointer;
          user-select: none;
          transition: color 0.2s;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
          margin-left: 8px;
        }

        .pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 10px;
          border-radius: var(--radius-pill);
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.03em;
        }

        .pill-priority-low {
          background: rgba(100, 217, 255, 0.12);
          color: #63e6ff;
        }

        .pill-priority-medium {
          background: rgba(255, 193, 7, 0.18);
          color: #ffd43b;
        }

        .pill-priority-high {
          background: var(--accent-soft);
          color: var(--accent-hover);
        }

        .pill-due {
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-muted);
        }

        .btn-delete {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          border-radius: var(--radius-sm);
          padding: 9px 16px;
          font-family: var(--font);
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          opacity: 0.8;
        }

        .task:hover .btn-delete {
          opacity: 1;
        }

        .btn-delete:hover {
          border-color: var(--accent);
          color: var(--accent);
          background: var(--accent-soft);
        }

        .task-edit-input {
          flex: 1;
          background: var(--bg);
          border: 1px solid var(--accent);
          border-radius: var(--radius-sm);
          padding: 12px 16px;
          font-family: var(--font);
          font-size: 1.05rem;
          color: var(--text);
          outline: none;
          box-shadow: 0 0 0 3px var(--accent-soft);
        }

        @media (max-width: 640px) {
          .app {
            padding: 40px 16px 64px;
          }

          .header {
            margin-bottom: 36px;
          }

          .form {
            flex-direction: column;
            align-items: stretch;
          }

          .btn-add {
            width: 100%;
          }

          .toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .filters {
            justify-content: center;
          }

          .btn-clear {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="app">
        <div className="container">
          <header className="header">
            <h1 className="title">Get it done</h1>
            <p className="subtitle">One task at a time</p>
          </header>

          <div className="form-card">
            <form className="form" onSubmit={addTask}>
              <input
                type="text"
                className="input"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="What do you need to do?"
                autoFocus
              />
              <button type="submit" className="btn-add">
                Add task
              </button>
            </form>
            <div className="form-meta">
              <span>Due date:</span>
              <input
                type="date"
                className="input-date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
              <span>Priority:</span>
              <select
                className="select-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          {loading ? (
            <div className="loading">Loading your tasks…</div>
          ) : tasks.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">☑️</div>
              <p className="empty-title">No tasks yet</p>
              <p className="empty-desc">Add one above and watch it appear here.</p>
            </div>
          ) : (
            <>
              <div className="toolbar">
                <div className="filters">
                  {FILTERS.map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      className={`filter-btn ${filter === f.key ? 'active' : ''}`}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div className="stats">
                  <span><strong>{tasks.length}</strong> total</span>
                  <span>·</span>
                  <span><strong>{doneCount}</strong> done</span>
                </div>
                {doneCount > 0 && (
                  <button type="button" className="btn-clear" onClick={clearCompleted}>
                    Clear completed
                  </button>
                )}
              </div>
              {filteredTasks.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">🔍</div>
                  <p className="empty-title">
                    {filter === 'active' ? 'No active tasks' : 'No completed tasks'}
                  </p>
                  <p className="empty-desc">Switch filter or add a new task.</p>
                </div>
              ) : (
                <ul className="list">
                  {filteredTasks.map((task) => {
                    const priority = task.priority || 'medium';
                    return (
                      <li
                        key={task.id}
                        className={`task ${task.done ? 'task-done' : ''}`}
                      >
                        <div
                          className="checkbox"
                          onClick={() => toggleDone(task)}
                          aria-hidden
                        />
                        {editingId === task.id ? (
                          <input
                            className="task-edit-input"
                            value={editingText}
                            onChange={(e) => setEditingText(e.target.value)}
                            onBlur={() => updateTaskText(task.id, editingText)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') updateTaskText(task.id, editingText);
                              if (e.key === 'Escape') {
                                setEditingId(null);
                                setEditingText('');
                              }
                            }}
                            autoFocus
                          />
                        ) : (
                          <span
                            className="task-text"
                            onClick={() => toggleDone(task)}
                            onDoubleClick={(e) => {
                              e.preventDefault();
                              startEdit(task);
                            }}
                          >
                            {task.text}
                          </span>
                        )}
                        <div className="task-meta">
                          <span className={`pill pill-priority-${priority}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                          {task.dueDate && (
                            <span className="pill pill-due">
                              Due {task.dueDate}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
