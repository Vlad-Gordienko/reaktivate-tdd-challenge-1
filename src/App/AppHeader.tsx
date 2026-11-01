import React from "react";
import { InfoBox } from "../UiKit/InfoBox/InfoBox";

export interface AppHeaderProps {
  privateBooksCount: number;
}

export const AppHeader = ({ privateBooksCount }: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-3">
      <InfoBox type="info">Your books: {privateBooksCount}</InfoBox>
    </header>
  );
};

export default AppHeader;
