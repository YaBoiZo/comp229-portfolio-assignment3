import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    phone: { type: String, trim: true, maxlength: 40 },
    message: { type: String, trim: true, maxlength: 5000 },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
  },
  { versionKey: false },
);

export const Contact = mongoose.model("Contact", contactSchema);
