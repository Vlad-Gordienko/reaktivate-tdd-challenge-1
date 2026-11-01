import React from "react";

export interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ className, width, height }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-gray-200 rounded ${className ?? ""}`.trim()}
      style={{ width, height }}
    />
  );
};
