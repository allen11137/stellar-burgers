import { rootReducer } from '../../services/store';
import { describe, test, expect } from '@jest/globals';

describe('Проверка корневого редьюсера', () => {
  test('Инициализация состояния приложения', () => {
    const initialAppState = rootReducer(undefined, { type: 'test_action' });
    
    const expectedStateStructure = {
      ingredients: expect.any(Object),
      feeds: expect.any(Object),
      orders: expect.any(Object),
      user: expect.any(Object),
      creator: expect.any(Object)
    };

    expect(initialAppState).toMatchObject(expectedStateStructure);
  });
});