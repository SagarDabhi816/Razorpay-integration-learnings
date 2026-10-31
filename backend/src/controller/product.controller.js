const productModel = require("../models/product.model.js");

async function createProduct(req, res) {
  const {
    image,
    title,
    description,
    price: { amount, currency },

  } = req.body;

  try {
    const product = await productModel.create({
      image,
      title,
      description,
      price: { amount, currency },
     
    });

    return res.status(201).json({
      message: "Product Created Successfully",
      product: product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
async function getProducts(req,res){

 try {
       const product = await productModel.findOne()
       res.status(200).json({
        message:"Product Fetched",
        product:product
       })
 } catch (error) {
    res.status(500).json({
        message:"Something went wrong"
       })
 }
}
module.exports = {
  createProduct,
  getProducts
};
