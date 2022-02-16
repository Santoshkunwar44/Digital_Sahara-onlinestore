const cryptoJs = require("crypto-js");
const user = require("../models/user");
const {
  verifyTokenAndAuthrization,
  verifyTokenAndAdmin,
} = require("./authToken");

const router = require("express").Router();
// UPDATE
router.post("/:id", verifyTokenAndAuthrization, async (req, res) => {
  if (req.body.password) {
    req.body.password = cryptoJs.AES.encrypt(
      req.body.password,
      process.env.cryptoPass
    ).toString();
  }

  try {
    const updatedUser = await user.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedUser);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE

router.delete("/:id", verifyTokenAndAuthrization, async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id);

    res.status(200).send("User has been deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});
// GET THE USER BY THE ADMIN ONLY

router.get("/find/:id", async (req, res) => {
  try {
    const user = await user.findById(req.params.id);

    const { password, ...others } = user._doc;

    res.status(200).send(others);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET the new user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await user.find().sort({ createdAt: -1 }).limit(5)
      : await user.find();

    res.status(200).send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// USER COUNT
router.get("/stats/", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastyear = new Date(date.getFullYear() - 1);
  try {
    const data = await user.aggregate([
      { $match: { createdAt: { $gte: lastyear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
