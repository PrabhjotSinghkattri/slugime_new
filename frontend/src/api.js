const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function createReport(formData) {
  const r = await fetch(`${API}/api/v1/reports`, {
    method: "POST",
    body: formData
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