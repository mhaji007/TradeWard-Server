const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    maxLength: [5, "Price cannot exceed 5 decimal values "],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    maxLength: [2000, "Product description cannot exceed 100 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      // image id
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
    required: [true, "Product category is required"],
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
      message: "Please select a corresponding category for this product",
    },
    seller: {
      type: String,
      required: [true, "Please enter product seller"],
    },
    stock: {
      type: Number,
      required: [true, "Stock availablity is required"],
      maxLength: [5, "Product name cannot exceed 5 characters"],
      default: 0,
    },
    numofReviews: {
      type: Number,
      default:0,
    },
    reviews:[{
      name:{
        type: String,
        required: true,
      },
      rating:{
        type:Number,
        required: true,
      },
      comment:{
        type: String,
        required: true
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }

  },
});

module.exports = mongoose.model("Product", productSchema);
