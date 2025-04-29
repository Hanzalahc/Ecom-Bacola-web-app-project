import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Joi from "joi";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteImageFromCloudinary } from "../utils/cloudinary.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const { error } = validateProduct(req.body);
  if (error) {
    return next(new apiError(400, error.details[0].message));
  }

  const {
    name,
    description,
    content,
    images,
    brand,
    category,
    subCategory, // This is the subcategory which can be an empty string
    price,
    oldPrice,
    discount,
    stock,
    isFeatured,
    productRam,
    productSize,
    productWeight,
    productColor,
  } = req.body;

  const duplicateProduct = await Product.findOne({
    name,
  });

  if (duplicateProduct) {
    return next(new apiError(400, "Product already exists with this name"));
  }

  const findedCategory = await Category.findOne({
    name: category,
  }).populate("subCategories");

  if (!findedCategory) {
    return next(new apiError(404, "Category not found"));
  }

  const createdProduct = await Product.create({
    name,
    description,
    content,
    images,
    brand,
    category: findedCategory._id,
    subCategory,
    price,
    oldPrice,
    discount,
    stock,
    isFeatured,
    productRam,
    productSize,
    productWeight,
    productColor,
  });

  // If subCategory is provided (not empty), find the subCategory
  if (subCategory && subCategory !== "") {
    const findedSubCategory = findedCategory.subCategories.find(
      (subCat) => subCat.name === subCategory
    );

    findedSubCategory.products.push(createdProduct._id);
  }

  // Push product ID to category (whether subCategory is used or not)
  findedCategory.products.push(createdProduct._id);
  await findedCategory.save();

  if (!createdProduct) {
    return next(
      new apiError(500, "Something went wrong while creating product")
    );
  }

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: createdProduct,
  });
});

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;
  const products = await Product.find({ status: "active" })
    .populate({
      path: "category",
      select: "name ",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });
  const productsCount = await Product.countDocuments({ status: "active" });
  const totalPages = Math.ceil(productsCount / pageSize);

  if (!products || products.length === 0) {
    return next(new apiError(404, "No products found"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const getProductsByCategory = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!categoryId) {
    return next(new apiError(400, "Category id is required"));
  }

  const products = await Product.find({
    category: categoryId,
    status: "active",
  })
    .populate({
      path: "category",
      select: "name ",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    category: categoryId,
    status: "active",
  });
  const totalPages = Math.ceil(productsCount / pageSize);

  const findPriceRange = async () => {
    const priceRange = await Product.aggregate([
      {
        $match: {
          status: "active",
          price: { $gte: 0 },
        },
      },
      {
        $project: {
          price: { $ifNull: ["$price", 0] }, // Replace null or undefined prices with 0
        },
      },
      {
        $group: {
          _id: null, // Group all documents together
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const minPrice = priceRange[0]?.minPrice || 0;
    const maxPrice = priceRange[0]?.maxPrice || 0;

    return { minPrice, maxPrice };
  };

  const { minPrice, maxPrice } = await findPriceRange();

  if (!products || products.length === 0) {
    return next(new apiError(404, "No products found"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
    priceRange: { minPrice, maxPrice },
  });
});

export const getProductsBySubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = req.params.subCategory;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!subCategory) {
    return next(new apiError(400, "Sub category id is required"));
  }

  const products = await Product.find({
    subCategory: subCategory,
    status: "active",
  })
    .populate({
      path: "category",
      select: "name",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    subCategory: subCategory,
    status: "active",
  });

  const totalPages = Math.ceil(productsCount / pageSize);

  if (products.length === 0) {
    return next(new apiError(404, "No products found for this subcategory"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const getProductsByStatus = asyncHandler(async (req, res, next) => {
  const status = req.params.status;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (!status) {
    return next(new apiError(400, "Status is required"));
  }

  const products = await Product.find({
    status: status,
  })
    .populate({
      path: "category",
      select: "name",
    })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    status: status,
  });

  const totalPages = Math.ceil(productsCount / pageSize);

  if (products.length === 0) {
    return next(new apiError(404, "No products found with this status"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount: productsCount,
    totalPages: totalPages,
    data: products,
  });
});

export const getProductsUsingPriceFilter = asyncHandler(
  async (req, res, next) => {
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || 1000000;
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (minPrice < 0 || maxPrice < 0) {
      return next(new apiError(400, "Price cannot be negative"));
    }

    if (minPrice > maxPrice) {
      return next(
        new apiError(400, "Minimum price cannot be greater than maximum price")
      );
    }

    try {
      const products = await Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
      })
        .populate("category", "name image")
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize)
        .sort({ _id: -1 });

      const productsCount = await Product.countDocuments({
        price: { $gte: minPrice, $lte: maxPrice },
      });

      const totalPages = Math.ceil(productsCount / pageSize);

      if (!products || products.length === 0) {
        return next(
          new apiError(404, "No products found within the price range")
        );
      }

      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        productsCount,
        totalPages,
        data: products,
      });
    } catch (error) {
      return next(
        new apiError(500, "An error occurred while fetching products")
      );
    }
  }
);

export const getProductsByRating = asyncHandler(async (req, res, next) => {
  const rating = parseFloat(req.query.rating) || 0;
  const pageNum = parseInt(req.query.pageNum) || 1;
  const pageSize = 10;

  if (rating < 0 || rating > 5) {
    return next(new apiError(400, "Rating must be between 0 and 5"));
  }

  const products = await Product.find({
    rating,
    status: "active",
  })
    .populate("category", "name image")
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    rating,
    status: "active",
  });

  const totalPages = Math.ceil(productsCount / pageSize);

  if (!products || products.length === 0) {
    return next(new apiError(404, "No products found with this rating"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount,
    totalPages,
    data: products,
  });
});

