const app = require("./app")
// require("dotenv").config();
const dotenv = require("dotenv")

// Set up config gile
dotenv.config({path: "./config/config.env"})


const port = process.env.PORT;

app.listen(port, () => console.log(`Server is running on port ${port} in ${process.env.NODE_ENV} mode.`));
