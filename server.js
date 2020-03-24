const express = require("express");
const dotevn = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

//load env file
dotevn.config({ path: "./config/config.env" });

// connect to database
connectDB();

//Routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

//Middleware files
const logger = require("./middleware/logger");

const app = express();

//body parser

app.use(express.json());

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // close server and exit process
  server.close(() => process.exit(1));
});
