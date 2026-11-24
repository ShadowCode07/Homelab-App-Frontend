import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout.jsx";
import DeviceList from "./pages/DeviceList.jsx";
import RegisterDevice from "./pages/RegisterDevice.jsx";
import DeviceDetail from "./pages/DeviceDetail.jsx";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/devices" replace />} />
        <Route path="devices" element={<DeviceList />} />
        <Route path="devices/new" element={<RegisterDevice />} />
        <Route path="devices/:id" element={<DeviceDetail />} />
        <Route path="*" element={<Navigate to="/devices" replace />} />
      </Route>
    </Routes>
  );
}
