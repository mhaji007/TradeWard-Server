const app = require("./app")
const connectToDatabase = require("./config/database")

// require("dotenv").config();
const dotenv = require("dotenv")


// Set up config file
dotenv.config({path: "./config/config.env"})

// Connect to database;
connectToDatabase();


const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`));
