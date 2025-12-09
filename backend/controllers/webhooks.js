import User from "../models/User.js";
import { Webhook } from "svix"; // or your webhook library

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
