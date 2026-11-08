import mongoose from "mongoose";

const qualificationSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      trim: true,
      validate: {
        validator: (value) =>
          !value || /^\/assets\/[a-zA-Z0-9/_.-]+$/.test(value),
        message: "Use an image from /assets/.",
      },
    },
    type: String,
    roleDescription: String,
    outcome: String,
    tools: [String],
    institution: String,
    start: String,
    status: String,
    title: { type: String, required: true, trim: true },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."],
    },
    completion: { type: Date, required: true },
    description: { type: String, required: true, trim: true },
  },
  { versionKey: false },
);

export const Qualification = mongoose.model(
  "Qualification",
  qualificationSchema,
);
