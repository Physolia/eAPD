
describe('state admin letters table', function () {
  
  const getInputByLabel = (label) => {
    return cy
      .contains('label', label)
      .invoke('attr', 'for')
      .then((id) => {
        cy.get('#' + id)
      })
  };
  
  before(function () {
    cy.useFedAdmin();
    cy.location('pathname').then(pathname => '/');
  });

  beforeEach(function () {
    cy.useFedAdmin('/');
  });
  

  it('tests default values', function () {
    // Filter labels
    cy.get('#state-admin-letters').contains('Status');
    cy.get('#state-admin-letters').contains('State');
    cy.get('#state-admin-letters').contains('Search');
    
    getInputByLabel('Status').should('have.value', '');
    getInputByLabel('State').should('have.value', '');
    getInputByLabel('Search').should('have.value', '');
        
    // Table column headers
    cy.get('#state-admin-letters').contains('Name');
    cy.get('#state-admin-letters').contains('Email');
    cy.get('#state-admin-letters').contains('FFY');
    cy.get('#state-admin-letters').contains('State');
    cy.get('#state-admin-letters').contains('Status');
    cy.get('#state-admin-letters').contains('View');
    cy.get('#state-admin-letters').contains('Actions');
    
    cy.get('#state-admin-letters').contains('Rows per page:');
  });
  
  it('allows filtering by status', function () {
    cy.get('#state-admin-letters td:contains(No Match)').should('have.length', 1);
    cy.get('#state-admin-letters td:contains(Pending Match)').should('have.length', 1);
    
    getInputByLabel('Status').select('Pending Match');    
    cy.get('#state-admin-letters td:contains(No Match)').should('have.length', 0);
    cy.get('#state-admin-letters td:contains(Pending Match)').should('have.length', 1);
    
    getInputByLabel('Status').select('No Match');
    cy.get('#state-admin-letters td:contains(No Match)').should('have.length', 1);
    cy.get('#state-admin-letters td:contains(Pending Match)').should('have.length', 0);
    
    getInputByLabel('Status').select('All');
    cy.get('#state-admin-letters td:contains(No Match)').should('have.length', 1);
    cy.get('#state-admin-letters td:contains(Pending Match)').should('have.length', 1);
  });  
  
  it('allows filtering by state', function () {
    cy.get('#state-admin-letters td:contains(AK)').should('be.visible');
    cy.get('#state-admin-letters td:contains(TN)').should('be.visible');

    getInputByLabel('State').select('AK');
    cy.get('#state-admin-letters td:contains(AK)').should('be.visible');
    cy.get('#state-admin-letters td:contains(TN)').should('have.length', 0);


    getInputByLabel('State').select('TN');
    cy.get('#state-admin-letters td:contains(AK)').should('have.length', 0);
    cy.get('#state-admin-letters td:contains(TN)').should('be.visible');

    getInputByLabel('State').select('All');
    cy.get('#state-admin-letters td:contains(AK)').should('be.visible');
    cy.get('#state-admin-letters td:contains(TN)').should('be.visible');
  });
  
  it('allows search filtering', function () {
    cy.get('#state-admin-letters td:contains(State Admin)').should('have.length', 2);

    getInputByLabel('Search').type('Leanne');

    cy.get('#state-admin-letters td:contains(State Admin)').should('have.length', 0);

    getInputByLabel('Search').clear().type('pending');

    cy.get('#state-admin-letters td:contains(State Admin)').should('have.length', 1);
  });

  it.only('shows possible match if present and allows matching', function () {
    getInputByLabel('Search').clear().type('pending');

    cy.get('.ds-c-button')
      .contains('Match To User')
      .should('have.length', 1)
      .click();
  });
});