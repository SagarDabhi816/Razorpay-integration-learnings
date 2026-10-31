import axios from "axios";

function PaymentButton() {
  const handlePayment = async () => {
    try {
      // Step 1: Create order on backend
      const { data } = await axios.post(
        "http://localhost:3000/api/payments/create-order",
      );
      const order = data.order;
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!order?.id) {
        throw new Error("The server did not return a Razorpay order ID.");
      }
      if (!key) {
        throw new Error("Set VITE_RAZORPAY_KEY_ID in the frontend .env file.");
      }

      // Step 2: Razorpay options
      const options = {
        // key:process.env.RAZORPAY_KEY_ID, // from .env (frontend can use only key_id)
        // key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        key, // from .env (frontend can use only key_id)
        amount: order.amount,
        currency: order.currency,
        name: "My Company",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          try {
            await axios.post("http://localhost:3000/api/payments/verify", {
              razorpayOrderId: razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              signature: razorpay_signature,
            });
            alert("Payment successful!");
          } catch (err) {
            alert(
              err.response?.data?.message || "Payment verification failed!",
            );
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#f04646ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Could not start Razorpay checkout:", err);
      alert(err.message || "Could not start checkout.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      style={{
        padding: "10px 20px",
        background: "#3399cc",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
      }}
    >
      Pay Now
    </button>
  );
}

export default PaymentButton;
