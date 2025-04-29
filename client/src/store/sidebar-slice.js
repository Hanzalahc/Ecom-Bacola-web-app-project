import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isSidebarOpen: true,
    mobileFilterSidebarOpen: false,
    mobileSearchBarOpen: false,
  },
  reducers: {
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload.isSidebarOpen;
    },

    setMobileFilterSidebar: (state, action) => {
      state.mobileFilterSidebarOpen = action.payload;
    },

    setMobileSearchBar: (state, action) => {
      state.mobileSearchBarOpen = action.payload;
    },
  },
});

export const sidebarActions = sidebarSlice.actions;
export default sidebarSlice;
