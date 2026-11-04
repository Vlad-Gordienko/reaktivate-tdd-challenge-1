import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "../ViewModel/BooksList.viewModel";
import { Tabs } from "../../UiKit/Tabs";
import {BooksScope} from "../Books.type";

export interface BooksScopeTabsProps {
  viewModel: BooksListViewModel;
}

export const BooksScopeTabs = observer(({ viewModel }: BooksScopeTabsProps) => {
  return (
    <Tabs
      options={[
        { label: "All books", value: "all" },
        { label: "Private books", value: "private" },
      ]}
      value={viewModel.scope}
      onChange={(value) => viewModel.setScope(value as BooksScope)}
    />
  );
});
