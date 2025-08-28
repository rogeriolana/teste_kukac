// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/commands.js

/**
 * @param {string} nomeLista 
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} 
 */
Cypress.Commands.add('criarLista', (nomeLista) => {
  cy.get('.sc-jqUVSM.kJTISr')
    .should('be.visible')
    .and('contain.text', 'Adicionar outra lista')
    .click();

  cy.get('.sc-jqUVSM.kJTISr input[type="text"]')
    .should('be.visible')
    .type(nomeLista);

  cy.get('.sc-jqUVSM.kJTISr button[type="submit"]')
    .should('be.visible')
    .and('contain.text', 'Adicionar Lista')
    .click();

  cy.contains('h1.board-header-title', nomeLista)
    .should('exist')
    .parents('.sc-iBkjds.iLVyJp')
    .as('novaLista');

  return cy.get('@novaLista');
});

/**
 * @param {string} nomeCard 
 * @param {string} aliasLista 
 * @returns {Cypress.Chainable<JQuery<HTMLElement>>} 
 */
Cypress.Commands.add('criarCard', (nomeCard, aliasLista) => {
  cy.get(`@${aliasLista}`)
    .find('[id$="CreateTask"]')
    .should('be.visible')
    .click();

  cy.get(`@${aliasLista}`)
    .find('form input[type="text"]')
    .should('be.visible')
    .type(nomeCard);

  cy.get(`@${aliasLista}`)
    .find('form button[type="submit"]')
    .should('be.visible')
    .click();

  return cy.get(`@${aliasLista}`).contains('.content header p', nomeCard).should('be.visible');
});

/**
 
 * @param {string} nomeCard 
 * @param {string} aliasLista 
 */
Cypress.Commands.add('excluirCard', (nomeCard, aliasLista) => {
  cy.get(`@${aliasLista}`)
    .contains('.content header p', nomeCard)
    .parent('header')
    .find('svg')
    .invoke('removeClass', 'trash')
    .click();

  cy.get(`@${aliasLista}`)
    .find('.board-cards')
    .should('not.contain.text', nomeCard);
});

/**

 * @param {string} nomeLista 
 */
Cypress.Commands.add('excluirLista', (nomeLista) => {
  cy.get(`#${nomeLista.replace(/ /g, '\\ ')}trash > svg`)
    .should('be.visible')
    .click();

  cy.contains('h1.board-header-title', nomeLista).should('not.exist');
});