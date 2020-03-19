const express = require("express");
const dotevn = require("dotenv");

//Routes files
const bootcamps = require("./routes/bootcamps");

//Middleware files
const logger = require("./middleware/logger");

//load env file
dotevn.config({ path: "./config/config.env" });

const app = express();

//middleware
app.use(logger);

// Mount routes
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
