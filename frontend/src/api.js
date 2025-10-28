const API = "http://localhost:5000"; // TODO: move to .env for production

export async function createReport(payload) {
  const r = await fetch(`${API}/api/v1/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error(`Create failed: ${r.status}`);
  return r.json();
}

export async function fetchReport(ticket, code) {
  const r = await fetch(`${API}/api/v1/reports/${ticket}?code=${encodeURIComponent(code)}`);
  if (!r.ok) throw new Error(`Fetch failed: ${r.status}`);
  return r.json();
}

export async function postMessage(ticket, code, body) {
  const r = await fetch(`${API}/api/v1/reports/${ticket}/messages?code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body })
  });
  if (!r.ok) throw new Error(`Message failed: ${r.status}`);
  return r.json();
}

// ---- Auth & Feed APIs ----

export async function register({ email, name, password }) {
  const r = await fetch(`${API}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password })
  });
  if (!r.ok) throw new Error(`Register failed: ${r.status}`);
  return r.json();
}

export async function login({ email, password }) {
  const r = await fetch(`${API}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!r.ok) throw new Error(`Login failed: ${r.status}`);
  return r.json();
}

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getFeed(token) {
  const r = await fetch(`${API}/api/v1/feed`, {
    headers: { ...authHeaders(token) }
  });
  if (!r.ok) throw new Error(`Feed failed: ${r.status}`);
  return r.json();
}

export async function getPublicReports() {
  const r = await fetch(`${API}/api/v1/reports/public`);
  if (!r.ok) throw new Error(`Reports failed: ${r.status}`);
  return r.json();
}

export async function createPost({ image_url, caption }, token) {
  const r = await fetch(`${API}/api/v1/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ image_url, caption })
  });
  if (!r.ok) throw new Error(`Create post failed: ${r.status}`);
  return r.json();
}

export async function likePost(postId, token) {
  const r = await fetch(`${API}/api/v1/posts/${postId}/like`, {
    method: "POST",
    headers: { ...authHeaders(token) }
  });
  if (!r.ok) throw new Error(`Like failed: ${r.status}`);
  return r.json();
}

export async function savePost(postId, token) {
  const r = await fetch(`${API}/api/v1/posts/${postId}/save`, {
    method: "POST",
    headers: { ...authHeaders(token) }
  });
  if (!r.ok) throw new Error(`Save failed: ${r.status}`);
  return r.json();
}

export async function addComment(postId, body, token) {
  const r = await fetch(`${API}/api/v1/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders(token) },
    body: JSON.stringify({ body })
  });
  if (!r.ok) throw new Error(`Comment failed: ${r.status}`);
  return r.json();
}