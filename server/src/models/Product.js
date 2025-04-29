import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    productRam: [
      {
        type: String,
        default: null,
      },
    ],
    productSize: [
      {
        type: String,
        default: null,
      },
    ],
    productWeight: [
      {
        type: String,
        default: null,
      },
    ],
    productColor: [
      {
        type: String,
        default: null,
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    status: {
      type: String,
      default: "active",
    },
    sale: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.statics.updateRating = async function (productId) {
  const product = await this.findById(productId).populate("reviews", "rating");

  if (product.reviews.length > 0) {
    const totalRating = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    product.rating = totalRating / product.reviews.length;
    await product.save();
  }
};

export default mongoose.model("Product", productSchema);
