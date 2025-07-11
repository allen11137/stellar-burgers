import { rootReducer } from '../../services/store';
import { describe, test, expect } from '@jest/globals';
import { initialState as ingredientsInitialState } from '../../slices/ingredients';
import { initialState as feedsInitialState } from '../../slices/orderFeedSlice';
import { initialState as ordersInitialState } from '../../slices/ordersHistory';
import { initialState as userInitialState } from '../../slices/userProfileSlice';
import { initialState as creatorInitialState } from '../../slices/burgerConstructor';

describe('Проверка корневого редьюсера', () => {
  test('Инициализация состояния приложения', () => {
    const initialAppState = rootReducer(undefined, { type: 'test_action' });

    expect(initialAppState.ingredients).toEqual(ingredientsInitialState);
    expect(initialAppState.feeds).toEqual(feedsInitialState);
    expect(initialAppState.orders).toEqual(ordersInitialState);
    expect(initialAppState.user).toEqual(userInitialState);
    expect(initialAppState.creator).toEqual(creatorInitialState);
  });
});