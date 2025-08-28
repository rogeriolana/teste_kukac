describe('Kanban - Teste com Comandos Customizados', () => {
  beforeEach(() => {
    cy.visit('https://kanban-dusky-five.vercel.app/');
  });

  it('Fluxo completo: criar lista, card, interagir no modal, excluir card e lista', () => {
    const nomeLista = 'Nova Lista de Teste Cypress';
    const nomeCard = 'Meu Card de Teste Cypress';

    cy.criarLista(nomeLista);

    cy.criarCard(nomeCard, 'novaLista');

    cy.get('@novaLista')
      .contains('.content header p', nomeCard)
      .click();

    cy.get('header[id$="ModalTitle"]')
      .should('be.visible')
      .and('contain.text', nomeCard);

    cy.get('li[id$="Color"]').first().should('be.visible').click();
    cy.contains('div.custom-input p', 'Adicionar nova Tag').should('be.visible').click();
    cy.get('input[type="text"]').last().should('be.visible').type('Tag Cypress{enter}');

    cy.get('body').click(50, 50);

    cy.excluirCard(nomeCard, 'novaLista');

    cy.excluirLista(nomeLista);
  });
});







