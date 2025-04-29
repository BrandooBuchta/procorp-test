describe('Login', () => {
  it('Happy path: logs in successfully and accesses the dashboard', () => {
    cy.login('test@email.com', '123456');
    cy.url().should('include', '/dashboard');
    cy.contains('Users').should('be.visible');
  });

  it('Sad path: fails to login with wrong credentials', () => {
    cy.visit('/auth/sign-in');
    cy.get('input#email').type('wrong@email.com');
    cy.get('input#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/auth/sign-in');

    cy.contains('Invalid email or password').should('be.visible'); 
  });
});
