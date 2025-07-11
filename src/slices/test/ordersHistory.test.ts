import { describe, test } from '@jest/globals';
import {
  TBurgerOrderState,
  createOrder,
  getOrder,
  getOrders,
  initialState,
  ordersReducer
} from '../ordersHistory';
import { TOrder } from '../../utils/types';

describe('Тестирование истории заказов', () => {
  describe('Создание нового заказа', () => {
    test('Начало процесса создания', () => {
      const createStart = { type: createOrder.pending.type };
      const modifiedState = ordersReducer(initialState, createStart);

      expect(modifiedState.isLoading).toBeTruthy();
      expect(modifiedState.orderRequest).toBeTruthy();
    });

    test('Успешное создание заказа', () => {
      const mockOrder = {
        order: {
          _id: 'newOrder',
          status: 'created',
          name: 'Новый заказ',
          createdAt: '2025-07-09T10:00:00Z',
          updatedAt: '2025-07-09T10:05:00Z',
          number: 1010,
          ingredients: ['ingredient5', 'ingredient6']
        }
      };

      const successAction = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const modifiedState = ordersReducer(initialState, successAction);

      expect(modifiedState.isLoading).toBeFalsy();
      expect(modifiedState.orderModalData).toMatchObject(mockOrder.order);
      expect(modifiedState.data).toContainEqual(mockOrder.order);
      expect(modifiedState.orderRequest).toBeFalsy();
    });

    test('Ошибка при создании', () => {
      const createError = { type: createOrder.rejected.type };
      const modifiedState = ordersReducer(initialState, createError);

      expect(modifiedState.isLoading).toBeFalsy();
    });
  });

  describe('Получение деталей заказа', () => {
    test('Начало загрузки деталей', () => {
      const fetchStart = { type: getOrder.pending.type };
      const modifiedState = ordersReducer(initialState, fetchStart);

      expect(modifiedState.isLoading).toBeTruthy();
      expect(modifiedState.data).toHaveLength(0);
    });

    test('Успешное получение деталей', () => {
      const mockOrder = {
        order: {
          _id: 'order123',
          status: 'processing',
          name: 'Детали заказа',
          createdAt: '2025-07-08T23:02:00Z',
          updatedAt: '2025-07-08T23:04:00Z',
          number: 1020,
          ingredients: ['ingredient7', 'ingredient8']
        }
      };

      const successAction = {
        type: createOrder.fulfilled.type,
        payload: mockOrder
      };
      const modifiedState = ordersReducer(initialState, successAction);

      expect(modifiedState.isLoading).toBeFalsy();
      expect(modifiedState.data).toContainEqual(mockOrder.order);
    });

    test('Ошибка загрузки деталей', () => {
      const fetchError = { type: createOrder.rejected.type };
      const modifiedState = ordersReducer(initialState, fetchError);

      expect(modifiedState.isLoading).toBeFalsy();
    });
  });

  describe('Получение списка заказов', () => {
    test('Начало загрузки списка', () => {
      const loadingAction = { type: getOrders.pending.type };
      const modifiedState = ordersReducer(initialState, loadingAction);

      expect(modifiedState.isLoading).toBeTruthy();
      expect(modifiedState.data).toHaveLength(0);
    });

    test('Успешное получение списка', () => {
      const mockOrders: TOrder[] = [
        {
          _id: 'order1',
          status: 'pending',
          name: 'Бургер',
          createdAt: '2025-07-08T22:54:00Z',
          updatedAt: '2025-07-08T22:58:00Z',
          number: 1003,
          ingredients: ['ingredient1', 'ingredient2']
        },
        {
          _id: 'order2',
          status: 'completed',
          name: 'Сэндвич',
          createdAt: '2025-07-08T23:02:00Z',
          updatedAt: '2025-07-08T23:04:00Z',
          number: 1005,
          ingredients: ['ingredient3', 'ingredient4']
        }
      ];

      const successAction = {
        type: getOrders.fulfilled.type,
        payload: mockOrders
      };
      const modifiedState = ordersReducer(initialState, successAction);

      expect(modifiedState.isLoading).toBeFalsy();
      expect(modifiedState.data).toStrictEqual(mockOrders);
    });

    test('Ошибка загрузки списка', () => {
      const errorAction = { type: getOrders.rejected.type };
      const modifiedState = ordersReducer(initialState, errorAction);

      expect(modifiedState.isLoading).toBeFalsy();
      expect(modifiedState.data).toHaveLength(0);
    });
  });
});