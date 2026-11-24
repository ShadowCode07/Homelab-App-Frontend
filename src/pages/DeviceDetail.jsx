import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useDevice } from "../hooks/useDevices";
import {
  AlertIcon,
  CheckIcon,
  ChevronLeftIcon,
  CopyIcon,
  DeviceTypeIcon,
} from "../components/Icons";
import StatusPill from "../components/StatusPill";
import { formatLong, timeAgo } from "../utils/format";

const TOAST_MS = 6000;

function Breadcrumb({ label }) {
  return (
    <div className="crumb">
      <Link to="/devices">
        <ChevronLeftIcon size={14} />
        Devices
      </Link>
      <span>/</span>
      <span className="crumb__cur mono">{label}</span>
    </div>
  );
}

function RegisteredToast() {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(!!location.state?.justRegistered);

  useEffect(() => {
    if (location.state?.justRegistered) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), TOAST_MS);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;
  return (
    <div className="toast" role="status">
      <CheckIcon size={18} color="#5FD39A" />
      Device registered. Start the agent to bring it online.
    </div>
  );
}

function AgentCommand({ hostname }) {
  const [copied, setCopied] = useState(false);
  const command = `homelab-agent --hostname ${hostname} --server ${import.meta.env.VITE_API_URL ?? "[YOUR SERVER URL]"}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="panel">
      <h2 className="panel__title--tight">Agent</h2>
      <p className="panel__text">
        The agent on this device identifies itself by its hostname. Start it with:
      </p>
      <div className="code">
        <code>{command}</code>
        <button type="button" className="code__copy" onClick={copy} aria-label="Copy command">
          {copied ? <CheckIcon size={16} color="#5FD39A" /> : <CopyIcon size={16} color="#E6EDF3" />}
        </button>
      </div>
    </div>
  );
}

function StatusBanner({ device }) {
  if (device.deviceStatus === "Offline") {
    return (
      <div className="banner banner--error">
        <AlertIcon size={18} className="banner__icon" />
        <div>
          <b>No heartbeat for {timeAgo(device.lastSeenAt)?.replace(" ago", "") ?? "a while"}.</b>{" "}
          The device was marked offline 2 min after its last heartbeat. Check that it is powered on
          and that the agent is running.
        </div>
      </div>
    );
  }
  if (device.deviceStatus !== "Online") {
    return (
      <div className="banner banner--unknown">
        <AlertIcon size={18} className="banner__icon" />
        <div>
          <b>Waiting for the agent.</b> This device is registered but has not sent a heartbeat yet.
          Start the agent with the command below.
        </div>
      </div>
    );
  }
  return null;
}

export default function DeviceDetail() {
  const { id } = useParams();
  const { data: device, isPending, error } = useDevice(id);

  if (isPending) {
    return (
      <>
        <Breadcrumb label="…" />
        <div className="card state-msg">Loading device…</div>
      </>
    );
  }

  if (error) {
    const notFound = error.status === 404;
    return (
      <>
        <Breadcrumb label={notFound ? "Not found" : "Error"} />
        <div className="banner banner--error">
          <AlertIcon size={18} className="banner__icon" />
          <div>
            <b>{notFound ? "Device not found." : "Couldn't load this device."}</b>{" "}
            {notFound ? "It may have been removed." : error.message}
          </div>
        </div>
      </>
    );
  }

  const neverSeen = !device.lastSeenAt;
  const subtitle = [
    device.name !== device.hostname ? device.name : null,
    device.deviceType,
    device.deviceGroupName ?? "No group",
  ]
    .filter(Boolean)
    .join(" · ");

  const statusPanel = (
    <div className="panel">
      <h2>Status</h2>
      <dl>
        <dt>Current status</dt>
        <dd>
          <StatusPill status={device.deviceStatus} />
        </dd>
        <dt>Last heartbeat</dt>
        <dd>{neverSeen ? "No heartbeat received yet" : formatLong(device.lastSeenAt)}</dd>
        <dt>Heartbeat interval</dt>
        <dd>Every 30 s</dd>
        <dt>Marked offline after</dt>
        <dd>2 min without a heartbeat</dd>
      </dl>
    </div>
  );
  const agentPanel = <AgentCommand hostname={device.hostname} />;
  const isOnline = device.deviceStatus === "Online";

  return (
    <>
      <RegisteredToast />
      <Breadcrumb label={device.hostname} />

      <div className="card dhead">
        <div className="dhead__icon">
          <DeviceTypeIcon type={device.deviceType} size={28} strokeWidth={1.8} color="var(--color-type-text)" />
        </div>
        <div className="dhead__title">
          <div className="dhead__row">
            <h1 className="mono">{device.hostname}</h1>
            <StatusPill status={device.deviceStatus} large />
          </div>
          <p className="sub">{subtitle}</p>
        </div>
        <div className="seenbox">
          <span className="seenbox__k">Last seen</span>
          <span className="seenbox__v">{neverSeen ? "Never" : timeAgo(device.lastSeenAt)}</span>
          <span className="seenbox__k">
            {neverSeen ? "No heartbeat received yet" : formatLong(device.lastSeenAt)}
          </span>
        </div>
      </div>

      <StatusBanner device={device} />

      <div className="grid2">
        <div className="stack">
          <div className="panel">
            <h2>Identity</h2>
            <dl>
              <dt>Hostname</dt>
              <dd className="mono">{device.hostname}</dd>
              <dt>Display name</dt>
              <dd>{device.name}</dd>
              <dt>Type</dt>
              <dd>
                <span className="type">{device.deviceType}</span>
              </dd>
              <dt>Group</dt>
              <dd className={device.deviceGroupName ? undefined : "muted"}>
                {device.deviceGroupName ?? "No group"}
              </dd>
              <dt>IP address</dt>
              <dd>
                {device.ipAddress ? (
                  <span className="mono">{device.ipAddress}</span>
                ) : (
                  <span className="muted">Reported by the agent</span>
                )}
              </dd>
            </dl>
          </div>
          <div className="panel">
            <h2>Metadata</h2>
            <dl>
              <dt>Device ID</dt>
              <dd className="mono small">{device.id}</dd>
              <dt>Registered</dt>
              <dd>{formatLong(device.createdAt)}</dd>
            </dl>
          </div>
        </div>

        <div className="stack">
          {isOnline ? statusPanel : agentPanel}
          {isOnline ? agentPanel : statusPanel}
        </div>
      </div>
    </>
  );
}
