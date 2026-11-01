import React from "react";
import { BooksErrorType } from "../Books.repository";
import { InfoBox } from "../../UiKit/InfoBox";

export interface BooksErrorStateProps {
  errorKind: BooksErrorType;
}

const messages: Record<BooksErrorType, string> = {
  network: "We couldn't load your books. Check your internet connection and try again.",
  server: "Something went wrong on our end. Please try again later.",
  unknown: "Something went wrong. Please try again.",
};

export const BooksErrorState = ({ errorKind }: BooksErrorStateProps) => {
  const message = messages[errorKind] ?? messages.unknown;
  return <InfoBox type="error">{message}</InfoBox>;
};
