import BudgetPage from '../../page-objects/budget-page';
import ActivityPage from '../../page-objects/activity-page';
import ActivitySchedulePage from '../../page-objects/activity-schedule-page';
import ExportPage from '../../page-objects/export-page';
import ProposedBudgetPage from '../../page-objects/proposed-budget-page';
import FillOutActivityPage from '../../page-objects/fill-out-activity-page';


/// <reference types="cypress" />

// Tests performing basic APD tasks

/* eslint-disable no-return-assign */
/* eslint-disable prefer-arrow-callback */

describe('APD Basics', { tags: ['@apd', '@default'] }, () => {
  let apdUrl;
  const years = [];
  const pageTitles = [
    'APD Overview',
    'Key State Personnel',
    'Results of Previous Activities',
    'Activities',
    'Activity Schedule Summary',
    'Proposed Budget',
    'Assurances and Compliance',
    'Executive Summary',
    'Export and Submit'
  ];

  before(() => {
    cy.useStateStaff();

    cy.findByRole('button', { name: /Create new/i }).click();
    cy.findByRole('heading', { name: /APD Overview/i }).should('exist');
    cy.location('pathname').then(pathname => {
      apdUrl = pathname.replace('/apd-overview', '');
    });
  });

  beforeEach(() => {
    cy.visit(apdUrl);
  });

  describe('Create APD', () => {
    it('creates a default new APD and handles changing the name', () => {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const today = new Date();

      cy.get('#apd-header-info').contains(
        `Created: ${today.toLocaleDateString('en-us', options)}`
      );

      cy.get('#apd-header-info').contains(
        `Created: ${today.toLocaleDateString('en-us', options)}`
      );

      cy.log('change the APD name');
      const title1 = 'HITECH IAPD';
      const title2 = 'My Awesome eAPD';
      const title3 = 'Magnus Archive Project';

      cy.get('#apd-title-input').contains(`${title1}`);

      // Change name in APD Summary text box
      cy.findByLabelText('APD Name').clear().type(`${title2}`).blur();

      cy.get('#apd-title-input').contains(`${title2}`).click();

      // Change name via APD Header
      cy.focused()
        .should('have.attr', 'id', 'apd-title-input')
        .clear()
        .type(`${title3}`)
        .blur();

      cy.get('#apd-title-input').contains(`${title3}`);

      // Change name by clicking EDIT button
      cy.get('#title-edit-link').click();

      cy.focused()
        .should('have.attr', 'id', 'apd-title-input')
        .clear()
        .type(`${title2}`)
        .blur();

      cy.get('#apd-title-input').contains(`${title2}`);
      cy.get('[type="checkbox"][checked]').should('have.length', 2);
      cy.get('[type="checkbox"][checked]').each((_, index, list) =>
        years.push(list[index].value)
      );
    });
  });

  describe('Navigation', () => {
    it('confirms navigation', () => {
      cy.log('Click through Continue buttons');
      cy.wrap([...pageTitles]).each((title, index, titles) => {
        cy.get('.ds-c-vertical-nav__item').contains(title).click();
        cy.get('.ds-h2').should('contain', title);

        cy.log(`${titles[index + 1]}`);
        if (index < titles.length - 1) {
          cy.get('#continue-button').click();
          cy.get('.ds-h2').should('contain', titles[index + 1]);
        }
      });

      cy.log('Click through Previous buttons');
      cy.wrap([...pageTitles].reverse()).each((title, index, reverseTitles) => {
        cy.get('.ds-c-vertical-nav__item').contains(title).click();
        cy.get('.ds-h2').should('contain', title);

        if (index < reverseTitles.length - 1) {
          cy.get('#previous-button').click();
          cy.get('.ds-h2').should('contain', reverseTitles[index + 1]);
        }
      });

      cy.log('confirms side nav buttons redirect to correct sections');
      const pages = [
        { parent: 'APD Overview', label: '' },
        {
          parent: 'Key State Personnel',
          label: 'Key Personnel and Program Management'
        },
        {
          parent: 'Results of Previous Activities',
          label: 'Results of Previous Activities'
        },
        { parent: 'Activities', label: '' },
        { parent: 'Activity Schedule Summary', label: '' },
        { parent: 'Proposed Budget', label: 'Proposed Budget' },
        { parent: 'Assurances and Compliance', label: '' },
        { parent: 'Executive Summary', label: 'Executive Summary' },
        { parent: 'Export and Submit', label: '' }
      ];

      cy.wrap(pages).each(index => {
        if (index.label !== '') {
          // Expand nav menu option
          cy.get('.ds-c-vertical-nav__label--parent')
            .contains(index.parent)
            .then($el => {
              if ($el.attr('aria-expanded') === 'false') {
                // if it's not expanded, expand it
                cy.wrap($el).click();
              }

              // Click on nav submenu button
              cy.get('a.ds-c-vertical-nav__label')
                .contains(index.label)
                .click();
            });
        } else {
          cy.get('a.ds-c-vertical-nav__label').contains(index.parent).click();
        }

        cy.get('.ds-h2').should('contain', index.parent);
      });

      cy.log('confirms anchor links redirect to correct sections');
      const pageWithAnchors = [
        {
          parent: 'Key State Personnel',
          label: 'Key Personnel and Program Management',
          subnav: '#apd-state-profile-key-personnel'
        },
        {
          parent: 'Results of Previous Activities',
          label: 'Prior Activities Overview',
          subnav: ['#prev-activities-outline', '#prev-activities-table']
        },
        {
          parent: 'Proposed Budget',
          label: 'Summary Budget by Activity',
          subnav: [
            '#summary-schedule-by-activity-table',
            '#budget-summary-table',
            '#budget-federal-by-quarter',
            '#budget-incentive-by-quarter'
          ]
        },
        {
          parent: 'Executive Summary',
          label: 'Activities Summary',
          subnav: [
            '#executive-summary-summary',
            '#executive-summary-budget-table'
          ]
        }
      ];

      cy.wrap(pageWithAnchors).each(index => {
        const { subnav } = index;

        cy.get('.ds-c-vertical-nav__label--parent')
          .contains(index.parent)
          .then($el => {
            if ($el.attr('aria-expanded') === 'false') {
              // if it's not expanded, expand it
              cy.wrap($el).click();
            }

            // Click on anchor link
            cy.get('a.ds-c-vertical-nav__label').contains(index.label).click();
          });

        if (Array.isArray(subnav)) {
          cy.wrap(subnav).each(sub => {
            cy.get(sub)
              .then(element => element[0].offsetTop)
              .then(() => cy.window().its('scrollY').should('be.gt', 0))
              .then(offset => cy.window().its('scrollY').should('eq', offset));
          });
        } else {
          cy.get(subnav)
            .then(element => element[0].offsetTop)
            .then(() => cy.window().its('scrollY').should('be.gt', 0))
            .then(offset => cy.window().its('scrollY').should('eq', offset));
        }
      });

      cy.log(
        'should go to the Activity Overview page when edit is clicked in Executive Summary'
      );
      cy.goToExecutiveSummary();

      cy.get('#executive-summary-summary')
        .parent()
        .contains('div', 'Activity 1: Program Administration')
        .parent()
        .parent()
        .findByRole('button', { name: 'Edit' })
        .click();

      cy.findByRole('heading', {
        name: /^Activity 1:/i,
        level: 2
      }).should('exist');
      cy.findByRole('heading', { name: /Activity Overview/i }).should('exist');
    });
  });

  describe('Subforms', () => {
    let activityPage;
    let budgetPage;
    let schedulePage;
    let exportPage;
    let proposedBudgetPage;
    let fillOutActivityPage;

    before(() => {
      activityPage = new ActivityPage();
      budgetPage = new BudgetPage();
      schedulePage = new ActivitySchedulePage();
      exportPage = new ExportPage();
      proposedBudgetPage = new ProposedBudgetPage();
      fillOutActivityPage = new FillOutActivityPage();
    });

    it('should handle entering data', () => {
      cy.log('Key State Personnel');
      cy.goToKeyStatePersonnel();
      cy.findByRole('button', { name: /Add Primary Contact/i }).click();
      cy.findByRole('button', { name: /Cancel/i }).click();

      cy.get('.form-and-review-list')
        .contains(
          'Primary Point of Contact has not been added for this activity.'
        )
        .should('exist');

      cy.findByRole('button', { name: /Add Primary Contact/i }).click();
      cy.findByRole('button', { name: /Save/i }).click();

      // Get div for the element containing user data as an alias
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /1.*/i })
        .parent()
        .parent()
        .as('primaryContactVals');
      // Check for default values
      cy.get('@primaryContactVals')
        .findByRole('heading', {
          name: /Primary Point of Contact name not specified/i
        })
        .should('exist');
      cy.get('@primaryContactVals')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(2);
          expect($lis.eq(0)).to.contain('Primary APD Point of Contact');
          expect($lis.eq(1)).to.contain('Role not specified');
        });
      // Protects against edge case of having '$' in name or role
      cy.get('@primaryContactVals')
        .contains('Total cost:')
        .next()
        .shouldHaveValue(0);

      cy.get('@primaryContactVals').contains('Delete').should('not.exist');
      cy.get('@primaryContactVals').contains('Edit').should('exist');

      cy.findByRole('button', { name: /Add Key Personnel/i }).click();
      cy.findByRole('button', { name: /Save/i }).click();

      // Check for default values
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /2.*/i })
        .parent()
        .parent()
        .as('personnelVals1');
      cy.get('@personnelVals1')
        .findByRole('heading', { name: /Key Personnel name not specified/i })
        .should('exist');
      cy.get('@personnelVals1')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('Role not specified');
        });
      cy.get('@personnelVals1')
        .contains('Total cost:')
        .next()
        .shouldHaveValue(0);

      cy.get('@personnelVals1').contains('Delete').should('exist');
      cy.get('@personnelVals1').contains('Edit').should('exist');

      cy.get('.form-and-review-list')
        .findAllByRole('button', { name: /Edit/i })
        .eq(1)
        .click();

      cy.get('input[name="apd-state-profile-pocname1"]').type('Test cancel');

      cy.get('.form-and-review-list')
        .findByRole('button', { name: /Cancel/i })
        .click();

      cy.get('.ds-c-review__heading')
        .contains('2. Key Personnel name not specified')
        .should('exist');

      cy.findByRole('button', { name: /Add Key Personnel/i }).click();
      // Have to force check; cypress does not think radio buttons are visible
      cy.get('input[type="radio"][value="yes"]')
        .scrollIntoView()
        .check({ force: true });
      cy.findByRole('button', { name: /Save/i }).click();

      // Check for default values
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /3.*/i })
        .parent()
        .parent()
        .as('personnelVals2');
      cy.get('@personnelVals2')
        .findByRole('heading', { name: /Key Personnel name not specified/i })
        .should('exist');
      cy.get('@personnelVals2')
        .find('li')
        .should($lis => {
          expect($lis).to.have.length(1);
          expect($lis.eq(0)).to.contain('Role not specified');
        });

      // Check that FFY, FTE, and Total cost for each applicable year is 0.
      years.forEach(year => {
        cy.get('@personnelVals2').should(
          'contain',
          `FFY ${year} Cost: $0 | FTE: 0 | Total: $0`
        );
      });

      cy.log("Done")

      cy.get('@personnelVals2').contains('Delete').should('exist');
      cy.get('@personnelVals2').contains('Edit').should('exist');

      cy.log('Activity Dashboard');
      cy.goToActivityDashboard();

      // Testing add activity button at end of Activitiy
      cy.contains('Add Activity').click();
      cy.contains('Activity 2').should('exist');
      cy.contains('Delete').should('exist');
      cy.contains('Delete').click();
      cy.findByRole('button', { name: /Delete Activity/i }).click();
      cy.waitForSave();
      cy.contains('Activity 2').should('not.exist');

      const outcomes = [
        {
          outcome: 'This is an outcome.',
          metrics: ['One metric, ah ha ha', 'Two metrics, ah ha ha']
        }
      ];

      const milestones = [
        {
          milestoneName: "Miles's Milestone",
          dateMonth: 1,
          dateDay: 2,
          dateYear: 2023
        }
      ];

      cy.log('Outcomes and Milestones');
      cy.goToOutcomesAndMilestones(0);

      cy.wrap(outcomes).each((element, index) => {
        cy.findByRole('button', { name: /Add Outcome/i }).click();
        cy.get(`[data-cy='outcome-${index}']`).click().should('have.value', '');

        cy.findByRole('button', { name: /Cancel/i }).click();

        cy.get('.form-and-review-list')
          .contains('Add at least one outcome for this activity.')
          .should('exist');

        cy.findByRole('button', { name: /Add Outcome/i }).click();

        cy.get(`[data-cy='outcome-${index}']`)
          .click()
          .type(`${element.outcome}`)
          .blur()
          .should('not.have.class', 'ds-c-field--error');

        cy.findByRole('button', { name: /Save/i }).should('not.be.disabled');

        if (Array.isArray(element.metrics)) {
          cy.wrap(element.metrics).each((metric, i) => {
            cy.findByRole('button', { name: /Add Metric to Outcome/i }).click();

            cy.get(`[data-cy=metric-${index}-${i}]`)
              .click()
              .should('have.value', '');

            cy.get(`[data-cy=metric-${index}-${i}]`)
              .click()
              .type(`${metric}`)
              .blur()
              .should('not.have.class', 'ds-c-field--error');

            cy.findByRole('button', { name: /Save/i }).should(
              'not.be.disabled'
            );
          });
        }

        cy.findByRole('button', { name: /Save/i }).click();

        cy.get('.form-and-review-list')
          .eq(0)
          .findAllByRole('button', { name: /Edit/i })
          .click();

        cy.get(`[data-cy='outcome-${index}']`)
          .click()
          .clear()
          .type(`Test cancel`);

        cy.get('.form-and-review-list')
          .eq(0)
          .findByRole('button', { name: /Cancel/i })
          .click();

        activityPage.checkOutcomeOutput({
          outcome: element.outcome,
          metrics: element.metrics
        });
      });

      cy.contains('Edit').click();

      cy.get('[class="ds-c-review"]')
        .eq(1)
        .within(() => {
          cy.contains('Remove').should('exist');
        });

      cy.get('[class="ds-c-review"]')
        .eq(0)
        .within(() => {
          cy.contains('Remove').should('exist').click();
        });

      cy.findByRole('button', { name: /Save/i })
        .should('not.be.disabled')
        .click();

      cy.get('[class="ds-c-review"]').should('have.length', 1);

      cy.wrap(milestones).each((element, index) => {
        cy.findByRole('button', { name: /Add Milestone/i }).click();

        cy.get(`[data-cy=milestone-${index}]`).click().should('have.value', '');

        cy.findByRole('button', { name: /Cancel/i }).click();

        cy.get('.form-and-review-list')
          .contains('Add milestone(s) for this activity.')
          .should('exist');

        cy.findByRole('button', { name: /Add Milestone/i }).click();

        cy.get(`[data-cy=milestone-${index}]`)
          .click()
          .type(element.milestoneName);

        cy.get(`.ds-c-field--month`)
          .click()
          .type(element.dateMonth);

        cy.get(`.ds-c-field--day`)
          .click()
          .type(element.dateDay);

        cy.get(`.ds-c-field--year`)
          .click()
          .type(element.dateYear)
          .blur();

        cy.findByRole('button', { name: /Save/i })
          .click();

        cy.waitForSave();

        cy.get('.form-and-review-list')
          .eq(1)
          .findAllByRole('button', { name: /Edit/i })
          .click();

        cy.get(`[data-cy='milestone-${index}']`)
          .click()
          .clear()
          .type(`Test cancel`);

        cy.get('.form-and-review-list')
          .eq(1)
          .findByRole('button', { name: /Cancel/i })
          .click();

        activityPage.checkMilestoneOutput({
          milestone: element.milestoneName,
          targetDate: '1/2/2023'
        });
      });

      cy.log('State Staff and Expenses');
      cy.goToStateStaffAndExpenses(0);

      cy.findByRole('button', { name: /Add State Staff/i }).click();

      cy.findByRole('button', { name: /Cancel/i }).click();

      cy.get('.form-and-review-list')
        .contains('State staff have not been added for this activity.')
        .should('exist');

      cy.findByRole('button', { name: /Add State Staff/i }).click();

      activityPage.checkInputField('Personnel title', '');
      activityPage.checkInputField('Description', '');
      activityPage.checkStateStaffFFY({
        years,
        expectedValue: years.map(() => ({
          cost: '',
          fte: '',
          total: 0
        }))
      });
      
      cy.findByRole('button', { name: /Save/i }).should('be.disabled');
      
      cy.findByRole('button', { name: /Cancel/i }).click();
      
      const staffList = [
        {
          title: 'Test State Staff',
          description: 'Director of staffing and organizing staff for staffing needs and roles.',
          costs: [100000,100000],
          ftes: [1,1]
        }
      ];
      
      fillOutActivityPage.fillStateStaff(years, staffList);
      
      cy.get('.form-and-review-list')
        .eq(0)
        .findAllByRole('button', { name: /Edit/i })
        .click();

      cy.findByLabelText('Personnel title').clear().blur();
      cy.contains('Provide a personnel title.').should('exist');
      
      cy.findByLabelText('Description').clear().blur();
      cy.contains('Provide a personnel description.').should('exist');
      
      years.forEach((year) => {
        cy.get(`[name="[${year}].amt"`).clear().blur();
        cy.contains('Please provide a FTE cost greater than or equal to $0.').should('exist');
        cy.get(`[name="[${year}].perc"`).clear().blur();
        cy.contains('Provide a FTE number greater than or equal to 0.').should('exist');
      })
      

      cy.get('.form-and-review-list')
        .eq(0)
        .findByRole('button', { name: /Cancel/i })
        .click();
        
      activityPage.checkStateStaffOutput({
        name: 'Test State Staff',
        years,
        cost: 100000,
        fte: 1
      });

      cy.findByRole('button', { name: /Add State Expense/i }).click();

      cy.findByRole('button', { name: /Cancel/i }).click();

      cy.get('.form-and-review-list')
        .contains('Other state expenses have not been added for this activity.')
        .should('exist');

      cy.findByRole('button', { name: /Add State Expense/i }).click();

      activityPage.checkInputField('Description', '');
      activityPage.checkFFYinputCostFields({
        years,
        FFYcosts: years.map(() => '')
      });

      cy.findByRole('button', { name: /Save/i }).click();

      cy.get('.form-and-review-list')
        .eq(1)
        .findAllByRole('button', { name: /Edit/i })
        .click();

      cy.findByLabelText('Description').type('Test cancel');

      cy.get('.form-and-review-list')
        .eq(1)
        .findByRole('button', { name: /Cancel/i })
        .click();

      activityPage.checkOtherStateExpensesOutput({
        category: 'Category not specified',
        years,
        FFYcosts: [0, 0]
      });

      const privateContractor = {
        name: 'Test Private Contractor',
        description: 'Test description',
        start: [1, 1, 2020],
        end: [1, 2, 2023],
        totalCosts: 20,
        hourly: false,
        FFYcosts: [10, 10]
      };

      cy.log('Private Contractor Costs');
      cy.goToPrivateContractorCosts(0);

      cy.findByRole('button', { name: /Add Contractor/i }).click();

      cy.findByRole('button', { name: /Cancel/i }).click();

      cy.get('.form-and-review-list')
        .contains('Add private contractor(s) for this activity.')
        .should('exist');

      cy.findByRole('button', { name: /Add Contractor/i }).click();

      activityPage.checkTextField('ds-c-field', '');
      cy.get('input[name="name"]').focus().blur();
      cy.contains('Provide a private contractor or vendor name.').should(
        'exist'
      );

      activityPage.checkTinyMCE('contractor-description-field-0', '');

      activityPage.checkDate('Contract start date');
      cy.contains('Contract start date')
        .parent()
        .next('div')
        .within(() => cy.findByLabelText('Month').focus().blur());
      cy.contains('Provide a start date.').should('exist');

      activityPage.checkDate('Contract end date');
      cy.contains('Contract end date')
        .parent()
        .next('div')
        .within(() => cy.findByLabelText('Year').focus().blur());
      cy.contains('Provide an end date.').should('exist');

      activityPage.checkTextField(
        'ds-c-field ds-c-field--currency ds-c-field--medium',
        '',
        0
      );
      cy.get('[class="ds-c-field ds-c-field--currency ds-c-field--medium"]')
        .eq(0)
        .focus()
        .blur();
      cy.contains(
        'Provide a contract cost greater than or equal to $0.'
      ).should('exist');

      cy.get('[type="radio"][checked]').should('not.exist');
      years.forEach(year => {
        cy.contains(`FFY ${year} Cost`)
          .parent()
          .should('have.text', `FFY ${year} Cost$0`);
      });

      cy.findByRole('button', { name: /Save/i }).should('be.disabled');

      fillOutActivityPage.fillPrivateContactor(privateContractor, 0, years);

      cy.findByRole('button', { name: /Save/i })
        .should('not.be.disabled')
        .click();

      cy.get('.form-and-review-list')
        .eq(0)
        .findAllByRole('button', { name: /Edit/i })
        .click();

      cy.get('input[name="name"]').clear().type('Test cancel');

      cy.get('.form-and-review-list')
        .eq(0)
        .findByRole('button', { name: /Cancel/i })
        .click();

      activityPage.checkPrivateContractorOutput({
        name: privateContractor.name,
        description: privateContractor.description,
        start: privateContractor.start,
        end: privateContractor.end,
        totalCosts: privateContractor.totalCosts,
        years,
        FFYcosts: privateContractor.FFYcosts
      });

      cy.log('Budget and FFP');
      cy.goToBudgetAndFFP(0);

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Budget for FFY ${year}`)
            .parent()
            .parent()
            .within(() => {
              budgetPage.checkSplitFunctionality();

              cy.get('[class="ds-c-field"]').select('75-25');
              cy.waitForSave();
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.75,
                federalShareAmount: 8,
                stateSharePercentage: 0.25,
                stateShareAmount: 2,
                totalComputableMedicaidCost: 10
              });

              cy.get('[class="ds-c-field"]').select('50-50');
              cy.waitForSave();
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.5,
                federalShareAmount: 5,
                stateSharePercentage: 0.5,
                stateShareAmount: 5,
                totalComputableMedicaidCost: 10
              });

              cy.get('[class="ds-c-field"]').select('90-10');
              cy.waitForSave();
              budgetPage.checkCostSplitTable({
                federalSharePercentage: 0.9,
                federalShareAmount: 9,
                stateSharePercentage: 0.1,
                stateShareAmount: 1,
                totalComputableMedicaidCost: 10
              });
            });
        });
      });

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Activity 1 Budget for FFY ${year}`)
            .parent()
            .within(() => {
              cy.contains('State Staff')
                .parent()
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should(
                  'have.text',
                  'Not specified (APD Key Personnel)$0×0 FTE=$0'
                )
                .next()
                .should('have.text', 'Test State Staff$100,000×1 FTE=$100,000')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Category Not Selected$0')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Test Private Contractor$10');
            });
        });
      });

      cy.log('Activity Schedule Summary');
      cy.goToActivityScheduleSummary();
      schedulePage
        .getAllActivityScheduleMilestoneTables()
        .should('have.length', 1);

      // Activity 1 has index 0
      schedulePage
        .getActivityScheduleMilestoneTableName(0)
        .should('eq', 'Activity 1: Program Administration Milestones');

      // Get the first milestone for Activity 1
      schedulePage.getAllActivityScheduleMilestones(0).should('have.length', 1);
      schedulePage
        .getActivityScheduleMilestoneName(0, 0)
        .should('eq', "Miles's Milestone");

      cy.log('Proposed Budget');
      cy.goToProposedBudget();

      cy.then(() => {
        years.forEach(year => {
          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'State Staff'
            })
            .as('stateStaff');
          cy.get('@stateStaff')
            .eq(0)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(1)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(2)
            .should(
              'have.text',
              'Not specified (APD Key Personnel)$0×0 FTE=$0'
            );
          cy.get('@stateStaff')
            .eq(3)
            .should('have.text', 'Test State Staff$100,000×1 FTE=$100,000');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Other State Expenses'
            })
            .eq(0)
            .should('have.text', 'Category Not Selected$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Private Contractor'
            })
            .eq(0)
            .should('have.text', 'Test Private Contractor$10');
        });
      });

      cy.log('Export Views');
      cy.goToExportView();

      cy.findByRole('heading', { name: /Key State Personnel/i })
        .parent()
        .as('personnel');

      // Check text data for the first two personnel
      cy.get('@personnel')
        .findByRole('heading', {
          name: /Key Personnel and Program Management/i
        })
        .next()
        .find('ul')
        .first()
        .should(
          'have.text',
          '1. Primary Point of Contact name not specified' +
            'Primary APD Point of Contact' +
            'Role not specified' +
            'Email: ' +
            'Total cost: $0'
        )
        .next()
        .should(
          'have.text',
          '2. Key Personnel name not specified' +
            'Role not specified' +
            'Email: ' +
            'Total cost: $0'
        );

      // Create string to check for personnel who is chargeable for the project for certain years.
      let str = '3. Key Personnel name not specifiedRole not specifiedEmail: ';
      str += years
              .map(year => `FFY ${year} Cost: $0 | FTE: 0 | Total: $0`)
              .join('');

      cy.log(JSON.stringify(years));

      cy.get('@personnel')
        .findByRole('heading', {
          name: /Key Personnel and Program Management/i
        })
        .next()
        .find('ul')
        .eq(2)
        .should('have.text', str);

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationOutcomes and Metrics/i
      })
        .next()
        .next()
        .next()
        .next()
        .next()
        .next()
        .should('have.text', "1. Miles's Milestone")
        .next()
        .should('have.text', 'Target completion date:  1/2/2023');

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationState staff/i
      })
        .next()
        .should('have.text', '1. Test State Staff')
        .next()
        .next()
        .should(
          'have.text',
          years
            .map(year => `FFY ${year} Cost: $100,000 | FTEs: 1 | Total: $100,000`)
            .join('')
        );

      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationOther state expenses/i
      })
        .next()
        .should('have.text', '1. Category Not Selected')
        .next()
        .next()
        .should(
          'have.text',
          years.map(year => `FFY ${year} Cost: $0`).join('')
        );

      const privateContractorCosts = years
        .map(year => `FFY ${year} Cost: $10`)
        .join('');
      cy.findByRole('heading', {
        name: /Activity 1: Program AdministrationPrivate Contractor Costs/i
      })
        .next()
        .should('have.text', '1. Test Private Contractor')
        .next()
        .should(
          'have.text',
          'Procurement Methodology and Description of Services'
        )
        .next()
        .should('have.text', 'Test description')
        .next()
        .should(
          'have.text',
          `Full Contract Term: ${privateContractor.start.join(
            '/'
          )} - ${privateContractor.end.join(
            '/'
          )}Total Contract Cost: $20${privateContractorCosts}`
        );

      cy.then(() => {
        years.forEach(year => {
          cy.contains(`Activity 1 Budget for FFY ${year}`)
            .parent()
            .within(() => {
              cy.contains('State Staff')
                .parent()
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should('have.text', 'Not specified (APD Key Personnel)$0')
                .next()
                .should(
                  'have.text',
                  'Not specified (APD Key Personnel)$0×0 FTE=$0'
                )
                .next()
                .should('have.text', 'Test State Staff$100,000×1 FTE=$100,000')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Category Not Selected$0')
                .next()
                .next()
                .next()
                .next()
                .should('have.text', 'Test Private Contractor$10');
            });
        });
      });

      exportPage
        .getAllActivityScheduleMilestoneTables()
        .should('have.length', 1);
      // Activity 1 has index 0
      exportPage
        .getActivityScheduleMilestoneTableName(0)
        .should('eq', 'Activity 1: Program Administration Milestones');
      // Get the first milestone for Activity 1
      exportPage.getAllActivityScheduleMilestones(0).should('have.length', 1);
      exportPage
        .getActivityScheduleMilestoneName(0, 0)
        .should('eq', "Miles's Milestone");

      cy.then(() => {
        years.forEach(year => {
          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'State Staff'
            })
            .as('stateStaff');
          cy.get('@stateStaff')
            .eq(0)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(1)
            .should('have.text', 'Not specified (APD Key Personnel)$0');
          cy.get('@stateStaff')
            .eq(2)
            .should(
              'have.text',
              'Not specified (APD Key Personnel)$0×0 FTE=$0'
            );
          cy.get('@stateStaff')
            .eq(3)
            .should('have.text', 'Test State Staff$100,000×1 FTE=$100,000');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Other State Expenses'
            })
            .eq(0)
            .should('have.text', 'Category Not Selected$0');

          proposedBudgetPage
            .getBreakdownByFFYAndActivityAndExpense({
              ffy: year,
              index: 0,
              expense: 'Private Contractor'
            })
            .eq(0)
            .should('have.text', 'Test Private Contractor$10');
        });
      });
    });

    it('should handle deleting subform values', () => {
      cy.goToKeyStatePersonnel();

      const deleteKeyPersonnel = name => {
        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .parent()
          .parent()
          .contains('Delete')
          .click();
        cy.contains('Delete Key Personnel?').should('exist');
        cy.contains('Cancel').click();
        cy.contains('Delete Key Personnel?').should('not.exist');
        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .should('exist');

        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .parent()
          .parent()
          .contains('Delete')
          .click();
        cy.get('[class="ds-c-button ds-c-button--danger"]').click();
        cy.waitForSave();
        cy.contains('Delete Key Personnel?').should('not.exist');

        cy.get('.form-and-review-list')
          .findByRole('heading', { name })
          .should('not.exist');
      };

      deleteKeyPersonnel(/3.*/i);
      deleteKeyPersonnel(/2.*/i);

      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /1.*/i })
        .should('exist');
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /2.*/i })
        .should('not.exist');
      cy.get('.form-and-review-list')
        .findByRole('heading', { name: /3.*/i })
        .should('not.exist');

      cy.goToOutcomesAndMilestones(0);

      activityPage.checkDeleteButton(
        'Add at least one outcome for this activity.',
        'Delete Outcome and Metrics?',
        'This is an outcome.'
      );

      activityPage.checkDeleteButton(
        'Add milestone(s) for this activity.',
        'Delete Milestone?',
        "Miles's Milestone"
      );
      cy.goToStateStaffAndExpenses(0);

      activityPage.checkDeleteButton(
        'State staff have not been added for this activity.',
        'Delete State Staff Expenses?',
        'Test State Staff'
      );

      activityPage.checkDeleteButton(
        'Other state expenses have not been added for this activity.',
        'Delete Other State Expense?',
        'Category not specified'
      );

      cy.goToPrivateContractorCosts(0);

      activityPage.checkDeleteButton(
        'Add private contractor(s) for this activity',
        'Delete Private Contractor?',
        'Test Private Contractor'
      );
    });
  });

  describe('Delete APD', () => {
    it('deletes the APD', () => {
      cy.useStateStaff();

      cy.get(`a[href='${apdUrl}']`).should('exist');

      cy.get(`a[href='${apdUrl}']`)
        .parent()
        .parent()
        .parent()
        .contains('Delete')
        .click();

      cy.get('.ds-c-button--danger').click();

      cy.get(`a[href='${apdUrl}']`).should('not.exist');
    });
  });
});
