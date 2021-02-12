const app = require("./app")
const connectToDatabase = require("./config/database")

// require("dotenv").config();
const dotenv = require("dotenv")


// Set up config file
dotenv.config({path: "./config/config.env"})

// Connect to database;
connectToDatabase();


const port = process.env.PORT;

const server = app.listen(port, () => console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`));

// Handle unhandled promise rejection
process.on("unhandledRejection", err => {
  console.log(`ERROR: ${err.message}`)
  console.log(`Shutting down the server due to unhandled promise rejection`)
  server.close(() => {
    process.exit(1)
  })
})
