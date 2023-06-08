require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const color = require("colors");
const morgan = require("morgan");
const helmet = require("helmet");
var createError = require("http-errors");
const cookieParser = require("cookie-parser");
var rateLimit = require("express-rate-limit");

const path = require("path");

const authRoute = require("./routes/authentication");
const userRoute = require("./routes/user");
const restaurantRoute = require("./routes/restaurant");
const foodRoute = require("./routes/food");
const cartRoute = require("./routes/cart");
const bookmarkRoute = require("./routes/bookmark");

/* --------------------------------- Config --------------------------------- */
const corsOptions = {
  origin: process.env.API_URL || "http://localhost:3300",
};

// Database Connexion
mongoose.set("strictQuery", true);
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@restoapp.szzkg2i.mongodb.net/restoApp?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.connection.on("connected", () => {
  console.log("MongoBD is connected!".magenta);
});

/* ------------------------------- Middleware ------------------------------- */

app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(cookieParser());
app.use(morgan("dev"));
// Parse requests of content-type - application/json
app.use(express.json());
app.use(express.static("static"));
app.disable("x-powered-by");

var limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - user has full speed until the max limit is reached
});

app.use(limiter); // applies rate limiting policy to every endpoint of the server
// we could also apply policies for specific routes or even different policies for each route

/* -------------------------------- Endpoints ------------------------------- */
// app.use("*", tokenVerification)
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/food", foodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/bookmark", bookmarkRoute);
app.use("/api/restaurant", restaurantRoute);

// Errors handling
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Someting Went Wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 3300;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.blue);
});
