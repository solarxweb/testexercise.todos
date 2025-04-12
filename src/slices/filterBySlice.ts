import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IStatusState, Status } from "../types/data";

const initialState: IStatusState = {
  status: Status.All
};

const filterBySlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
});

export const { setStatus } = filterBySlice.actions;
export default filterBySlice.reducer;