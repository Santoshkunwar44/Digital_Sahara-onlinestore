const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors")

// routes imports
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/stripe");
app.use(express.json());
dotenv.config();
app.use(cors())
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to Db"))
  .catch((err) => console.log(err));

// endpoints

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", paymentRoute);
app.listen(8000, () => console.log("server is running..."));
