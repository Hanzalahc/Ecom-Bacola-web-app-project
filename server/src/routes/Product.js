import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";
import {
  createProduct,
  getAllProducts,
  getProductsByCategory,
  getProductsBySubCategory,
  getProductsUsingPriceFilter,
  getProductsByRating,
  getAllFeaturedProducts,
  deleteProduct,
  getSingleProduct,
  updateProduct,
  deleteMultipleProducts,
  getProductsByStatus,
  filters,
  search,
} from "../controllers/Product.js";

router.post("/create", isAuthenticated, createProduct);
router.get("/get-all", getAllProducts);
router.get("/get-by-category/:categoryId", getProductsByCategory);
router.get("/get-by-sub-category/:subCategory", getProductsBySubCategory);
router.get("/get-by-price", getProductsUsingPriceFilter);
router.get("/get-by-rating", getProductsByRating);
router.get("/get-all-feature", getAllFeaturedProducts);
router.delete("/delete", isAuthenticated, deleteProduct);
router.get("/get-single/:productId", getSingleProduct);
router.put("/update/:productId", isAuthenticated, updateProduct);
router.delete("/delete-multiple", isAuthenticated, deleteMultipleProducts);
router.get("/get-by-status/:status", getProductsByStatus);
router.post("/filters", filters);
router.get("/search", search);

export default router;
