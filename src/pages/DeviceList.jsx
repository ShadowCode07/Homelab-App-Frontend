import { useState, useEffect } from "react";
import { getDevices } from "../api/devices";

export default function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDevices()
      .then(setDevices)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading devices...</p>;
  if (error) return <p>Error loading devices: {error}</p>;
  if (devices.length === 0) return <p>No devices found.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Hostname</th>
          <th>Type</th>
          <th>Status</th>
          <th>IP address</th>
          <th>Group</th>
        </tr>
      </thead>
      <tbody>
        {devices.map((d) => (
          <tr key={d.id}>
            <td>{d.name}</td>
            <td>{d.hostname}</td>
            <td>{d.deviceType}</td>
            <td>{d.deviceStatus}</td>
            <td>{d.ipAddress ?? "—"}</td>
            <td>{d.deviceGroupName ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
