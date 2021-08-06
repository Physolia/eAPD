/// <reference types="cypress" />

import ExportPage from '../../../page-objects/export-page';

describe('Adding an activity in the Activity Dashboard', () => {
  const exportPage = new ExportPage();

  let apdUrl;
  const activities = [['Program Administration', 'HIT']];

  before(() => {
    cy.useStateStaff();
    cy.findByRole('button', { name: /Create new/i }).click();
    // cy.get('[href="/apd/354"]').click();

    // Gets to the activity page
    for (let i = 0; i < 3; i += 1) {
      cy.contains('Continue').click();
    }

    cy.url().should('include', '/activities');
    cy.wait(500); // eslint-disable-line cypress/no-unnecessary-waiting
    cy.location('pathname').then(pathname => {
      apdUrl = pathname;
    });
  });

  beforeEach(() => {
    cy.useStateStaff(apdUrl);
  });

  it('tests default added activity export view', () => {
    cy.contains('Add Activity').click();
    cy.contains('Untitled').should('exist');
    cy.contains('Add Activity').click();

    cy.contains('Delete').click();
    cy.contains('Delete Activity?').should('exist');
    cy.contains('Cancel').click();
    cy.contains('Activity 3: Untitled').should('exist');
    cy.contains('Delete').click();
    cy.findByRole('button', { name: /Delete Activity/i }).click();
    cy.contains('Activity 3: Untitled').should('not.exist');

    cy.goToExportView();
    cy.contains('2. |');
    exportPage.checkActivityHeader('', 2);
    exportPage.checkActivityNameAtEnd('Activity 2');
  });

  it('tests naming an activity', () => {
    cy.findAllByText('Edit').eq(1).click();

    cy.findByLabelText('Activity name').type('Secret Service Training App');
    cy.findByRole('checkbox', { name: /HIT/i }).check({ force: true });
    activities.push(['Secret Service Training App', 'HIT']);

    cy.findAllByText('Activity 2: Secret Service Training App').eq(0);
    cy.findAllByText('Activity 2: Secret Service Training App').eq(1);

    cy.goToExportView();
    exportPage.checkActivityList(activities);
    exportPage.checkActivityHeader(activities[1][0], 2);
    exportPage.checkActivityNameAtEnd(activities[1][0]);
  });
});
