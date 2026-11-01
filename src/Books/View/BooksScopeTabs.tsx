import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "../ViewModel/BooksList.viewModel";
import { BooksScope } from "../Books.repository";
import { Tabs } from "../../UiKit/Tabs";

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

export default BooksScopeTabs;
