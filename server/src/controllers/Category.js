import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinary.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, image } = req.body;
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  if (!name) {
    return next(new apiError(400, "Category name is required"));
  }

  if (!image) {
    return next(new apiError(400, "Category image is required"));
  }

  const alreadyExistedCategory = await Category.findOne({
    name,
  });

  if (alreadyExistedCategory) {
    return next(new apiError(400, "Category already exists"));
  }

  const newCategory = new Category({
    name,
    image,
  });

  await newCategory.save();

  if (!newCategory) {
    return next(
      new apiError(500, "Something went wrong while creating category")
    );
  }

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: newCategory,
  });
});

export const createSubCategory = asyncHandler(async (req, res, next) => {
  // name here is sub category name
  const { name, categoryId } = req.body;
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  if (!name) {
    return next(new apiError(400, "Sub category name is required"));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new apiError(404, "Category not found"));
  }

  const alreadyExistedSubCategory = category.subCategories.find(
    (subCategory) => subCategory.name === name
  );

  if (alreadyExistedSubCategory) {
    return next(new apiError(400, "Sub category already exists"));
  }

  category.subCategories.push({ name });

  await category.save();

  if (!category) {
    return next(
      new apiError(500, "Something went wrong while creating sub category")
    );
  }

  res.status(200).json({
    success: true,
    message: "Sub category created successfully",
    data: category,
  });
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().populate("subCategories");
  const categoriesCount = categories.length;

  if (!categories || categoriesCount === 0) {
    return next(new apiError(404, "No category found"));
  }

  // const subCategories = categories.map((category) => {
  //   return category.subCategories;
  // });

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    count: categoriesCount,
    data: categories,
  });
});

export const getSingleCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const category = await Category.findById(id);

  if (!category) {
    return next(new apiError(404, "Category not found"));
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully",
    data: category,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name, image, id } = req.body;
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const findedCategory = await Category.findById(id);

  if (!findedCategory) {
    return next(new apiError(404, "Category not found"));
  }

  if (
    name === findedCategory.name &&
    image.publicId === findedCategory.image.publicId
  ) {
    return next(new apiError(400, "Nothing to update"));
  }

  // remove previous image from Cloudinary if exists
  if (image.publicId !== findedCategory.image.publicId) {
    const cloudinaryDeleteResult = await deleteImageFromCloudinary(
      findedCategory?.image?.publicId
    );
    if (findedCategory?.image?.publicId && !cloudinaryDeleteResult) {
      return next(
        new apiError(500, "Failed to delete previous avatar from Cloudinary")
      );
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    {
      name,
      image,
    },
    {
      new: true,
    }
  );

  if (!updatedCategory) {
    return next(
      new apiError(500, "Something went wrong while updating category")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: updatedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const userData = req.user;
  const defaultCategoryId = "678fdaa00121a63a2a96f506";

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const findedCategory = await Category.findById(id);

  if (!findedCategory) {
    return next(new apiError(404, "Category not found"));
  }

  // remove image from Cloudinary if exists
  if (findedCategory?.image?.publicId) {
    const cloudinaryDeleteResult = await deleteImageFromCloudinary(
      findedCategory?.image?.publicId
    );
    if (findedCategory?.image?.publicId && !cloudinaryDeleteResult) {
      return next(
        new apiError(500, "Failed to delete previous avatar from Cloudinary")
      );
    }
  }

  if (findedCategory.subCategories.length > 0) {
    for (let subCategory of findedCategory.subCategories) {
      await Product.updateMany(
        { "category.subCategories": subCategory._id },
        { $set: { category: defaultCategoryId } }
      );
    }

    findedCategory.subCategories = [];
  }

  // Pull product IDs from category and set to default category
  if (findedCategory.products.length > 0) {
    await Product.updateMany(
      { category: id },
      { $set: { category: defaultCategoryId } }
    );
  }

  await Category.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name, categoryId, subCategoryId } = req.body;
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  if (!name || typeof name !== "string") {
    return next(new apiError(400, "Invalid subcategory name"));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new apiError(404, "Category not found"));
  }

  const subCategory = category.subCategories.id(subCategoryId);

  if (!subCategory) {
    return next(new apiError(404, "Sub category not found"));
  }

  if (name === subCategory.name) {
    return next(new apiError(400, "Nothing to update"));
  }

  subCategory.name = name;

  await category.save();

  if (!category) {
    return next(
      new apiError(500, "Something went wrong while updating sub category")
    );
  }

  res.status(200).json({
    success: true,
    message: "Sub category updated successfully",
    data: subCategory,
  });
});

export const deleteSubCategory = asyncHandler(async (req, res, next) => {
  const userData = req.user;
  const { categoryId, subCategoryId } = req.body;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(new apiError(404, "Category not found"));
  }

  const subCategory = category.subCategories.id(subCategoryId);

  if (!subCategory) {
    return next(new apiError(404, "Sub category not found"));
  }

  // Remove subcategory from products and move them to parent category
  const products = await Product.find({ category: categoryId }).populate(
    "category"
  );

  if (products.length > 0) {
    products.forEach(async (product) => {
      if (
        product.category.subCategories.some(
          (subCat) => subCat._id.toString() === subCategoryId
        )
      ) {
        product.category = categoryId;
        await product.save();
      }
    });
  }

  // Remove subcategory from category
  category.subCategories.pull({ _id: subCategoryId });

  await category.save();

  res.status(200).json({
    success: true,
    message: "Sub category deleted successfully",
    data: subCategory,
  });
});
