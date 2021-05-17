const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxlength: [5, "Product name cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  // The average rating of a product
  ratings: {
    type: Number,
    default: 0,
  },
  // An array of images (objects)
  // each containting a public-url obtained from cloudinary
  // and a url where cloudinary houses the image
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter product category"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Accessories",
        "Headphones",
        "Food",
        "Books",
        "Clothes/Shoes",
        "Beauty/Health",
        "Sports",
        "Outdoor",
        "Home",
      ],
      // If one of the pre-set categories is not selected
      message: "Please select one of the listed category for product",
    },
  },
  seller: {
    type: String,
    required: [true, "Please select a product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please indicate product stock"],
    maxlength: [5, "Product name cannot exceed 5 characters"],
    default: 0,
  },
  // Total number of reviews
  numOfReviews: {
    type: Number,
    default: 0,
  },
  // Array of reviews
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
