function Svg({ size = 18, color = "currentColor", strokeWidth = 2, children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ServerIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </Svg>
  );
}

export function ComputerIcon(props) {
  return (
    <Svg {...props}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </Svg>
  );
}

export function MobileIcon(props) {
  return (
    <Svg {...props}>
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M11 18h2" />
    </Svg>
  );
}

export function OtherIcon(props) {
  return (
    <Svg {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 12h6" />
    </Svg>
  );
}

export function PlusIcon(props) {
  return (
    <Svg strokeWidth={2.4} {...props}>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

export function PlusCircleIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function ChevronRightIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <Svg strokeWidth={2.2} {...props}>
      <path d="M15 6l-6 6 6 6" />
    </Svg>
  );
}

export function AlertIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </Svg>
  );
}

export function CheckIcon(props) {
  return (
    <Svg strokeWidth={2.4} {...props}>
      <path d="M5 12l5 5 9-10" />
    </Svg>
  );
}

export function CopyIcon(props) {
  return (
    <Svg {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </Svg>
  );
}

const TYPE_ICONS = {
  Server: ServerIcon,
  Computer: ComputerIcon,
  Mobile: MobileIcon,
  Other: OtherIcon,
};

export function DeviceTypeIcon({ type, ...props }) {
  const Icon = TYPE_ICONS[type] ?? OtherIcon;
  return <Icon {...props} />;
}
