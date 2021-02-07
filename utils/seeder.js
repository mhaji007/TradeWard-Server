const Product = require("../models/product");

const dotenv = require("dotenv");
const connectToDatabase = require("../config/database");

const products = require("../data/product");

// Set dotenv file
dotenv.config({ path: "./config/config.env" });

connectToDatabase();

const seedProducts = async () => {
  try {
    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("All Products are added.");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
