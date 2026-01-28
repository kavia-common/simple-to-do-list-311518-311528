import React from "react";
import TaskItem from "./TaskItem";

/**
 * @typedef Task
 * @property {string|number} id
 * @property {string} title
 * @property {boolean} completed
 */

/**
 * @typedef TaskListProps
 * @property {Task[]} tasks
 * @property {(id: string|number, completed: boolean) => Promise<void> | void} onToggle
 * @property {(id: string|number, title: string) => Promise<void> | void} onEdit
 * @property {(id: string|number) => Promise<void> | void} onDelete
 * @property {(id: string|number) => boolean} isTaskMutating
 */

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onToggle, onEdit, onDelete, isTaskMutating }) {
  /** List wrapper for tasks with a friendly empty state. */
  if (!tasks.length) {
    return (
      <section className="surface card empty-state" aria-label="Tasks">
        <h2 className="section-title">Tasks</h2>
        <p className="muted">No tasks yet. Add one above to get started.</p>
      </section>
    );
  }

  return (
    <section className="surface card task-list" aria-label="Tasks">
      <div className="task-list__header">
        <h2 className="section-title">Tasks</h2>
        <div className="task-list__count">
          <span className="badge badge--neutral">{tasks.length}</span>
        </div>
      </div>

      <ul className="task-list__items">
        {tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            isMutating={isTaskMutating(t.id)}
          />
        ))}
      </ul>
    </section>
  );
}
