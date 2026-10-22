import type { CSSProperties } from "react";
export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M5 19 19 5M5 5h14v14" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
export function Asterisk({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {[0, 45, 90, 135].map((angle) => (
        <rect
          key={angle}
          x="43"
          y="4"
          width="14"
          height="92"
          rx="1"
          fill="currentColor"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
    </svg>
  );
}
export function SmallIcon({
  name,
}: {
  name:
    | "users"
    | "clock"
    | "wifi"
    | "check"
    | "close"
    | "chevron"
    | "refresh"
    | "code";
}) {
  const paths = {
    users:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    clock: "M12 8v4l3 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
    wifi: "M2 8.8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 3.2a6 6 0 0 1 8 0M12 19h.01",
    check: "m5 12 4 4L19 6",
    close: "m6 6 12 12M6 18 18 6",
    chevron: "m9 5 7 7-7 7",
    refresh: "M20 7v5h-5M4 17v-5h5M6 6a8 8 0 0 1 13 2M5 16a8 8 0 0 0 13 2",
    code: "m8 5-6 7 6 7m8-14 6 7-6 7M14 3l-4 18",
  };
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
