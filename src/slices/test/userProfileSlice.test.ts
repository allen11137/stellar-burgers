import { RequestStatus, TUser } from '../../utils/types';
import { describe, test } from '@jest/globals';
import {
  signInUser, fetchUser, initialState, signOutUser, signUpUser, userReducer
} from '../userProfileSlice';

describe('Тестирование работы с профилем пользователя', () => {
  describe('Процесс регистрации пользователя', () => {
    test('Начало регистрации', () => {
      const regStart = { type: signUpUser.pending.type };
      const updatedState = userReducer(initialState, regStart);

      expect(updatedState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('Успешная регистрация', () => {
      const testUser: TUser = {
        email: 'alina.zukkel@mail.ru',
        name: 'Alina'
      };

      const regSuccess = {
        type: signUpUser.fulfilled.type,
        payload: testUser
      };
      const updatedState = userReducer(initialState, regSuccess);

      expect(updatedState.data).toEqual(testUser);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Ошибка регистрации', () => {
      const regFail = {
        type: signUpUser.rejected.type
      };
      const updatedState = userReducer(initialState, regFail);

      expect(updatedState.requestStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('Процесс авторизации пользователя', () => {
    test('Начало авторизации', () => {
      const authStart = { type: signInUser.pending.type };
      const updatedState = userReducer(initialState, authStart);

      expect(updatedState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('Успешный вход', () => {
      const testUser: TUser = {
         email: 'alina.zukkel@mail.ru',
         name: 'Alina'
      };

      const authSuccess = {
        type: signInUser.fulfilled.type,
        payload: testUser
      };
      const updatedState = userReducer(initialState, authSuccess);

      expect(updatedState.data).toEqual(testUser);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Ошибка авторизации', () => {
      const authFail = {
        type: signInUser.rejected.type
      };
      const updatedState = userReducer(initialState, authFail);

      expect(updatedState.requestStatus).toBe(RequestStatus.Failed);
    });
  });

  describe('Получение данных пользователя', () => {
    test('Запрос данных о пользователе', () => {
      const fetchStart = { type: fetchUser.pending.type };
      const updatedState = userReducer(initialState, fetchStart);

      expect(updatedState.requestStatus).toBe(RequestStatus.Loading);
      expect(updatedState.data).toEqual(null);
    });

    test('Успешное получение данных', () => {
      const testUser = {
        email: 'alina.zukkel@mail.ru',
        name: 'Alina'
      };

      const fetchSuccess = {
        type: fetchUser.fulfilled.type,
        payload: testUser
      };
      const updatedState = userReducer(initialState, fetchSuccess);

      expect(updatedState.data).toMatchObject(testUser);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.isAuthenticated).toBe(true);
      expect(updatedState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Ошибка получения данных', () => {
      const fetchFail = {
        type: fetchUser.rejected.type,
        meta: { rejectedWithValue: true },
        payload: { message: 'error' },
        error: { message: 'error' }
      };
      const updatedState = userReducer(initialState, fetchFail);

      expect(updatedState.error).toEqual({ message: 'error' });
      expect(updatedState.requestStatus).toEqual(RequestStatus.Failed);
    });
  });

  describe('Процесс выхода из системы', () => {
    test('Начало выхода', () => {
      const logoutStart = { type: signOutUser.pending.type };
      const updatedState = userReducer(initialState, logoutStart);

      expect(updatedState.requestStatus).toBe(RequestStatus.Loading);
    });

    test('Успешный выход', () => {
      const logoutSuccess = {
        type: signOutUser.fulfilled.type
      };
      const updatedState = userReducer(initialState, logoutSuccess);

      expect(updatedState.data).toBeNull();
      expect(updatedState.isAuthenticated).toBe(false);
      expect(updatedState.isAuthChecked).toBe(true);
      expect(updatedState.requestStatus).toBe(RequestStatus.Success);
    });

    test('Ошибка выхода', () => {
      const logoutFail = {
        type: signOutUser.rejected.type
      };
      const updatedState = userReducer(initialState, logoutFail);

      expect(updatedState.requestStatus).toBe(RequestStatus.Failed);
    });
  });
});