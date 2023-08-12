describe("context menu", () => {
  beforeEach(() => {
    cy.login("admin", "admin");
  });

  it("adds T, adds child T, removes child T, removes T", () => {
    cy.contains("new territory").click();
    const rootLabel = "test T";
    cy.get("[data-cy=modal]").find("input").type(rootLabel);
    cy.contains("Save").click();

    cy.get("[data-cy=Territories-box]")
      .contains(rootLabel)
      .should("be.visible");
    cy.get("[data-cy=Statements-box]").contains(`T: ${rootLabel}`);
    cy.get("[data-cy=Detail-box]").contains(`${rootLabel}`);

    const label = "test child T";
    cy.get("[data-cy=tree-node]").as("treenode");
    cy.get("@treenode")
      .first()
      .find("[data-cy=territory-context-menu-trigger]")
      .trigger("mouseover");
    cy.get("#page")
      .find("[data-cy=territory-context-menu]")
      .find("button")
      .first()
      .click();

    cy.get("[data-cy=modal]").find("input").type(label);
    cy.contains("Save").click();
    cy.get("[data-cy=Territories-box]").contains(label).should("be.visible");

    // REMOVE
    cy.get("@treenode")
      .last()
      .find("[data-cy=territory-context-menu-trigger]")
      .trigger("mouseover");
    cy.get("#page")
      .find("[data-cy=territory-context-menu]")
      .find("button")
      .last()
      .click();
    cy.contains("Submit").click();
    cy.get("[data-cy=Territories-box]").should("not.contain", label);

    cy.get("@treenode")
      .first()
      .find("[data-cy=territory-context-menu-trigger]")
      .trigger("mouseover");
    cy.get("#page")
      .find("[data-cy=territory-context-menu]")
      .find("button")
      .last()
      .click();
    cy.contains("Submit").click();
    cy.get("[data-cy=Territories-box]").should("not.contain", rootLabel);
  });
});
