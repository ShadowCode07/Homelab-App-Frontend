import { NavLink, Outlet } from "react-router";
import { PlusCircleIcon, ServerIcon } from "./Icons";

export default function Layout() {
  return (
    <div className="app">
      <nav className="sidebar">
        <div className="brand">
          <div className="brand__logo">
            <ServerIcon color="var(--color-primary)" />
          </div>
          <span>Homelab Manager</span>
        </div>

        <div className="sidebar__section">INVENTORY</div>
        <NavLink to="/devices" end className="nav">
          <ServerIcon />
          Devices
        </NavLink>
        <NavLink to="/devices/new" className="nav">
          <PlusCircleIcon />
          Register device
        </NavLink>

        <div className="sidebar__spacer" />
      </nav>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
