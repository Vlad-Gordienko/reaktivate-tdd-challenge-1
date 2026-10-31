import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import booksRepository from "./Books/Books.repository";
import { createBooksViewModels } from "./Books/Books.composition";
import { BooksView } from "./Books/Books.view";

const { listViewModel, createViewModel, fetchAll } = createBooksViewModels(booksRepository);
fetchAll();

const rootElement = document.getElementById("root")!;
ReactDOM.render(
  <BooksView listViewModel={listViewModel} createViewModel={createViewModel} />,
  rootElement
);
