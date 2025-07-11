import { describe, test } from '@jest/globals';
import {
  fetchIngredients,
  ingredientsReducer,
  initialState
} from '../ingredients';

describe('Тестирование работы с ингредиентами', () => {
  const mockIngredients = [
    {
      _id: "6",
      name: "Говяжий метеорит (отбивная)",
      type: "main",
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: "https://code.s3.yandex.net/react/code/meat-04.png",
      image_mobile: "https://code.s3.yandex.net/react/code/meat-04-mobile.png",
      image_large: "https://code.s3.yandex.net/react/code/meat-04-large.png",
      id: 'item1'
    },
    {
      _id: "5",
      name: "Мясо бессмертных моллюсков Protostomia",
      type: "main",
      proteins: 433,
      fat: 244,
      carbohydrates: 33,
      calories: 420,
      price: 1337,
      image: "https://code.s3.yandex.net/react/code/meat-02.png",
      image_mobile: "https://code.s3.yandex.net/react/code/meat-02-mobile.png",
      image_large: "https://code.s3.yandex.net/react/code/meat-02-large.png",
      id: 'item2'
    }
  ];
  
  test('Успешная загрузка ингредиентов', () => {
    const successAction = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const updatedState = ingredientsReducer(initialState, successAction);

    expect(updatedState.isLoading).toBeFalsy();
    expect(updatedState.ingredients).toEqual(mockIngredients);
    expect(updatedState.error).toBeNull();
  });

  test('Состояние при начале загрузки', () => {
    const loadingAction = { type: fetchIngredients.pending.type };
    const updatedState = ingredientsReducer(initialState, loadingAction);

    expect(updatedState.isLoading).toBeTruthy();
    expect(updatedState.ingredients).toHaveLength(0);
    expect(updatedState.error).toBeNull();
  });

  test('Обработка ошибки загрузки (кастомное сообщение)', () => {
    const customError = 'Проблема с подключением';
    const errorAction = { 
      type: fetchIngredients.rejected.type,
      error: { message: customError } 
    };
    const updatedState = ingredientsReducer(initialState, errorAction);

    expect(updatedState.isLoading).toBeFalsy();
    expect(updatedState.ingredients).toHaveLength(0);
    expect(updatedState.error).toBe(customError);
  });

  test('Обработка ошибки загрузки (стандартное сообщение)', () => {
    const errorAction = { 
      type: fetchIngredients.rejected.type,
      error: {}
    };
    const updatedState = ingredientsReducer(initialState, errorAction);

    expect(updatedState.isLoading).toBeFalsy();
    expect(updatedState.ingredients).toHaveLength(0);
    expect(updatedState.error).toBe('Произошла ошибка при загрузке ингредиентов');
  });
});