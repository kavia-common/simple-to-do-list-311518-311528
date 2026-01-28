import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import { createTask, deleteTask, fetchTasks, updateTask } from "./services/api";

// PUBLIC_INTERFACE
function App() {
  /** Single-page to-do UI with network loading/error states and CRUD actions. */
  const [tasks, setTasks] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track IDs currently being mutated to disable controls per item.
  const [mutatingIds, setMutatingIds] = useState(() => new Set());
  const [isAdding, setIsAdding] = useState(false);

  const isTaskMutating = useMemo(() => {
    return (id) => mutatingIds.has(id);
  }, [mutatingIds]);

  function addMutating(id) {
    setMutatingIds((prev) => new Set([...prev, id]));
  }

  function removeMutating(id) {
    setMutatingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  async function load() {
    setError(null);
    setIsInitialLoading(true);
    try {
      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks.");
    } finally {
      setIsInitialLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(title) {
    setError(null);
    setIsAdding(true);
    try {
      const created = await createTask({ title });
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add task.");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleToggle(id, completed) {
    setError(null);
    addMutating(id);

    // Optimistic update
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed } : t)));

    try {
      const updated = await updateTask(id, { completed });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)));
      setError(e instanceof Error ? e.message : "Failed to update task.");
    } finally {
      removeMutating(id);
    }
  }

  async function handleEdit(id, title) {
    setError(null);
    addMutating(id);

    // Optimistic title update
    const prevTitle = tasks.find((t) => t.id === id)?.title;
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));

    try {
      const updated = await updateTask(id, { title });
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (e) {
      // Revert on failure
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, title: prevTitle ?? t.title } : t)));
      setError(e instanceof Error ? e.message : "Failed to edit task.");
    } finally {
      removeMutating(id);
    }
  }

  async function handleDelete(id) {
    setError(null);
    addMutating(id);

    // Optimistic remove
    const snapshot = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
    } catch (e) {
      setTasks(snapshot);
      setError(e instanceof Error ? e.message : "Failed to delete task.");
    } finally {
      removeMutating(id);
    }
  }

  return (
    <div className="app">
      <Header />

      <main className="container">
        {error ? (
          <div className="alert alert--error" role="alert">
            <div className="alert__title">Something went wrong</div>
            <div className="alert__message">{error}</div>
            <button className="btn btn--ghost btn--sm" type="button" onClick={load}>
              Retry
            </button>
          </div>
        ) : null}

        <TaskForm onAdd={handleAdd} isSubmitting={isAdding} />

        {isInitialLoading ? (
          <section className="surface card loading-state" aria-label="Loading tasks">
            <div className="spinner" aria-hidden="true" />
            <div>
              <div className="section-title">Loading tasks…</div>
              <div className="muted">Please wait a moment.</div>
            </div>
          </section>
        ) : (
          <TaskList
            tasks={tasks}
            onToggle={handleToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isTaskMutating={isTaskMutating}
          />
        )}
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span className="muted">Light theme · Primary #3b82f6 · Success #06b6d4</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
