const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema);