export const getAllFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({
    isFeatured: true,
    status: "active",
  })
    .populate("category", "name image")
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments({
    isFeatured: true,
    status: "active",
  });

  if (!products || products.length === 0) {
    return next(new apiError(404, "No featured products found"));
  }

  return res.status(200).json({
    success: true,
    message: "Featured products fetched successfully",
    count: productsCount,
    data: products,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const { productId } = req.body;

  if (!productId) {
    return next(new apiError(400, "Product id is required"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new apiError(404, "Product not found"));
  }

  // Delete images from cloudinary
  if (product?.images?.length > 0 && product.images[0]?.publicId) {
    for (const image of product.images) {
      if (image?.publicId) {
        const cloudinaryDeleteResult = await deleteImageFromCloudinary(
          image.publicId
        );
        if (!cloudinaryDeleteResult) {
          return next(
            new apiError(
              500,
              `Failed to delete image with ID: ${image.publicId} from Cloudinary`
            )
          );
        }
      }
    }
  }

  // pull ids from category and sub category if there

  const category = await Category.findById(product.category);

  if (product.subCategory && product.subCategory !== "") {
    const subCategory = category.subCategories.find(
      (subCat) => subCat.name === product.subCategory && subCat.products > 0
    );

    if (subCategory) {
      subCategory.products.pull(product._id);
      await subCategory.save();
    }
  }

  category.products.pull(product._id);
  await category.save();

  const deletedProduct = await Product.findByIdAndDelete(productId);

  if (!deletedProduct) {
    return next(
      new apiError(500, "Something went wrong while deleting product")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getSingleProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return next(new apiError(400, "Product id is required"));
  }

  const product = await Product.findById(productId).populate([
    {
      path: "category",
      select: "name",
    },
    {
      path: "reviews",
      select: "rating review user createdAt",
      populate: {
        path: "user",
        select: "name email avatar",
      },
    },
  ]);

  if (!product || product.length === 0) {
    return next(new apiError(404, "Product not found"));
  }

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const productId = req.params.productId;

  if (!productId) {
    return next(new apiError(400, "Product id is required"));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new apiError(404, "Product not found with this ID"));
  }

  const { error } = validateProduct(req.body);
  if (error) {
    return next(new apiError(400, error.details[0].message));
  }

  const {
    name,
    description,
    content,
    images,
    brand,
    category,
    subCategory,
    price,
    oldPrice,
    status,
    discount,
    stock,
    isFeatured,
    productRam,
    productSize,
    productWeight,
    productColor,
  } = req.body;

  const findedCategory = await Category.findOne({
    name: category,
  });

  if (!findedCategory) {
    return next(new apiError(404, "Category not found"));
  }

  const arraysAreEqual = (arr1, arr2) =>
    arr1.length === arr2.length &&
    arr1.every((val, index) => val === arr2[index]);

  const isSameData =
    product.name === name &&
    product.description === description &&
    product.content === content &&
    product.images.length === images.length &&
    product.brand === brand &&
    product.category.toString() === findedCategory._id.toString() &&
    product.subCategory === subCategory &&
    product.price === price &&
    product.status === status &&
    product.oldPrice === oldPrice &&
    product.discount === discount &&
    product.stock === stock &&
    product.isFeatured === isFeatured &&
    arraysAreEqual(product.productRam, productRam) &&
    arraysAreEqual(product.productSize, productSize) &&
    arraysAreEqual(product.productWeight, productWeight) &&
    arraysAreEqual(product.productColor, productColor);

  const areImagesSame = product.images
    .map((img) => img.publicId)
    .sort()
    .every(
      (publicId, index) =>
        publicId === images.map((img) => img.publicId).sort()[index]
    );

  if (isSameData && areImagesSame) {
    return next(new apiError(400, "Nothing to update"));
  }

  // Delete old images from cloudinary
  if (!areImagesSame) {
    const deleteRemovedImagesFromCloudinary = async (oldImages, newImages) => {
      const imagesToDelete = oldImages.filter(
        (oldImage) =>
          !newImages.some((newImage) => newImage.publicId === oldImage.publicId)
      );

      for (let image of imagesToDelete) {
        const cloudinaryDeleteResult = await deleteImageFromCloudinary(
          image.publicId
        );
        if (image.publicId && !cloudinaryDeleteResult) {
          console.error(
            `Failed to delete image ${image.publicId} from Cloudinary`
          );
        }
      }
    };

    const oldImages = product.images || [];
    const newImages = images || [];

    await deleteRemovedImagesFromCloudinary(oldImages, newImages);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      content,
      images,
      brand,
      category: findedCategory._id,
      subCategory,
      price,
      status,
      oldPrice,
      discount,
      stock,
      isFeatured,
      productRam,
      productSize,
      productWeight,
      productColor,
    },
    {
      new: true,
    }
  );

  if (!updatedProduct) {
    return next(
      new apiError(500, "Something went wrong while updating product")
    );
  }

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

export const deleteMultipleProducts = asyncHandler(async (req, res, next) => {
  const userData = req.user;

  if (userData.role !== "admin") {
    return next(new apiError(403, "Unauthorized request"));
  }

  const { productIds } = req.body;

  if (!productIds || productIds.length === 0) {
    return next(new apiError(400, "Product ids are required"));
  }

  for (const productId of productIds) {
    const product = await Product.findById(productId);

    if (!product) {
      return next(new apiError(404, "Product not found"));
    }

    // Delete images from cloudinary
    if (product?.images?.length > 0 && product.images[0]?.publicId) {
      for (const image of product.images) {
        if (image?.publicId) {
          const cloudinaryDeleteResult = await deleteImageFromCloudinary(
            image.publicId
          );
          if (!cloudinaryDeleteResult) {
            return next(
              new apiError(
                500,
                `Failed to delete image with ID: ${image.publicId} from Cloudinary`
              )
            );
          }
        }
      }
    }

    // pull ids from category and sub category if there

    const category = await Category.findById(product.category);

    if (product.subCategory && product.subCategory !== "") {
      const subCategory = category.subCategories.find(
        (subCat) => subCat.name === product.subCategory && subCat.products > 0
      );

      if (subCategory) {
        subCategory.products.pull(product._id);
        await subCategory.save();
      }
    }

    category.products.pull(product._id);
    await category.save();

    await Product.findByIdAndDelete(productId);
  }

  return res.status(200).json({
    success: true,
    message: "Products deleted successfully",
  });
});

export const filters = asyncHandler(async (req, res, next) => {
  const {
    categoryIds,
    subCategory,
    isFeatured,
    minPrice,
    maxPrice,
    size,
    color,
    ram,
    weight,
    rating,
    page,
    limit,
  } = req.body;

  const filters = {
    status: "active",
  };

  if (categoryIds && categoryIds.length > 0) {
    filters.category = { $in: categoryIds };
  }

  if (subCategory && subCategory.length > 0) {
    filters.subCategory = { $in: subCategory };
  }

  if (minPrice && maxPrice) {
    filters.price = { $gte: minPrice, $lte: maxPrice };
  }

  if (rating) {
    filters.rating = rating;
  }

  if (isFeatured) {
    filters.isFeatured = isFeatured;
  }

  if (size) {
    filters.productSize = { $in: size };
  }

  if (color) {
    filters.productColor = { $in: color };
  }

  if (ram) {
    filters.productRam = { $in: ram };
  }

  if (weight) {
    filters.productWeight = { $in: weight };
  }

  // console.log(filters);

  const products = await Product.find(filters)
    .populate("category", "name")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ _id: -1 });

  const productsCount = await Product.countDocuments(filters);
  const totalPages = Math.ceil(productsCount / limit);

  if (!products || products.length === 0) {
    return next(new apiError(404, "No products found with these filters"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    productsCount,
    totalPages,
    data: products,
  });
});

export const search = asyncHandler(async (req, res, next) => {
  const { query = "" } = req.query;

  if (!query.trim()) {
    return next(new apiError(400, "Search query is required"));
  }

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ],
    status: "active",
  })
    .populate([
      {
        path: "category",
        select: "name",
      },
      {
        path: "reviews",
        select: "rating review user createdAt",
        populate: {
          path: "user",
          select: "name email avatar",
        },
      },
    ])
    .sort({ _id: -1 });

  if (!products || products.length === 0) {
    return next(new apiError(404, "No products found with this search query"));
  }

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: products,
  });
});

export const validateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    content: Joi.string().min(10).max(3500).required(),
    images: Joi.array().min(1).required(),
    brand: Joi.string().allow("").optional(),
    subCategory: Joi.string().allow("").optional(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    status: Joi.string().valid("active", "inactive").optional(),
    oldPrice: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).required(),
    stock: Joi.number().min(0).required(),
    isFeatured: Joi.boolean().optional(),
    productRam: Joi.array().items(Joi.string()).optional(),
    productSize: Joi.array().items(Joi.string()).optional(),
    productWeight: Joi.array().items(Joi.string()).optional(),
    productColor: Joi.array().items(Joi.string()).optional(),
  });

  return schema.validate(data);
};
