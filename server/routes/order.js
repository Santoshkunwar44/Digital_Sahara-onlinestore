const router = require("express").Router();
const order = require("../models/order");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthrization,
} = require("../routes/authToken");

// add a order
router.post("/", verifyTokenAndAuthrization, async (req, res) => {
  const neworder = new order(req.body);
  try {
    let order = await neworder.save();
    order = await order.populate("userId", "username email");
    order = await order.populate(
      "products.productId",
      "title price color -_id"
    );
    res.status(200).send(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

// //update the order

router.put("/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    const updatedorder = await order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedorder);
  } catch (err) {
    res.status(500).send(err);
  }
});

// // delete the order
router.delete("/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    await order.findByIdAndDelete(req.params.id);
    res.status(200).send("order successfully deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// // get the order

router.get("/find/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    const orders = await order
      .find({ userId: req.params.id })
      .populate("userId")
      .populate("products.productId");
    console.log(orders);
    res.status(200).send(orders);
  } catch (err) {
    // res.status(500).send(err);
    console.log(err);
  }
});

// get all the orders || new fist 5 ||

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await order
      .find()
      .populate("products.productId")
      .populate("userId");
    console.log(orders);
    res.status(200).send(orders);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET THE INCOME OF THE LAST TWO MONTHS

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await order.aggregate([
      {
        $match: { createdAt: { $gte: previousMonth } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send(income);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
