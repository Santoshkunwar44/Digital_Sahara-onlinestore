const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    categories: {
      type: Array,
    },
    
    color: {
      type: Array,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
