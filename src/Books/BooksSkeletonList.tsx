import React from "react";
import { Skeleton } from "../UiKit/Skeleton/Skeleton";

export interface BooksSkeletonListProps {
  count?: number;
}

export const BooksSkeletonList = ({ count = 3 }: BooksSkeletonListProps) => {
  return (
    <div data-testid="books-skeleton" className="flex flex-col gap-2">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
};

export default BooksSkeletonList;
