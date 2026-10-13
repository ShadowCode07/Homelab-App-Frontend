import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCreateDevice, useDeviceGroups } from "../hooks/useDevices";
import { AlertIcon, ChevronLeftIcon, DeviceTypeIcon } from "../components/Icons";
import { toFieldErrors } from "../utils/problemDetails";

const DEVICE_TYPES = ["Server", "Computer", "Mobile", "Other"];

const EMPTY_FORM = {
  hostname: "",
  name: "",
  deviceType: "Server",
  deviceGroupId: "",
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <div className="field__error" role="alert">
      <AlertIcon size={16} />
      {message}
    </div>
  );
}

function toRequestBody(form) {
  const hostname = form.hostname.trim();
  return {
    hostname,
    name: form.name.trim() || hostname,
    deviceType: form.deviceType,
    deviceGroupId: form.deviceGroupId || null,
  };
}

export default function RegisterDevice() {
  const navigate = useNavigate();
  const { data: groups = [] } = useDeviceGroups();
  const createDevice = useCreateDevice();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.hostname.trim()) {
      setErrors({ hostname: "Hostname is required." });
      return;
    }

    createDevice.mutate(toRequestBody(form), {
      onSuccess: (device) =>
        navigate(`/devices/${device.id}`, { state: { justRegistered: true } }),
      onError: (err) => {
        const fieldErrors = toFieldErrors(err.problem);
        setErrors(
          Object.keys(fieldErrors).length > 0
            ? fieldErrors
            : { _form: err.problem?.title ?? err.message },
        );
      },
    });
  };

  const fieldErrorCount = Object.keys(errors).filter((k) => k !== "_form").length;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <div className="crumb">
        <Link to="/devices">
          <ChevronLeftIcon size={14} />
          Devices
        </Link>
        <span>/</span>
        <span className="crumb__cur">Register device</span>
      </div>

      <div className="page-header">
        <div>
          <h1>Register device</h1>
          <p className="sub">Add a device to your inventory. Status and last seen come from its agent.</p>
        </div>
      </div>

      {hasErrors && (
        <div className="banner banner--error" role="alert">
          <AlertIcon size={18} className="banner__icon" />
          <div>
            <b>The device couldn't be registered.</b>{" "}
            {fieldErrorCount > 0
              ? `Fix the ${fieldErrorCount === 1 ? "field" : `${fieldErrorCount} fields`} below and try again.`
              : errors._form}
          </div>
        </div>
      )}

      <div className="formwrap">
        <form className="form" onSubmit={onSubmit} noValidate>
          <div className="form__body">
            <div className="field-row">
              <div className="field">
                <label htmlFor="hostname">Hostname</label>
                <input
                  id="hostname"
                  className={`input mono${errors.hostname ? " input--error" : ""}`}
                  value={form.hostname}
                  onChange={set("hostname")}
                  placeholder="e.g. nas-01"
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                  aria-invalid={!!errors.hostname}
                />
                {errors.hostname ? (
                  <FieldError message={errors.hostname} />
                ) : (
                  <div className="field__help">
                    Letters, digits and hyphens (RFC 1123). Must be unique.
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="name">
                  Display name <span className="opt">(optional)</span>
                </label>
                <input
                  id="name"
                  className={`input${errors.name ? " input--error" : ""}`}
                  value={form.name}
                  onChange={set("name")}
                  placeholder="e.g. Storage NAS"
                  maxLength={100}
                  aria-invalid={!!errors.name}
                />
                <FieldError message={errors.name} />
              </div>
            </div>

            <fieldset className="field">
              <legend>Type</legend>
              <div className={`types${errors.deviceType ? " types--error" : ""}`}>
                {DEVICE_TYPES.map((type) => (
                  <label key={type} className={`tile${form.deviceType === type ? " tile--sel" : ""}`}>
                    <input
                      type="radio"
                      name="deviceType"
                      value={type}
                      checked={form.deviceType === type}
                      onChange={set("deviceType")}
                    />
                    <DeviceTypeIcon type={type} size={22} strokeWidth={1.8} />
                    {type}
                  </label>
                ))}
              </div>
              <FieldError message={errors.deviceType} />
            </fieldset>

            <div className="field">
              <label htmlFor="group">
                Group <span className="opt">(optional)</span>
              </label>
              <select
                id="group"
                className={`input${errors.deviceGroupId ? " input--error" : ""}`}
                value={form.deviceGroupId}
                onChange={set("deviceGroupId")}
              >
                <option value="">No group</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.deviceGroupId ? (
                <FieldError message={errors.deviceGroupId} />
              ) : (
                <div className="field__help">Where the device lives. Used to filter the overview.</div>
              )}
            </div>
          </div>

          <div className="form__foot">
            <Link className="btn btn--secondary" to="/devices">
              Cancel
            </Link>
            <button className="btn" type="submit" disabled={createDevice.isPending}>
              {createDevice.isPending ? "Registering…" : "Register device"}
            </button>
          </div>
        </form>

        <div className="panel steps">
          <h2>What happens next</h2>
          <div className="step">
            <div className="step__num">1</div>
            <div>
              <div className="step__title">Register the device</div>
              <div className="step__desc">It is added to your inventory with status Unknown.</div>
            </div>
          </div>
          <div className="step">
            <div className="step__num">2</div>
            <div>
              <div className="step__title">Start the agent on it</div>
              <div className="step__desc">The agent identifies itself by the hostname you enter here.</div>
            </div>
          </div>
          <div className="step">
            <div className="step__num">3</div>
            <div>
              <div className="step__title">Watch it come online</div>
              <div className="step__desc">
                The first heartbeat marks it Online. No heartbeat for 2 min marks it Offline.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
