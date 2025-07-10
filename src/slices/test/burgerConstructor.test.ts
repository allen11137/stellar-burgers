import { TIngredient } from '../../utils/types';
import { describe, test } from '@jest/globals';
import {
  BurgerConstructorState,
  addIngredient,
  creatorReducer,
  initialState,
  deleteIngredient,
  moveIngredient
} from '../burgerConstructor';

const stateWithMultipleItems: BurgerConstructorState = {
  bun: null,
  ingredients: [
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
  ]
};

describe('Тестирование конструктора бургеров', () => {
  test('Удаление существующего ингредиента', () => {
    const startingState: BurgerConstructorState = {
      bun: null,
      ingredients: [
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
      }
      ]
    };

    const removeAction = deleteIngredient('item1');
    const modifiedState = creatorReducer(startingState, removeAction);
    
    expect(modifiedState.ingredients).toHaveLength(0);
  });

  test('Добавление нового ингредиента', () => {
    const newItem: TIngredient = {
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
      image_large: "https://code.s3.yandex.net/react/code/meat-04-large.png"
    };

    const addAction = addIngredient(newItem);
    const modifiedState = creatorReducer(initialState, addAction);
    
    expect(modifiedState.ingredients).toHaveLength(1);
    expect(modifiedState.ingredients[0]).toMatchObject({
      ...newItem,
      id: expect.any(String)
    });
  });

  test('Изменение порядка ингредиентов', () => {
    const reorderAction = moveIngredient({ from: 0, to: 1 });
    const modifiedState = creatorReducer(stateWithMultipleItems, reorderAction);

    const expectedOrder = [
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
      },
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
      }
    ];
    
    expect(modifiedState.ingredients).toEqual(expectedOrder);
  });
});