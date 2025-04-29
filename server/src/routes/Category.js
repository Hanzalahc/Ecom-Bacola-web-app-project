import express from "express";
const router = express.Router();
import { isAuthenticated } from "../middlewares/isAuth.js";
import {
  createCategory,
  createSubCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/Category.js";

router.post("/create-new", isAuthenticated, createCategory);
router.patch("/create-sub-category", isAuthenticated, createSubCategory);
router.get("/get-all", getCategories);
router.get("/get-single", getSingleCategory);
router.patch("/update-category", isAuthenticated, updateCategory);
router.delete("/delete-category", isAuthenticated, deleteCategory);
router.patch("/update-sub-category", isAuthenticated, updateSubCategory);
router.delete("/delete-sub-createCategory", isAuthenticated, deleteSubCategory);

export default router;
