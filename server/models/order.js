const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    products: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
