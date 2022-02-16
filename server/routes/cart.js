const router = require("express").Router();
const cart = require("../models/cart");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthrization,
} = require("../routes/authToken");

// add a cart
router.post("/", verifyTokenAndAuthrization, async (req, res) => {
  const newcart = new cart(req.body);
  try {
    const cart = await newcart.save();
    res.status(200).send(cart);
  } catch (err) {
    res.status(500).send(err);
  }
});

// //update the cart

router.put("/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    const updatedcart = await cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedcart);
  } catch (err) {
    res.status(500).send(err);
  }
});

// // delete the cart
router.delete("/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    await cart.findByIdAndDelete(req.params.id);
    res.status(200).send("cart successfully deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// // get the cart

router.get("/find/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    const carts = await cart
      .findOne({ userId: req.params.id })
      .populate("product.productId")
      .populate("userId");
    res.status(200).send(carts);
  } catch (err) {
    res.status(500).send(err);
  }
});

// // get all the carts || new fist 5 || by category

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await cart.find();

    res
      .status(200)
      .send(carts)
      .populate("product.productId")
      .populate("userId");
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
