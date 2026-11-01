import React from "react";
import ReactDOM from "react-dom";

import "./reset.css";
import "./tailwind.css";
import booksRepository from "./Books/Books.repository";
import { createBooksViewModels } from "./Books/Books.composition";
import { App } from "./App/App";

const { listViewModel, createViewModel, fetchAll } = createBooksViewModels(booksRepository);
fetchAll();

const rootElement = document.getElementById("root")!;
ReactDOM.render(
  <App listViewModel={listViewModel} createViewModel={createViewModel} />,
  rootElement
);
