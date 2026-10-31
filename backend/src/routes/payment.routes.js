const express = require("express");
const router = express.Router();
const paymentController = require("../controller/payment.controller");

router.post("/create-order", paymentController.createOrder);
router.post("/verify", paymentController.verifyPayment);


module.exports = router;
