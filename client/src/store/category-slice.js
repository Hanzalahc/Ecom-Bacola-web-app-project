import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categoriesData: [],
  },
  reducers: {
    setcategories(state, action) {
      state.categoriesData = action.payload;
    },
    removecategory(state, action) {
      const updatedcategorys = state.categoriesData.filter(
        (category) => category._id !== action.payload
      );
      state.categoriesData = updatedcategorys;
    },
    emptycategorys(state, action) {
      state.categoriesData = [];
    },
  },
});

export const categoryActions = categorySlice.actions;
export default categorySlice;
