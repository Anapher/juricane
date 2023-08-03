import { createSlice } from '@reduxjs/toolkit';

export type AdminState = {
  adminMode: boolean;
};

const initialState: AdminState = {
  adminMode: false,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleAdminMode(state) {
      state.adminMode = !state.adminMode;
    },
  },
});

export const { toggleAdminMode } = adminSlice.actions;

export default adminSlice.reducer;
