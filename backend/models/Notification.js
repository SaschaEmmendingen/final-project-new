import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // oder "Admin"
    senderModel: { type: String, enum: ["User", "Admin"] },
    recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // oder "Admin"
    recipientModel: { type: String, enum: ["User", "Admin"] },
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // oder "Admin"
        message: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
