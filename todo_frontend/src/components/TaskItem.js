import React, { useMemo, useState } from "react";

/**
 * @typedef Task
 * @property {string|number} id
 * @property {string} title
 * @property {boolean} completed
 */

/**
 * @typedef TaskItemProps
 * @property {Task} task
 * @property {(id: string|number, completed: boolean) => Promise<void> | void} onToggle
 * @property {(id: string|number, title: string) => Promise<void> | void} onEdit
 * @property {(id: string|number) => Promise<void> | void} onDelete
 * @property {boolean} isMutating
 */

// PUBLIC_INTERFACE
export default function TaskItem({ task, onToggle, onEdit, onDelete, isMutating }) {
  /** Renders a single task, supports inline edit and actions. */
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [touched, setTouched] = useState(false);

  const trimmed = useMemo(() => draftTitle.trim(), [draftTitle]);
  const editError = touched && trimmed.length === 0 ? "Title is required." : null;

  function startEdit() {
    setDraftTitle(task.title);
    setTouched(false);
    setIsEditing(true);
  }

  function cancelEdit() {
    setDraftTitle(task.title);
    setTouched(false);
    setIsEditing(false);
  }

  async function submitEdit(e) {
    e.preventDefault();
    setTouched(true);
    if (trimmed.length === 0) return;

    if (trimmed !== task.title) {
      await onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  }

  return (
    <li className={`task-item ${task.completed ? "task-item--completed" : ""}`}>
      <div className="task-item__left">
        <input
          className="checkbox"
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id, !task.completed)}
          disabled={isMutating}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        />

        <div className="task-item__content">
          {!isEditing ? (
            <>
              <div className="task-item__title" title={task.title}>
                {task.title}
              </div>
              <div className="task-item__meta">
                {task.completed ? (
                  <span className="badge badge--success">Completed</span>
                ) : (
                  <span className="badge badge--neutral">Active</span>
                )}
              </div>
            </>
          ) : (
            <form className="task-item__editForm" onSubmit={submitEdit}>
              <input
                className={`input input--sm ${editError ? "input--error" : ""}`}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={() => setTouched(true)}
                disabled={isMutating}
                autoFocus
                aria-label="Edit task title"
              />
              {editError ? <div className="field-error field-error--compact">{editError}</div> : null}
              <div className="task-item__editActions">
                <button className="btn btn--success btn--sm" type="submit" disabled={isMutating}>
                  {isMutating ? "Saving…" : "Save"}
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  type="button"
                  onClick={cancelEdit}
                  disabled={isMutating}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {!isEditing ? (
        <div className="task-item__actions">
          <button className="btn btn--ghost btn--sm" type="button" onClick={startEdit} disabled={isMutating}>
            Edit
          </button>
          <button className="btn btn--danger btn--sm" type="button" onClick={() => onDelete(task.id)} disabled={isMutating}>
            Delete
          </button>
        </div>
      ) : null}
    </li>
  );
}
