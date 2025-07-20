import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ViewCart() {
  const [username] = useState(localStorage.getItem("username") || "");
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios
      .get("http://localhost:8080/viewCart", { params: { username } })
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Fetch cart failed:", err));
  };

  const updateQuantity = (item, newQty) => {
    if (newQty < 1) return;
    const payload = {
      username,
      prod: { id: item.productId },
      quantity: newQty,
    };
    axios
      .post("http://localhost:8080/updateCartItem", payload)
      .then(() => fetchCart())
      .catch((err) => console.error("Update cart failed:", err));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePayment = async () => {
    const amount = calculateTotal();

    try {
      // ✅ Step 1: Get Razorpay Key
      const { data: key } = await axios.post("http://localhost:8080/get-key");
      console.log("Received Razorpay Key:", key);

      // ✅ Step 2: Create Razorpay Order
      const { data: order } = await axios.post(
        "http://localhost:8080/create-order",
        null,
        { params: { amount } }
      );
      console.log("Created Razorpay Order:", order);

      // ✅ Step 3: Setup Razorpay Options
      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: "My Shop",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          console.log("✅ Razorpay Response:", response);

          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          try {
            const callbackRes = await axios.post(
              "http://localhost:8080/payment-callback",
              null,
              {
                params: {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                },
              }
            );
            console.log("✅ Backend callback success:", callbackRes.data);
            alert("Payment successful!");
            setItems([]);
          } catch (callbackErr) {
            console.error("❌ Payment callback failed:", callbackErr);
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: username || "Guest",
          email: "customer@example.com",
        },
        notes: {
          cartUser: username,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Payment error:", err);
      alert("Something went wrong during payment. Please try again.");
    }
  };

  return (
    <div>
      <h2>{username}'s Cart</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Subtotal</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.productId}>
              <td>
                <img src={it.image} alt={it.name} width="80" />
              </td>
              <td>{it.name}</td>
              <td>{it.price}</td>
              <td>{it.quantity}</td>
              <td>{it.price * it.quantity}</td>
              <td>
                <button onClick={() => updateQuantity(it, it.quantity + 1)}>
                  +
                </button>
                <button onClick={() => updateQuantity(it, it.quantity - 1)}>
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Total: ₹{calculateTotal()}</h3>

      {items.length > 0 && (
        <button onClick={handlePayment}>Proceed to Payment</button>
      )}
    </div>
  );
}
