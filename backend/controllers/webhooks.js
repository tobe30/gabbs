import User from "../models/User.js";
import { Webhook } from "svix"; // or your webhook library
import Stripe from "stripe";
import Order from "../models/Order.js";

export const clerkWebhooks = async (req, res) => {
  try {
    // Verify the webhook
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`.trim(),
          imageUrl: data.image_url,
          role: "user", // default role for new users
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0]?.email_address || "",
          name: `${data.first_name} ${data.last_name}`.trim(),
          imageUrl: data.image_url,
          // Keep existing role if not included in update
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        res.json({});
        break;
    }
  } catch (error) {
    console.error("Clerk webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log("🔥 Stripe webhook triggered:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("PaymentIntent metadata:", paymentIntent.metadata);

        const { orderId, userId, appId } = paymentIntent.metadata || {};

        if (!orderId || !userId || appId !== "gabbs") break;

        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paymentStatus: "PAID",
        });

        await User.findByIdAndUpdate(userId, { cart: [] });

        console.log("✅ Order paid & cart cleared via PaymentIntent");
        break;
      }

      case "payment_intent.canceled": {
        const paymentIntent = event.data.object;
        const { orderId } = paymentIntent.metadata || {};

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            isPaid: false,
            paymentStatus: "CANCELED",
          });
          console.log("❌ Payment canceled for order", orderId);
        }
        break;
      }

      default:
        console.log("Unhandled event:", event.type);
    }

    res.json({ received: true });
  } catch (err) {
    console.error("Webhook processing error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const config = {
  api: { bodyparser: false },
};
