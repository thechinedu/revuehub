import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "icbfju",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:3000",
  },
  video: false,
  screenshotOnRunFailure: false,
});
