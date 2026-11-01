import React from "react";
import { Icon, IconName } from "../Icon/Icon";

export interface InfoBoxProps {
  type: "info" | "error";
  children: React.ReactNode;
}

const variantClasses: Record<InfoBoxProps["type"], { container: string; icon: IconName }> = {
  info: {
    container: "bg-blue-50 border-blue-500 text-blue-900",
    icon: "info",
  },
  error: {
    container: "bg-red-50 border-red-500 text-red-900",
    icon: "error",
  },
};

export const InfoBox = ({ type, children }: InfoBoxProps) => {
  const { container, icon } = variantClasses[type];
  return (
    <div role={type === "error" ? "alert" : "status"} className={`flex items-start gap-2 p-3 rounded border-l-4 ${container}`}>
      <Icon name={icon} className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="text-sm">{children}</div>
    </div>
  );
};

export default InfoBox;
