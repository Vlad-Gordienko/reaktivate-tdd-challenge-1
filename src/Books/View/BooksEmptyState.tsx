import React from "react";

export const BooksEmptyState = () => {
  const message = "You don't have any books yet.";
  return <p className="py-8 text-center text-sm text-gray-500">{message}</p>;
};

export default BooksEmptyState;
