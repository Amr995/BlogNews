const express = require("express");
const connectToDb = require("./config/connectToDb");
const { notFound, errorHandler } = require("./middlewares/error");
require("dotenv").config();

// Connection To Db
connectToDb();

// init App
const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", require("./routers/authRoute"));
app.use("/api/users", require("./routers/usersRoute"));
app.use("/api/posts", require("./routers/postsRoute"));
app.use("/api/comments", require("./routers/commentsRoute"));
app.use("/api/categories", require("./routers/categoriesRoute"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
