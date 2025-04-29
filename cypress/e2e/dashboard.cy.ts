describe('Dashboard Functionality', () => {
  beforeEach(() => {
    cy.login("test@email.com", "123456");
    cy.visit('/dashboard');
  });

  const tabs = [
    { name: "Users", path: "Users" },
    { name: "Activity Chart", path: "Activity%20Chart" },
    { name: "Recent Logins", path: "Recent%20Logins" },
    { name: "Suspicious Activity", path: "Suspicious%20Activity" },
  ];

  it('should display default tab (Users)', () => {
    cy.url().should('include', '/dashboard');
    cy.contains('Users').should('be.visible');
  });

  it('should test that all tabs are working properly', () => {
    tabs.forEach(({ name, path }) => {
      cy.get(`[data-cy="item-${encodeURIComponent(name)}"]`).click();
  
      cy.url().should('include', `tab=${path}`);
  
      const checkText = name.split(' ')[0];
      cy.contains(checkText).should('be.visible');
    });  
  });

});
