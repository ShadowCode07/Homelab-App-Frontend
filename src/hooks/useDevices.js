import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDevice,
  getDevice,
  getDeviceGroups,
  getDevices,
} from "../api/devices";

const LIVE_REFRESH_MS = 15_000;

export const deviceKeys = {
  all: ["devices"],
  detail: (id) => ["devices", id],
  groups: ["deviceGroups"],
};

export function useDevices() {
  return useQuery({
    queryKey: deviceKeys.all,
    queryFn: getDevices,
    refetchInterval: LIVE_REFRESH_MS,
  });
}

export function useDevice(id) {
  return useQuery({
    queryKey: deviceKeys.detail(id),
    queryFn: () => getDevice(id),
    refetchInterval: LIVE_REFRESH_MS,
  });
}

export function useDeviceGroups() {
  return useQuery({
    queryKey: deviceKeys.groups,
    queryFn: getDeviceGroups,
    staleTime: Infinity,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDevice,
    onSuccess: (device) => {
      queryClient.setQueryData(deviceKeys.detail(device.id), device);
      queryClient.invalidateQueries({ queryKey: deviceKeys.all, exact: true });
    },
  });
}
