const router = require("express").Router();
const STRIPE_KEY = "sk_test_51KTifwAOecuirf4xaGsBtGxHAblFjCpwTdBHfaZm5wSSRc9ozUWVYxDkrkQ9DoAoEG5aHfzEb3KvOXHKnIQQpQ1400yD3V141h"
const stripe = require("stripe")(STRIPE_KEY);

console.log(STRIPE_KEY)
router.post("/payment", async (req, res) => {
  console.log(req.body)
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).send(stripeErr);
        console.log(stripeErr);
      } else {
        console.log(stripeRes);
        res.status(200).send(stripeRes);
      }
    }
  );
});
module.exports = router;
