/**
 * Centralized API client for the todo app.
 *
 * NOTE: The backend base URL is intentionally left as a placeholder for the next step.
 * Set API_BASE_URL to the backend origin (e.g. "http://localhost:3001").
 */

const API_BASE_URL = ""; // TODO(next step): Set backend base URL here (or via env).

/**
 * Helper to build URLs consistently.
 * @param {string} path API path beginning with "/"
 */
function buildUrl(path) {
  return `${API_BASE_URL}${path}`;
}

/**
 * Helper to parse JSON safely.
 * @param {Response} res fetch response
 */
async function parseJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * Helper to throw meaningful errors.
 * @param {Response} res fetch response
 */
async function throwIfNotOk(res) {
  if (res.ok) return;

  const body = await parseJson(res);
  const message =
    (body && (body.detail || body.message)) ||
    `Request failed (${res.status} ${res.statusText})`;

  throw new Error(message);
}

// PUBLIC_INTERFACE
export async function fetchTasks() {
  /**
   * Fetch all tasks.
   * @returns {Promise<Array<{id: string|number, title: string, completed: boolean}>>}
   */
  const res = await fetch(buildUrl("/tasks"), {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  await throwIfNotOk(res);
  const data = await res.json();
  return data;
}

// PUBLIC_INTERFACE
export async function createTask(payload) {
  /**
   * Create a task.
   * @param {{title: string}} payload
   * @returns {Promise<{id: string|number, title: string, completed: boolean}>}
   */
  const res = await fetch(buildUrl("/tasks"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  await throwIfNotOk(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function updateTask(id, payload) {
  /**
   * Update a task (title and/or completed).
   * @param {string|number} id
   * @param {{title?: string, completed?: boolean}} payload
   * @returns {Promise<{id: string|number, title: string, completed: boolean}>}
   */
  const res = await fetch(buildUrl(`/tasks/${encodeURIComponent(id)}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  await throwIfNotOk(res);
  return res.json();
}

// PUBLIC_INTERFACE
export async function deleteTask(id) {
  /**
   * Delete a task.
   * @param {string|number} id
   * @returns {Promise<void>}
   */
  const res = await fetch(buildUrl(`/tasks/${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  await throwIfNotOk(res);
}
