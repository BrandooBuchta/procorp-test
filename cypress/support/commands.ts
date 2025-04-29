Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/sign-in');
  cy.get('input#email').type(email);
  cy.get('input#password').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});
