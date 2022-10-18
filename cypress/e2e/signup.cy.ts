import { afterEach, beforeEach, cy, describe, it } from "local-cypress";

describe("User signup flow", () => {
  beforeEach(() => {
    cy.exec("yarn db:migrate");

    cy.visit("/");
    cy.get("[href='/sign-up']").first().click();
    cy.url().should("include", "/sign-up");
  });

  afterEach(() => {
    cy.exec("yarn db:rollback");
  });

  it("loads the page correctly", () => {
    cy.contains("RevueHub");
    cy.contains("Create your account");
  });

  it("user signup is allowed when the provided credentials are correct", () => {
    cy.get("[type='submit']").should("be.disabled");

    cy.get("#email").should("be.focused").type("test@example.com");
    cy.get("#username").type("testy");
    cy.get("#password").type("@mein passwort ist sup3r@");
    cy.get("[type='submit']").should("be.enabled").click();

    cy.url().should("include", "/dashboard");
  });
});
