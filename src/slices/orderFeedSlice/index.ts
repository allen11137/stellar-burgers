import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

interface TFeedSliceState {
  orders:        TOrder[];
  total:         number;
  totalToday:    number;
  selectedOrder: TOrder | null;
  isLoading:     boolean;
};

const initialState: TFeedSliceState = {
  orders:        [],
  total:         0,
  totalToday:    0,
  selectedOrder: null,
  isLoading:     false
};

export const getFeeds = createAsyncThunk('ingredients/getFeeds', getFeedsApi);
export const getOrderByNumber = createAsyncThunk('ingredients/getFeed', (number: number) => getOrderByNumberApi(number));

export const slice = createSlice({
  name:     'feeds',
  initialState,

  reducers: {
    deleteSelectedOrder: (state) => {
      state.selectedOrder = null;
    }
  },

  selectors: {
    selectAllFeeds:     (state) => state.orders,
    selectTotal:        (state) => state.total,
    selectTotalToday:   (state) => state.totalToday,
    selectSelectedFeed: (state) => state.selectedOrder,
    selectIsLoading:    (state) => state.isLoading
  },

  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading   = false;
        state.orders     = action.payload.orders;
        state.total      = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(getFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export const { selectAllFeeds: selectAllFeeds, selectTotal, selectTotalToday, selectSelectedFeed, selectIsLoading } = slice.selectors;
export const { deleteSelectedOrder } = slice.actions;
export default slice.reducer;