import React from "react";

export type IconName = "spinner" | "info" | "error";

export interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

const paths: Record<IconName, React.ReactNode> = {
  spinner: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <rect x="11" y="10" width="2" height="8" rx="1" fill="#fff" />
      <circle cx="12" cy="7" r="1.25" fill="#fff" />
    </>
  ),
  error: (
    <>
      <path d="M12 2.5 22.5 20.5h-21Z" fill="currentColor" strokeLinejoin="round" />
      <rect x="11" y="9" width="2" height="6" rx="1" fill="#fff" />
      <circle cx="12" cy="17.5" r="1.25" fill="#fff" />
    </>
  ),
};

export const Icon = ({ name, className, size = 20 }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
};

export default Icon;
