import React from "react";
import { observer } from "mobx-react";
import { BooksCreateViewModel } from "../ViewModel/BooksCreate.viewModel";
import { Input } from "../../UiKit/Input";
import { Button } from "../../UiKit/Button";
import { InfoBox } from "../../UiKit/InfoBox";

export interface BookCreateFormProps {
  viewModel: BooksCreateViewModel;
}

export const BookCreateForm = observer(({ viewModel }: BookCreateFormProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            value={viewModel.name}
            onChange={viewModel.setName}
            disabled={viewModel.isSubmitting}
            placeholder="Book name"
            data-testid="book-name-input"
          />
        </div>
        <div className="flex-1">
          <Input
            value={viewModel.author}
            onChange={viewModel.setAuthor}
            disabled={viewModel.isSubmitting}
            placeholder="Author"
            data-testid="book-author-input"
          />
        </div>
        <Button
          type="button"
          loading={viewModel.isSubmitting}
          onClick={() => viewModel.submitNewBook()}
        >
          Add
        </Button>
      </div>
      {viewModel.formError && <InfoBox type="error">{viewModel.formError}</InfoBox>}
    </div>
  );
});
