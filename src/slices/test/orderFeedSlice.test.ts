import { feedReducer, getFeeds, initialState } from '../orderFeedSlice';
import { describe, test } from '@jest/globals';

describe('Тестирование редьюсера ленты заказов', () => {
  const mockFeedResponse = {
    orders: [
      {
        isLoading: false,
        orderModalData: null,
        orderRequest: false,
        data: null
      },
      {
        isLoading: false,
        orderModalData: null,
        orderRequest: false,
        data: null
      }
    ],
    total: 200,
    totalToday: 100
  };
  
  test('Успешное получение данных о заказах', () => {
    const successOperation = {
      type: getFeeds.fulfilled.type,
      payload: mockFeedResponse
    };
    const modifiedState = feedReducer(initialState, successOperation);

    expect(modifiedState.isLoading).toBeFalsy();
    expect(modifiedState.orders).toEqual(mockFeedResponse.orders);
    expect(modifiedState.total).toBe(mockFeedResponse.total);
    expect(modifiedState.totalToday).toBe(mockFeedResponse.totalToday);
  });

  test('Состояние загрузки данных', () => {
    const loadingOperation = { type: getFeeds.pending.type };
    const modifiedState = feedReducer(initialState, loadingOperation);

    expect(modifiedState.isLoading).toBeTruthy();
    expect(modifiedState.orders).toHaveLength(0);
    expect(modifiedState.total).toBe(0);
    expect(modifiedState.totalToday).toBe(0);
  });

  test('Обработка ошибки при запросе', () => {
    const errorOperation = { type: getFeeds.rejected.type };
    const modifiedState = feedReducer(initialState, errorOperation);

    expect(modifiedState.isLoading).toBeFalsy();
    expect(modifiedState.orders).toBeInstanceOf(Array);
    expect(modifiedState.orders).toHaveLength(0);
    expect(modifiedState.total).toBe(0);
    expect(modifiedState.totalToday).toBe(0);
  });
});