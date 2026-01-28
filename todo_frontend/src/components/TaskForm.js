import React, { useMemo, useState } from "react";

/**
 * @typedef TaskFormProps
 * @property {(title: string) => Promise<void> | void} onAdd
 * @property {boolean} isSubmitting
 */

// PUBLIC_INTERFACE
export default function TaskForm({ onAdd, isSubmitting }) {
  /** Controlled input form for adding tasks with basic validation. */
  const [title, setTitle] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = useMemo(() => title.trim(), [title]);
  const error = touched && trimmed.length === 0 ? "Task title is required." : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    if (trimmed.length === 0) return;

    await onAdd(trimmed);
    setTitle("");
    setTouched(false);
  }

  return (
    <section className="surface card task-form" aria-label="Add a new task">
      <form className="task-form__form" onSubmit={handleSubmit}>
        <div className="task-form__field">
          <label className="label" htmlFor="new-task-title">
            Add a task
          </label>
          <input
            id="new-task-title"
            className={`input ${error ? "input--error" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="e.g., Buy groceries"
            autoComplete="off"
            disabled={isSubmitting}
          />
          {error ? <div className="field-error">{error}</div> : null}
        </div>

        <button className="btn btn--primary task-form__btn" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add"}
        </button>
      </form>
    </section>
  );
}
