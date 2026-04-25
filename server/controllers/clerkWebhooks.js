import { Webhook } from "svix";
import User from "../models/User.js";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString();

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const event = whook.verify(payload, headers);

    const { data, type } = event;

    const userData = {
      clerkId: data.id,
      email: data.email_addresses?.[0]?.email_address || "",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url || "",
    };

    if (type === "user.created") await User.create(userData);
    if (type === "user.updated")
      await User.findOneAndUpdate({ clerkId: data.id }, userData);
    if (type === "user.deleted")
      await User.findOneAndDelete({ clerkId: data.id });

    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;