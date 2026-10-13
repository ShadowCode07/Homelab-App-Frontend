import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDeviceGroups, useDevices } from "../hooks/useDevices";
import { ChevronRightIcon, PlusIcon, ServerIcon } from "../components/Icons";
import StatCard from "../components/StatCard";
import StatusPill from "../components/StatusPill";
import { formatShort, timeAgo } from "../utils/format";

const STATUSES = ["Online", "Offline", "Unknown"];
const NO_GROUP = "none";

function countByStatus(devices) {
  const counts = { Online: 0, Offline: 0, Unknown: 0 };
  for (const d of devices) counts[d.deviceStatus in counts ? d.deviceStatus : "Unknown"]++;
  return counts;
}

function PageHeader({ showButton = true }) {
  return (
    <div className="page-header">
      <div>
        <h1>Devices</h1>
        <p className="sub">Every device in your homelab and whether it is online right now.</p>
      </div>
      {showButton && (
        <Link className="btn" to="/devices/new">
          <PlusIcon size={16} />
          Register device
        </Link>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card">
      <div className="empty">
        <div className="empty__icon">
          <ServerIcon size={30} strokeWidth={1.8} color="var(--color-type-text)" />
        </div>
        <h2>No devices yet</h2>
        <p>
          Register your first device, then start the agent on it. It shows up here as online as
          soon as the first heartbeat arrives.
        </p>
        <Link className="btn" to="/devices/new">
          <PlusIcon size={16} />
          Register device
        </Link>
      </div>
    </div>
  );
}

function DeviceRow({ device }) {
  const navigate = useNavigate();
  const open = () => navigate(`/devices/${device.id}`);
  const showName = device.name && device.name !== device.hostname;

  return (
    <div
      className="row row--link"
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
    >
      <div>
        <div className="host">{device.hostname}</div>
        {showName && <div className="row__name">{device.name}</div>}
      </div>
      <div>
        <span className="type">{device.deviceType}</span>
      </div>
      <div className={device.deviceGroupName ? "grp" : "grp muted"}>
        {device.deviceGroupName ?? "No group"}
      </div>
      <div>
        <StatusPill status={device.deviceStatus} />
      </div>
      <div>
        {device.lastSeenAt ? (
          <>
            <div className="seen">{timeAgo(device.lastSeenAt)}</div>
            <div className="seen-at">{formatShort(device.lastSeenAt)}</div>
          </>
        ) : (
          <>
            <div className="seen muted">Never</div>
            <div className="seen-at">Waiting for the agent</div>
          </>
        )}
      </div>
      <ChevronRightIcon size={16} color="#98A6B3" />
    </div>
  );
}

export default function DeviceList() {
  const { data: devices = [], isPending, error, isFetching } = useDevices();
  const { data: groups = [] } = useDeviceGroups();
  const [groupFilter, setGroupFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");

  if (isPending) {
    return (
      <>
        <PageHeader />
        <div className="card state-msg">Loading devices…</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageHeader />
        <div className="banner banner--error">
          <div>
            <b>Couldn't load devices.</b> {error.message}
          </div>
        </div>
      </>
    );
  }

  if (devices.length === 0) {
    return (
      <>
        <PageHeader showButton={false} />
        <EmptyState />
      </>
    );
  }

  const totals = countByStatus(devices);

  const inGroup = devices.filter((d) => {
    if (groupFilter === "all") return true;
    if (groupFilter === NO_GROUP) return !d.deviceGroupId;
    return d.deviceGroupId === groupFilter;
  });
  const groupCounts = countByStatus(inGroup);
  const visible =
    statusFilter === "All" ? inGroup : inGroup.filter((d) => d.deviceStatus === statusFilter);

  return (
    <>
      <PageHeader />

      <div className="stats">
        <StatCard
          label="Online"
          value={totals.Online}
          total={devices.length}
          hint={`of ${devices.length} registered devices`}
          color="var(--color-online)"
          track="var(--color-online-bg)"
        />
        <StatCard
          label="Offline"
          value={totals.Offline}
          total={devices.length}
          hint="no heartbeat in the last 2 min"
          color="var(--color-offline)"
          track="var(--color-offline-bg)"
        />
        <StatCard
          label="Waiting for agent"
          value={totals.Unknown}
          total={devices.length}
          hint="registered, never seen online"
          color="var(--color-unknown)"
          track="var(--color-unknown-bg)"
        />
      </div>

      <div className="card">
        <div className="filters">
          <label className="select">
            Group
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}>
              <option value="all">All groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
              <option value={NO_GROUP}>No group</option>
            </select>
          </label>

          <div className="seg" role="tablist" aria-label="Filter by status">
            {["All", ...STATUSES].map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={statusFilter === s}
                className={statusFilter === s ? "on" : undefined}
                onClick={() => setStatusFilter(s)}
              >
                {s} <i>{s === "All" ? inGroup.length : groupCounts[s]}</i>
              </button>
            ))}
          </div>

          <div className="live">
            <span className={`dot${isFetching ? " dot--pulse" : ""}`} />
            Showing {visible.length} of {devices.length} · updates live
          </div>
        </div>

        <div className="row row--head">
          <span>HOSTNAME</span>
          <span>TYPE</span>
          <span>GROUP</span>
          <span>STATUS</span>
          <span>LAST SEEN</span>
          <span />
        </div>

        {visible.map((d) => (
          <DeviceRow key={d.id} device={d} />
        ))}

        {visible.length === 0 && (
          <div className="state-msg">No devices match these filters.</div>
        )}
      </div>
    </>
  );
}
