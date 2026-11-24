import { apiFetch } from "./client";

export function getDevices() {
  return apiFetch("/api/Device");
}

export function getDevice(id) {
  return apiFetch(`/api/Device/${id}`);
}

export function createDevice(device) {
  return apiFetch("/api/Device", {
    method: "POST",
    body: JSON.stringify(device),
  });
}

export function getDeviceGroups() {
  return apiFetch("/api/DeviceGroup");
}
