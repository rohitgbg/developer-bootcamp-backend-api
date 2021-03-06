const path = require("path");
const express = require("express");
const dotevn = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");

const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const cookieParser = require("cookie-parser");

const fileupload = require("express-fileupload");

const errorHandler = require("./middleware/error");

const connectDB = require("./config/db");

//load env file
dotevn.config({ path: "./config/config.env" });

// connect to database
connectDB();

//Routes files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

//Middleware files
const logger = require("./middleware/logger");

const app = express();

//body parser

app.use(express.json());

// Cookie parser
app.use(cookieParser());

//middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Helmet set security headers
app.use(helmet());

// Prevent XSS attack
app.use(xss());

// CORS enabled
app.use(cors());

// Rate limter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 100
});

app.use(limiter);

// hpp
app.use(hpp());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

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
