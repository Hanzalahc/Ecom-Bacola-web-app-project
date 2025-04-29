import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
    selectedAttributesChecked: false,
  },
  reducers: {
    addToCart(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload._id
      );

      if (existingItem) {
        if (existingItem.quantity >= 10) {
          toast.error("You can't add more than 10 items");
          return;
        }
        if (existingItem.stock <= 0) {
          toast.error("Item is out of stock");
          return;
        }
        existingItem.quantity += 1;
        toast.success("Item quantity updated");
      } else {
        if (action.payload.stock <= 0) {
          toast.error("Item is out of stock");
          return;
        }
        state.cart.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
        });
        toast.success("Item added to cart");
      }
    },
    removeFromCart(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload
      );

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;
          toast.success("Item quantity updated");
        } else {
          state.cart = state.cart.filter((item) => item._id !== action.payload);
          toast.success("Item removed from cart");
        }
      }
    },
    updateQuantity(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity = action.payload.quantity;
        toast.success("Item quantity updated");
      }
    },
    updateProductSize(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload.id
      );

      if (existingItem) {
        existingItem.selectedProductSize = action.payload.size;
        toast.success("Product size updated");
      }
    },
    updateProductColor(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload.id
      );

      if (existingItem) {
        existingItem.selectedProductColor = action.payload.color;
        toast.success("Product color updated");
      }
    },
    updateProductRam(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload.id
      );

      if (existingItem) {
        existingItem.selectedProductRam = action.payload.ram;
        toast.success("Product Ram updated");
      }
    },
    updateProductWeight(state, action) {
      const existingItem = state.cart.find(
        (item) => item._id === action.payload.id
      );

      if (existingItem) {
        existingItem.selectedProductWeight = action.payload.weight;
        toast.success("Product weight updated");
      }
    },

    clearCart(state) {
      if (state.cart.length === 0) {
        toast.error("Cart is already empty");
        return;
      }
      state.cart = [];
    },
    updateSelectedAttributesChecked(state, action) {
      state.selectedAttributesChecked = action.payload;
    },
  },
});

export const cartActions = cartSlice.actions;
export default cartSlice;
