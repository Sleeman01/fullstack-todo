

## Get it done – Fullstack Todo App

A small full‑stack project built to learn how **frontend** and **backend** work together.  
You can create tasks, mark them as done, edit them, filter them, and clear completed items.  
**Want to publish on the Google Play Store?** See **[PLAY_STORE.md](./PLAY_STORE.md)** for the full guide.

---

## Tech stack

- **Frontend**: React + Vite (JavaScript)
- **Styling**: Custom CSS-in-JSX, dark theme
- **Backend**: Node.js + Express
- **Data storage**: JSON file (`backend/tasks.json`) – persists across restarts

---

## Project structure

- `backend/`
  - `index.js` – Express server and `/tasks` API
  - `package.json` – backend dependencies and scripts
- `frontend/`
  - `src/App.jsx` – main UI and logic
  - `src/main.jsx` – React entry point
  - `index.html` – HTML shell + font link

---

## Prerequisites

- **Node.js** and **npm** installed  
  Check:

```bash
node -v
npm -v
```

---

## How to run the app

### 1. Start the backend

From the `backend` folder:

```bash
cd backend
npm install        # only needed the first time
npm start
```

The backend runs at `http://localhost:3001`.

### 2. Start the frontend

Open **another** terminal, from the `frontend` folder:

```bash
cd frontend
npm install        # only needed the first time
npm run dev
```

Vite will show a URL like `http://localhost:5173` – open it in your browser.

You now have:

- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:3001`

Both terminals must stay running.

---

## API overview

All endpoints are under `http://localhost:3001`.

- **GET** `/tasks`  
  - Returns all tasks as JSON.

- **POST** `/tasks`  
  - Body: `{ "text": "Buy milk" }`  
  - Creates a new task.

- **PUT** `/tasks/:id`  
  - Body can include: `{ "text": "New text", "done": true }`  
  - Updates an existing task (text and/or done state).

- **DELETE** `/tasks/:id`  
  - Deletes a single task.

---

## Frontend features

- **Add tasks** with a nice animated form and button.
- **Mark as done** by clicking the checkbox or task text.
- **Edit task text** by double‑clicking a task (Enter to save, Esc to cancel).
- **Delete tasks** with a dedicated button.
- **Filters**:
  - **All** – every task
  - **Active** – only tasks not done
  - **Completed** – only done tasks
- **Clear completed** button to remove all done tasks at once.
- **Responsive design**:
  - Looks good on desktop and mobile
  - Form stacks vertically on small screens

---

## Ideas for next improvements

- Persist tasks in a real database (e.g. SQLite, PostgreSQL, or MongoDB).
- Add user accounts and authentication.
- Add due dates, priorities, and tags.
- Add tests (unit tests for backend routes and React components).

---

## How to use this as a learning project

- **Backend practice**: modify or add new endpoints (e.g. `/tasks/clear-completed`).
- **Frontend practice**: add new UI elements or views (stats page, light theme, etc.).
- **Full‑stack thinking**: whenever you change something on the frontend, think  
  “Do I need a new API or data shape on the backend?”

