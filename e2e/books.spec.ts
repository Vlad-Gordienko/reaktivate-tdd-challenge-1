import { test, expect, Route } from "@playwright/test";
import { API_HOST, USER_ID } from "../src/Shared/config";

const ALL_BOOKS_URL = `${API_HOST}/v1/books/${USER_ID}`;
const PRIVATE_BOOKS_URL = `${API_HOST}/v1/books/${USER_ID}/private`;

interface BookDto {
  id?: number;
  name: string;
  author: string;
  ownerId: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const fulfillJson = (route: Route, body: unknown) => {
  if (route.request().method() === "OPTIONS") {
    return route.fulfill({ status: 204, headers: CORS_HEADERS });
  }
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  });
};

const exactUrl = (expected: string) => (url: URL) => url.toString() === expected;

const DUNE: BookDto = { id: 1, name: "Dune", author: "Frank Herbert", ownerId: USER_ID };
const NINETEEN_EIGHTY_FOUR: BookDto = { id: 2, name: "1984", author: "George Orwell", ownerId: USER_ID };
const NEUROMANCER: BookDto = { id: 3, name: "Neuromancer", author: "William Gibson", ownerId: USER_ID };

test.describe("Books page (mocked API)", () => {
  test.beforeEach(async ({ page }) => {
    // any request to the real API that is not explicitly mocked is aborted.
    await page.route(`${API_HOST}/**`, (route) => route.abort());
  });

  test("loading the page shows the all-books list", async ({ page }) => {
    await page.route(exactUrl(ALL_BOOKS_URL), (route) =>
      fulfillJson(route, [DUNE, NINETEEN_EIGHTY_FOUR])
    );
    await page.route(exactUrl(PRIVATE_BOOKS_URL), (route) => fulfillJson(route, []));

    await page.goto("/");

    await expect(page.getByText("Frank Herbert: Dune", { exact: true })).toBeVisible();
    await expect(page.getByText("George Orwell: 1984", { exact: true })).toBeVisible();
    await expect(page.getByText("Your books: 0", { exact: true })).toBeVisible();
  });

  test("switching to private books shows only the private list", async ({ page }) => {
    await page.route(exactUrl(ALL_BOOKS_URL), (route) =>
      fulfillJson(route, [DUNE, NINETEEN_EIGHTY_FOUR])
    );
    await page.route(exactUrl(PRIVATE_BOOKS_URL), (route) => fulfillJson(route, [NEUROMANCER]));

    await page.goto("/");
    await expect(page.getByText("Frank Herbert: Dune", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Private books" }).click();

    await expect(page.getByText("William Gibson: Neuromancer", { exact: true })).toBeVisible();
    await expect(page.getByText("Frank Herbert: Dune", { exact: true })).toHaveCount(0);
    await expect(page.getByText("George Orwell: 1984", { exact: true })).toHaveCount(0);
  });

  test("adding a book makes it appear in the list", async ({ page }) => {
    const added: BookDto[] = [];
    let postedPayload: unknown = null;

    await page.route(exactUrl(PRIVATE_BOOKS_URL), (route) => fulfillJson(route, []));
    await page.route(exactUrl(ALL_BOOKS_URL), async (route) => {
      if (route.request().method() === "POST") {
        postedPayload = route.request().postDataJSON();
        const { name, author } = postedPayload as { name: string; author: string };
        added.push({ name, author, ownerId: USER_ID });
        return fulfillJson(route, { status: "ok" });
      }
      return fulfillJson(route, [DUNE, ...added]);
    });

    await page.goto("/");
    await expect(page.getByText("Frank Herbert: Dune", { exact: true })).toBeVisible();

    await page.getByTestId("book-name-input").fill("Snow Crash");
    await page.getByTestId("book-author-input").fill("Neal Stephenson");
    await page.getByRole("button", { name: "Add", exact: true }).click();

    await expect(page.getByText("Neal Stephenson: Snow Crash", { exact: true })).toBeVisible();
  });
});
