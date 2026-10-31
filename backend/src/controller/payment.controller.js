const productModel = require("../models/product.model");
const paymentModel = require("../models/payment.model");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function createOrder(req, res) {
  try {
    const product = await productModel.findOne();
    if (!product) {
      return res.status(404).json({ message: "No product is available to purchase" });
    }

    if (
      typeof product.price?.amount !== "number" ||
      product.price.amount <= 0 ||
      !product.price.currency
    ) {
      return res.status(400).json({ message: "The product price is invalid" });
    }

    const options = {
      amount: product.price.amount,
      currency: product.price.currency,
    };
    const order = await razorpay.orders.create(options);

    await paymentModel.create({
      orderId: order.id,
      price: {
        amount: order.amount,
        currency: order.currency,
      },
      status: "PENDING",
    });

    return res.status(201).json({
      message: "Payment created",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ message: "Error creating order" });
  }
}

async function verifyPayment(req, res) {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (
    typeof razorpayOrderId !== "string" ||
    typeof razorpayPaymentId !== "string" ||
    typeof signature !== "string" ||
    !razorpayOrderId ||
    !razorpayPaymentId ||
    !signature
  ) {
    return res.status(400).json({
      message: "razorpayOrderId, razorpayPaymentId, and signature are required",
    });
  }

  if (!secret) {
    return res.status(500).json({ message: "Payment verification is not configured" });
  }

  try {
    const {
      validatePaymentVerification,
    } = require("razorpay/dist/utils/razorpay-utils.js");
    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret,
    );

    if (!result) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await paymentModel.findOne({ orderId: razorpayOrderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment order was not found" });
    }

    payment.paymentId = razorpayPaymentId;
    payment.signature = signature;
    payment.status = "COMPLETED";
    await payment.save();
    return res.json({ status: "success" });
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    return res.status(500).json({ message: "Error verifying payment" });
  }
}
module.exports = {
  createOrder,
  verifyPayment,
};
