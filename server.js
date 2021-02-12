const app = require("./app");
const connectToDatabase = require("./config/database");

// require("dotenv").config();
const dotenv = require("dotenv");

// Handle uncaught exceptions (e.g., console.log(a);)

process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down due to uncaught exception`);
  process.exit(1);
});

// Set up config file
dotenv.config({ path: "./config/config.env" });



// Connect to database;
connectToDatabase();

const port = process.env.PORT;

const server = app.listen(port, () =>
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode.`
  )
);

// Handle unhandled promise rejection (e.g., misconfigured connection string)
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down the server due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
