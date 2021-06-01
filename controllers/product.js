const Product = require("../models/product");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// Create a new product

exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Second method of creating a new product

// exports.newProduct= async (req, res, next) => {

//     try {
//     const product = await new Product(req.body).save();
//     res.json(product);
//   } catch (err) {
//     console.log("Product create error --->", err);
//     res.status(400).send("Create product failed");

//     // // Send specific message from mongoose
//     // res.status(400).json({
//     //   err:err.message
//     // })
//   }
// };

// Retrieve a single product

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // Without custom error handler

  // if (!product) {
  //   return res.status(400).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Second method of retrieving a single product

// exports.getSingleProduct= async (req, res, next) => {
//   try {
//     const product = await Product.findOne(
//       {_id:req.params.id}
//     )
//       .exec();
//     res.json(product);
//   } catch (err) {
//     console.log("Product read error --->", err);
//     return res.status(400).send("Product read failed");
//   }
// };

// List all products with searching by keyword
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 4;
  // Total products in the database (needed for implementing pagination on the frontend)
  const productCount = await Product.countDocuments();

  // Model.find() returns a query, which has a separate find()
  // method that allows for adding additional filters.
  // Product.find() returns this which is a query object - a Product collection variable
  // The query.prototype has many methods like limit(), sort(), etc.
  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    count: products.length,
    productCount,
    products,
  });
});

// List all products without searching by keyword

// exports.getProducts = catchAsyncErrors(async (req, res, next) => {
//   const products = await Product.find();

//   res.status(200).json({
//     success: true,
//     count: products.length,
//     products,
//   });
// });

// Second method of listing all products

// exports.listAll = async (req, res) => {
//   try {
//     let products = await Product.find({})
//     res.json(products);
//   } catch (err) {
//     console.log("Product listAll error --->", err);
//     return res.status(400).send("Product listAll failed");
//   }
// };

// Update a product

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// Second method of updating a product

// exports.updateProduct = async (req, res, next) => {
//   try {
//     const product = await Product.findOneAndUpdate(
//       {
//         _id: req.params.id,
//       },
//       req.body,
//       { new: true }
//     ).exec();
//     res.json(product);
//   } catch (err) {
//     console.log("Product Update error --->", err);
//     return res.status(400).send("Product update failed");
//   }
// };

// Delete a product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  // if (!product) {
  //   return res.status(404).json({
  //     success: false,
  //     message: "Product not found",
  //   });
  // }

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product was deleted successfully",
  });
});

// Second method of deleting a product

// exports.deleteProduct = async (req, res, next) => {
//   try {
//     const deleted = await Product.findOneAndRemove({
//       _id: req.params.id,
//     }).exec();
//     res.json(deleted);
//   } catch (err) {
//     console.log("Product remove error --->", err);
//     return res.status(400).send("Product delete failed");
//   }
// };
