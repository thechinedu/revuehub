import { beforeEach, context, cy, describe, it } from "local-cypress";

describe("User signup flow", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("[href='/sign-up']").first().click();
    cy.url().should("include", "/sign-up");

    cy.get("#email").as("email").should("be.focused");
    cy.get("#username").as("username");
    cy.get("#password").as("password");
    cy.get("[type='submit']").as("submit");
  });

  it("loads the page correctly", () => {
    cy.contains("RevueHub");
    cy.contains("Create your account");
  });

  it("user signup is allowed when the provided credentials are correct", () => {
    cy.get("@submit").should("be.disabled");

    cy.get("@email").type("test@example.com");
    cy.get("@username").type("testy");
    cy.get("@password").type("@mein passwort ist sup3r@");

    cy.get("@submit").should("be.enabled");
  });
});
