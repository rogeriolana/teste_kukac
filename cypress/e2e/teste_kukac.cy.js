describe('Kanban - Criar Lista, Card, interagir no modal, excluir card e excluir lista', () => {
  beforeEach(() => {
    cy.visit('https://kanban-dusky-five.vercel.app/')
  })

  it('Fluxo completo: criar lista, criar card, abrir modal, selecionar cor, adicionar tag, excluir card e lista', () => {
    const nomeLista = 'Nova Lista de Teste'
    const nomeCard = 'Meu Card de Teste'

    // 1. Criar nova lista
    cy.get('.sc-jqUVSM.kJTISr')
      .should('be.visible')
      .and('contain.text', 'Adicionar outra lista')
      .click()

    cy.get('.sc-jqUVSM.kJTISr input[type="text"]')
      .should('be.visible')
      .type(nomeLista)

    cy.get('.sc-jqUVSM.kJTISr button[type="submit"]')
      .should('be.visible')
      .and('contain.text', 'Adicionar Lista')
      .click()

    cy.contains('h1.board-header-title', nomeLista)
      .should('exist')
      .parents('.sc-iBkjds.iLVyJp')
      .as('novaLista')

    // 2. Adicionar card
    cy.get('@novaLista')
      .find('.sc-ftvSup.iZjleo')
      .should('be.visible')
      .click()

    cy.get('@novaLista')
      .find('form input[type="text"]')
      .should('be.visible')
      .type(nomeCard)

    cy.get('@novaLista')
      .find('form button[type="submit"]')
      .should('be.visible')
      .click()

    cy.get('@novaLista')
      .find('.board-cards .sc-gKXOVf .content header p')
      .contains(nomeCard)
      .should('be.visible')

    // 3. Abrir o card (modal)
    cy.get('@novaLista')
      .find('.board-cards .sc-gKXOVf .content header p')
      .contains(nomeCard)
      .click()

    // 4. Garantir que o modal abriu
    cy.get('header[id$="ModalTitle"]')
      .should('be.visible')
      .and('contain.text', nomeCard)

    // 5. Selecionar a primeira cor
    cy.get('li[id$="Color"]').first().should('be.visible').click()

    // 6. Adicionar nova tag
    cy.contains('div.custom-input p', 'Adicionar nova Tag')
      .should('be.visible')
      .click()

    cy.get('input[type="text"]').last()
      .should('be.visible')
      .type('Tag Cypress{enter}')

    // 7. Fechar modal clicando fora
    cy.get('body').click(50, 50)

    // 8. Remover a classe 'trash' do SVG do card para torná-lo visível
    cy.get('@novaLista')
      .find('.board-cards .sc-gKXOVf .content header svg')
      .invoke('removeClass', 'trash')

    // 9. Clicar no ícone de exclusão do card
    cy.get('@novaLista')
      .find('.board-cards .sc-gKXOVf .content header svg')
      .click()

    // 10. Excluir lista usando seletor com escapes para espaços
    cy.get(`#${nomeLista.replace(/ /g, '\\ ')}trash > svg`)
      .should('be.visible')
      .click()

    // 11. Validar que a lista não existe mais
    cy.contains('h1.board-header-title', nomeLista)
      .should('not.exist')
  })
    it('Fluxo completo: criar lista, criar card, abrir modal, selecionar cor, adicionar tag, excluir card e lista', () => {
    const nomeLista = 'Nova Lista de Teste'
    const nomeCard  = 'Meu Card de Teste'

    // 1) Criar nova lista
    cy.get('.sc-jqUVSM.kJTISr')
      .should('be.visible')
      .and('contain.text', 'Adicionar outra lista')
      .click()

    cy.get('.sc-jqUVSM.kJTISr input[type="text"]').should('be.visible').type(nomeLista)
    cy.get('.sc-jqUVSM.kJTISr button[type="submit"]').should('be.visible').and('contain.text', 'Adicionar Lista').click()

    cy.contains('h1.board-header-title', nomeLista)
      .should('exist')
      .parents('.sc-iBkjds.iLVyJp')
      .as('novaLista')

    // 2) Adicionar card
    cy.get('@novaLista').find('[id$="CreateTask"]').should('be.visible').click()
    cy.get('@novaLista').find('form input[type="text"]').should('be.visible').type(nomeCard)
    cy.get('@novaLista').find('form button[type="submit"]').should('be.visible').click()

    cy.get('@novaLista')
      .contains('.content header p', nomeCard)
      .should('be.visible')

    // 3) Abrir o card (modal)
    cy.get('@novaLista')
      .contains('.content header p', nomeCard)
      .click()

    // 4) Garantir que o modal abriu
    cy.get('header[id$="ModalTitle"]').should('be.visible').and('contain.text', nomeCard)

    // 5) Selecionar a primeira cor
    cy.get('li[id$="Color"]').first().should('be.visible').click()

    // 6) Adicionar nova tag
    cy.contains('div.custom-input p', 'Adicionar nova Tag').should('be.visible').click()
    cy.get('input[type="text"]').last().should('be.visible').type('Tag Cypress{enter}')

    // 7) Fechar modal clicando fora
    cy.get('body').click(50, 50)

    // 8) Excluir o card: pega o HEADER do card pelo texto e clica no SVG de lixeira (removendo a classe que oculta)
    cy.get('@novaLista')
      .contains('.content header p', nomeCard)
      .parent('header')
      .find('svg')
      .invoke('removeClass', 'trash') // torna clicável se a classe esconder
      .click()

    // 9) Validar que o card sumiu (no container, sem usar .find que exige existir)
    cy.get('@novaLista')
      .find('.board-cards')
      .should('not.contain.text', nomeCard)

    // 10) Excluir a lista (id = nome + "trash", com espaços escapados)
    cy.get(`#${nomeLista.replace(/ /g, '\\ ')}trash > svg`).should('be.visible').click()

    // 11) Validar que a lista não existe mais
    cy.contains('h1.board-header-title', nomeLista).should('not.exist')
  })

  it('Cria um card no "Done" e move para "To Do" (drag & drop)', () => {
    const tituloCard = `Mover via Cypress ${Date.now()}`

    // Pegar colunas por título
    cy.contains('h1.board-header-title', /Done/i)
      .should('be.visible')
      .parents('.sc-iBkjds.iLVyJp')
      .as('colDone')

    cy.contains('h1.board-header-title', /To Do/i)
      .should('be.visible')
      .parents('.sc-iBkjds.iLVyJp')
      .as('colTodo')

    // Criar card em Done
    cy.get('@colDone').find('[id$="CreateTask"]').should('be.visible').click()
    cy.get('@colDone').find('form input[type="text"]').should('be.visible').type(tituloCard)
    cy.get('@colDone').find('form button[type="submit"]').should('be.visible').click()

    // Capturar o card PELO TEXTO e subir para o contêiner draggable
    cy.get('@colDone')
      .contains('.content header p', tituloCard)
      .should('be.visible')
      .parents('[draggable="true"]')
      .as('card')

    // Drag & Drop: Done -> To Do (HTML5 DataTransfer)
    cy.window().then((win) => {
      const dataTransfer = new win.DataTransfer()

      cy.get('@card').trigger('dragstart', { dataTransfer })
      cy.get('@colTodo').find('.board-cards')
        .trigger('dragenter', { dataTransfer })
        .trigger('dragover',  { dataTransfer })
        .trigger('drop',      { dataTransfer })
      cy.get('@card').trigger('dragend')
    })

    // Verificar que o card foi para "To Do" e saiu de "Done"
    cy.get('@colTodo').contains('.content header p', tituloCard).should('be.visible')
    cy.get('@colDone').contains('.content header p', tituloCard).should('not.exist')
  })
})








