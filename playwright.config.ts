import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3012",
  },
  webServer: {
    command: "PORT=3012 NODE_OPTIONS=--openssl-legacy-provider BROWSER=none npm start",
    url: "http://localhost:3012",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
