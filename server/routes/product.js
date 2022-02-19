const router = require("express").Router();
const product = require("../models/product");
const { verifyTokenAndAdmin } = require("../routes/authToken");

// add the new product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new product(req.body);
  try {
    const product = await newProduct.save();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send(err);
  }
});

//update the product

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send(updatedProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete the product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product successfully deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

// get the product

router.get("/find/:id", verifyTokenAndAdmin,async (req, res) => {
  try {
    const products = await product.findById(req.params.id);
    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get all the products || new fist 5 || by category

router.get("/",verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;

    if (qNew) {
      products = await product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await product.find();
    }

    res.status(200).send(products);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
