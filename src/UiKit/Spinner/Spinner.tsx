import React from "react";
import { Icon } from "../Icon/Icon";

export interface SpinnerProps {
  className?: string;
  size?: number;
}

export const Spinner = ({ className, size }: SpinnerProps) => {
  return <Icon name="spinner" size={size} className={`animate-spin ${className ?? ""}`.trim()} />;
};

export default Spinner;
