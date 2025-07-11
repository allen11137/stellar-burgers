import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { TUser, RequestStatus } from '../../utils/types';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { loginUserApi, getUserApi, logoutApi, registerUserApi, updateUserApi, TLoginData, TRegisterData } from '../../utils/burger-api';

type TUserProfile = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  error?: SerializedError;
  requestStatus: RequestStatus;
};

export const initialState: TUserProfile = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  requestStatus: RequestStatus.Idle
};

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();
      if (!res.success) return rejectWithValue(res);
      return res.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const signUpUser = createAsyncThunk<TUser, TRegisterData>(
  'user/signup',
  async (formData, { rejectWithValue }) => {
    const res = await registerUserApi(formData);
    if (!res.success) return rejectWithValue(res);
    localStorage.setItem('refreshToken', String(res.refreshToken));
    setCookie('accessToken', String(res.accessToken));
    return res.user;
  }
);

export const signInUser = createAsyncThunk<TUser, TLoginData>(
  'user/signin',
  async (credentials, { rejectWithValue }) => {
    const res = await loginUserApi(credentials);
    if (!res.success) return rejectWithValue(res);
    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);
    return res.user;
  }
);

export const signOutUser = createAsyncThunk(
  'user/signout',
  async (_, { rejectWithValue }) => {
    const res = await logoutApi();
    if (!res.success) return rejectWithValue(res);
    localStorage.clear();
    deleteCookie('accessToken');
  }
);

export const patchUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/update',
  async (userData, { rejectWithValue }) => {
    const res = await updateUserApi(userData);
    if (!res.success) return rejectWithValue(res);
    return res.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    verifyAuth: (state) => { state.isAuthChecked = true; },
    clearUser: (state) => { state.data = null; },
    updateUserData: (state, action) => { state.data = action.payload; }
  },
  selectors: {
    selectUserData: (state) => state.data,
    selectUserLoading: (state) => state.requestStatus,
    selectAuthChecked: (state) => state.isAuthChecked,
    selectAuthenticated: (state) => state.isAuthenticated,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.requestStatus = RequestStatus.Loading; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.meta.rejectedWithValue ? (action.payload as SerializedError) : action.error;
        state.requestStatus = RequestStatus.Failed;
      })
      .addCase(signUpUser.pending, (state) => { state.requestStatus = RequestStatus.Loading; })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(signUpUser.rejected, (state) => { state.requestStatus = RequestStatus.Failed; })
      .addCase(signInUser.pending, (state) => { state.requestStatus = RequestStatus.Loading; })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(signInUser.rejected, (state) => { state.requestStatus = RequestStatus.Failed; })
      .addCase(signOutUser.pending, (state) => { state.requestStatus = RequestStatus.Loading; })
      .addCase(signOutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.requestStatus = RequestStatus.Success;
      })
      .addCase(signOutUser.rejected, (state) => { state.requestStatus = RequestStatus.Failed; });
  }
});

export const { selectUserData, selectUserLoading, selectAuthChecked, selectAuthenticated, selectError } = userSlice.selectors;
export const { verifyAuth, clearUser, updateUserData } = userSlice.actions;
export const userReducer = userSlice.reducer;