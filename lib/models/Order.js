import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    image: String,
    price: { type: Number, required: true },
    color: { type: String, default: null },
    size: { type: String, default: null },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true, default: "" },
    country: { type: String, required: true, trim: true },
    streetAddress: { type: String, required: true, trim: true },
    apartment: { type: String, trim: true, default: "" },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true, default: "" },
    pinCode: { type: String, trim: true, default: "" },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "transfer", "card"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "completed", "cancelled"],
      default: "pending",
    },

    paymentScreenshot: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
    verifiedBy: { type: String, default: null },

    // NEW: shipping contact — admin assigns a person + number the
    // customer can reach out to once their order ships
    shippingContact: {
      name: { type: String, default: null },
      phone: { type: String, default: null },
    },
    shippedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);