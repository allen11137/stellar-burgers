import { BURGER_API_URL, TEST_API_URL } from '../../src/utils/constants';

describe('Конфигурация перехвата для конечной точки "api/ingredients"', () => {
  beforeEach(() => {
    cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients' });
    cy.visit(`${TEST_API_URL}`);
  });

  describe('Операции с модальными окнами', () => {
    it('Отображение деталей ингредиента', () => {
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').click();
      cy.get(`[data-cy=modal]`).as('modal').should('exist');
      cy.get(`[data-cy=modal-close]`).should('exist');
      cy.get('@modal').contains('h3', 'Детали ингредиента');
      cy.contains('p', 'Филе Люминесцентного тетраодонтимформа');
    
      cy.contains('div', /калории,? ккал/i).should(($div) => {
        expect($div).to.contain('643');
      });
  
      cy.contains('div', /белки,? г/i).should(($div) => {
        expect($div).to.contain('44');
      });
      
      cy.contains('div', /жиры,? г/i).should(($div) => {
        expect($div).to.contain('26');
      });
      
      cy.contains('div', /углеводы,? г/i).should(($div) => {
        expect($div).to.contain('85');
      });
    });

    it('Закрытие диалога через крестик', () => {
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').click();
      cy.get(`[data-cy=modal-close]`).click();
      cy.get(`[data-cy=modal]`).should('not.exist');
    });

    it('Закрытие диалога клавишей ESC', () => {
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').click();
      cy.get('body').type('{esc}');
      cy.get(`[data-cy=modal]`).should('not.exist');
    });
  });

  describe('Проверка функционала конструктора бургеров', () => {
    it('Добавление одиночного ингредиента в конструктор', () => {
      cy.contains('li', 'Краторная булка').find('button').click();
      cy.contains('span', 'Краторная булка').should('exist');
    });

    it('Добавление нескольких ингредиентов разных категорий', () => {  
        cy.get('[data-cy="1"]').find('button').click();
        cy.contains('Начинки').click();
        cy.get('[data-cy="6"]').find('button').click();
        cy.get('[data-cy="4"]').find('button').click();
        cy.get('[data-cy="7"]').find('button').click();
        cy.contains('Соусы').click();
        cy.get('[data-cy="14"]').find('button').click();

        cy.get('[data-cy="burgerConstructor"]').contains('Краторная булка');
        cy.get('[data-cy="burgerConstructor"]').contains('Говяжий метеорит (отбивная)');
        cy.get('[data-cy="burgerConstructor"]').contains('Филе Люминесцентного тетраодонтимформа');
        cy.get('[data-cy="burgerConstructor"]').contains('Хрустящие минеральные кольца');
        cy.get('[data-cy="burgerConstructor"]').contains('Соус традиционный галактически');
    });

    it('Замена булки в бургере', () => {
      cy.get('[data-cy="2"]').find('button').click();
      cy.get('[data-cy="1"]').find('button').click();
      cy.get('[data-cy="burgerConstructor"]').contains('Краторная булка').should('exist');
      cy.get('[data-cy="burgerConstructor"]').contains('Флюоресцентная булка').should('not.exist');
    });
  });

  describe('Процесс формирования заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', `${BURGER_API_URL}/auth/user`, { fixture: 'user.json' });
      cy.intercept('POST', `${BURGER_API_URL}/orders`, { fixture: 'order.json' }).as('createOrder');
      cy.setCookie('token', 'token');
      window.localStorage.setItem('token', 'token');
    });

it('Полный цикл оформления заказа', () => {
  
    cy.get('[data-cy="burgerConstructor"]').should('not.contain', 'Краторная булка');
    cy.get('[data-cy="burgerConstructor"]').should('not.contain', 'Филе Люминесцентного тетраодонтимформа');
    cy.get('[data-cy="1"]').children('button').click();
    cy.get('[data-cy="4"]').children('button').click();
    cy.get('[data-cy="burgerConstructor"]').should('contain', 'Краторная булка');
    cy.get('[data-cy="burgerConstructor"]').should('contain', 'Филе Люминесцентного тетраодонтимформа');
    cy.get('[data-cy="order-button"]').click();
    cy.get('button').contains('Оформить заказ').as('orderButton');
    cy.get('[data-cy="order-button"]').should('not.be.disabled'); 
    cy.get('[data-cy="order-button"]').click();
  
    cy.wait('@createOrder');
    cy.get('[data-cy=modal]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', '40993');
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=burgerConstructor]').within(() => {
    cy.get('[data-cy="constructorBun"]').should('have.length', 2);
    cy.get('[data-cy="constructorBun"]').each(($el) => {
      expect($el.text()).to.contain('Выберите булки');
    });
  
    cy.contains('Флюоресцентная булка').should('not.exist');
    cy.contains('Выберите начинку').should('exist');
    cy.contains('0', {timeout: 10000}).should('exist');
  });
  
});
  });

    afterEach(() => {
      cy.clearCookie('token');
      window.localStorage.removeItem('token');
    });
  
  });
