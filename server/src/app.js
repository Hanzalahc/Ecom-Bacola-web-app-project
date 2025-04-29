import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
const app = express();

// defaults middlweares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// importing routes
import GalleryRoutes from "./routes/Gallery.js";
import UserRoutes from "./routes/User.js";
import CategoryRoutes from "./routes/Category.js";
import ProductRoutes from "./routes/Product.js";
import AddressRoutes from "./routes/Address.js";
import ReviewRoutes from "./routes/Review.js";
import OrderRoutes from "./routes/Order.js";
import StripePaymentRoute from "./routes/StripePayment.js";
import StatsRoute from "./routes/Stats.js";

// routes declaration
app.use("/gallery", GalleryRoutes);
app.use("/user", UserRoutes);
app.use("/category", CategoryRoutes);
app.use("/product", ProductRoutes);
app.use("/address", AddressRoutes);
app.use("/review", ReviewRoutes);
app.use("/order", OrderRoutes);
app.use("/stripe", StripePaymentRoute);
app.use("/stats", StatsRoute);

// / Error handler middleware
app.use(errorHandler);

export default app;
