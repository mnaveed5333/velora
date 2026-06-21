import mongoose from "mongoose";

const ContactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    whatsapp: {
      type: String,
      required: [true, "WhatsApp number is required"],
      trim: true,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactSubmission ||
  mongoose.model("ContactSubmission", ContactSubmissionSchema);