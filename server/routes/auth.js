const router = require("express").Router();
const User = require("../models/user");
var CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
// register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.cryptoPass
    ).toString(),
  });
  try {
    await newUser.save();
    res.send("successfully registereds");
  } catch (err) {
    console.log(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send("Wrong Credentials");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.cryptoPass
    );
    const validate =
      req.body.password === hashedPassword.toString(CryptoJS.enc.Utf8);
    console.log(validate);
    if (!validate) {
      return res.status(401).send("Wrong Credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d",
      }
    );

    const { password, ...others } = user._doc;
    res.status(200).send({ ...others, accessToken });
  } catch (err) {
    res.send(500).send("serverError");
  }
});

module.exports = router;
