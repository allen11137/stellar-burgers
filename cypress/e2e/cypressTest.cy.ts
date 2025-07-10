import { BURGER_API_URL, TEST_API_URL } from '../../src/utils/constants';

describe('Конфигурация перехвата для конечной точки "api/ingredients"', () => {
  beforeEach(() => {
    cy.intercept('GET', `${BURGER_API_URL}/ingredients`, { fixture: 'ingredients' });
    cy.visit(`${TEST_API_URL}`);
  });

  describe('Операции с модальными окнами', () => {
    it('Отображение деталей ингредиента',() => {
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').click();
      cy.get(`[data-cy=modal]`).as('modal').should('exist');
      cy.get(`[data-cy=modal-close]`).should('exist');
      cy.get('@modal').contains('h3', 'Детали ингредиента');
      cy.contains('p', 'Филе Люминесцентного тетраодонтимформа');
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
      cy.contains('li', 'Краторная булка').find('button').click();
      cy.contains('div', 'Начинки').click();
      cy.contains('li', 'Говяжий метеорит (отбивная)').find('button').click();
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').find('button').click();
      cy.contains('li', 'Хрустящие минеральные кольца').find('button').click();
      cy.contains('div', 'Соусы').click();
      cy.contains('li', 'Соус традиционный галактически').find('button').click();
      cy.contains('span', 'Краторная булка');
      cy.contains('span', 'Говяжий метеорит (отбивная)');
      cy.contains('span', 'Филе Люминесцентного тетраодонтимформа');
      cy.contains('span', 'Хрустящие минеральные кольца');
      cy.contains('span', 'Соус традиционный галактически');
    });

    it('Замена булки в бургере', () => {
      cy.contains('li', 'Флюоресцентная булка').find('button').click();
      cy.contains('li', 'Краторная булка').find('button').click();
      cy.contains('span', 'Краторная булка').should('exist');
      cy.contains('span', 'Флюоресцентная булка').should('not.exist');
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
      cy.contains('li', 'Флюоресцентная булка').find('button').click();
      cy.contains('div', 'Начинки').click();
      cy.contains('li', 'Говяжий метеорит (отбивная)').find('button').click();
      cy.contains('li', 'Кристаллы марсианских альфа-сахаридов').find('button').click();
      cy.contains('li', 'Филе Люминесцентного тетраодонтимформа').find('button').click();
      cy.contains('div', 'Соусы').click();
      cy.contains('li', 'Соус традиционный галактический').find('button').click();
      cy.contains('button', 'Оформить заказ').click();
      cy.wait('@createOrder');
      const modal = cy.get(`[data-cy=modal]`);
      modal.should('exist');
      const close = cy.get(`[data-cy=modal-close]`);
      close.should('exist');

      cy.contains('p', 'идентификатор заказа');
      cy.contains('p', 'Ваш заказ начали готовить');
      cy.contains('h2', '40993').should('exist');

      close.click();
      cy.contains('p', 'идентификатор заказа').should('not.exist');
      cy.contains('p', 'Ваш заказ начали готовить').should('not.exist');
      cy.contains('h2', '40993').should('not.exist');
    });

    afterEach(() => {
      cy.clearCookie('token');
      window.localStorage.removeItem('token');
    });
  });
});
