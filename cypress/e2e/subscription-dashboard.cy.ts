describe(
  "subscription dashboard",
  () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it(
      "detects subscriptions from a CSV",
      () => {
        cy.get(
          "#csv-upload"
        ).selectFile(
          "cypress/fixtures/transactions.csv",
          {
            force: true
          }
        );

        cy.contains(
          "Netflix"
        ).should("be.visible");

        cy.contains(
          "Spotify"
        ).should("be.visible");

        cy.contains(
          "Amazon Prime"
        ).should("be.visible");
      }
    );

    it(
      "shows a price increase",
      () => {
        cy.get(
          "#csv-upload"
        ).selectFile(
          "cypress/fixtures/transactions.csv",
          {
            force: true
          }
        );

        cy.contains(
          "Price increased"
        ).should("be.visible");
      }
    );
  }
);