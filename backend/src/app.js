const express = require("express");
const productRoutes = require("./routes/product.routes");
const paymentRoutes = require("./routes/payment.routes");
const cors = require("cors");

const app = express();
app.use(express.json());

const options = {
  origin: "http://localhost:5173",
};
app.use(cors(options));
app.use("/api/products", productRoutes);
app.use("/api/payments", paymentRoutes);

module.exports = app;
