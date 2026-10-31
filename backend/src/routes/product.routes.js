const express = require("express")
const productController  = require("../controller/product.controller")


const router = express.Router()


router.post("/",productController.createProduct)
router.get("/get-item",productController.getProducts)



module.exports = router