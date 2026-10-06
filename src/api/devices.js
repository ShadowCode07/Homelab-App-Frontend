const API_URL = import.meta.env.VITE_API_URL;

export async function getDevices() {
  const res = await fetch(`${API_URL}/api/Device`);

  if (!res.ok) throw new Error(`Failed to load devices (${res.status})`);

  return res.json();
}
