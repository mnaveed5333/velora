import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      trim: true,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    image: {
      type: String,
      required: [true, "Blog image is required"],
    },
    author: {
      type: String,
      trim: true,
      default: "Velora Team",
    },
    readTime: {
      type: String,
      trim: true,
      default: "5 min read",
    },
    published: {
      type: Boolean,
      default: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    comments: {
      type: [CommentSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);