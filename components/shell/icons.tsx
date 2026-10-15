import type { SVGProps } from "react";

/**
 * Line icons used by the sidebar, traced from design/Main.html.
 * 24-unit grid, 1.8 stroke, round caps and joins, currentColor.
 */
export type IconName =
  | "home"
  | "tasks"
  | "intake"
  | "submissions"
  | "offers"
  | "merchants"
  | "funded"
  | "renewals"
  | "stacking"
  | "brokers"
  | "reports"
  | "settings"
  | "star"
  | "sidebar"
  | "chevrons";

const paths: Record<IconName, React.ReactNode> = {
  home: (
    <>
      <rect x="3" y="3" width="7" height="9" rx="2" />
      <rect x="14" y="3" width="7" height="5" rx="2" />
      <rect x="14" y="12" width="7" height="9" rx="2" />
      <rect x="3" y="16" width="7" height="5" rx="2" />
    </>
  ),
  tasks: (
    <>
      <path d="M9 11l3 3 8-8" />
      <path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" />
    </>
  ),
  intake: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  submissions: (
    <>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z" />
    </>
  ),
  offers: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 14l2 2 4-4" />
    </>
  ),
  merchants: <path d="M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6" />,
  funded: <path d="M3 17l6-6 4 4 8-8M14 7h7v7" />,
  renewals: <path d="M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5" />,
  stacking: <path d="M12 2l8 4-8 4-8-4zM4 12l8 4 8-4M4 17l8 4 8-4" />,
  brokers: (
    <>
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21v-1a6 6 0 0 1 12 0v1M16 4a4 4 0 0 1 0 8M22 21v-1a6 6 0 0 0-4-5.6" />
    </>
  ),
  reports: <path d="M3 3v18h18M8 17v-5M13 17V7M18 17v-8" />,
  settings: (
    <>
      <path d="M20 7h-9M14 17H4" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </>
  ),
  star: <path d="M12 3l2 5.5L20 10l-6 1.5L12 17l-2-5.5L4 10l6-1.5z" />,
  sidebar: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path d="M9 4v16" />
    </>
  ),
  chevrons: <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />,
};

export type IconProps = {
  name: IconName;
  size?: number;
  strokeWidth?: number;
} & Omit<SVGProps<SVGSVGElement>, "name">;

export function Icon({ name, size = 18, strokeWidth = 1.8, ...rest }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
