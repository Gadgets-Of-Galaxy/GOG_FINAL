const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Order = require("../models/order");
const middleware = require("../middleware");
const User = require('../models/user');
const passport = require('passport')
const csrf = require("csurf");
const productsRouter = express.Router();


// const csrfProtection = csrf();
// productsRouter.use(csrfProtection);

// GET: display a certain product by its id
productsRouter.get('/:slug/:id', async (req, res) => {
    try {
        console.log(req.params)
        const product = await Product.findById(req.params.id);
        const categories = await Category.find({});
        const products = await Product.find({});
        // console.log(categories)
        res.render("singlepage", { title: "Single Page", product, products, categories });
    } catch(error) {
        console.log(error);
        return res.redirect("/");
    }
});

productsRouter.get("/:slug", async (req, res) => {
    try {   
        console.log(req.params)
        const foundCategory = await Category.findOne({ slug: req.params.slug });
        const allProducts = await Product.find({ category: foundCategory._id.toString() });
        const categories = await Category.find({});
        const req_products = await Product.distinct('brand');
        const category = req.params.slug;
        //     // .sort("-createdAt")
        // console.log(foundCategory)
        console.log(req_products);
        res.render("pagecategory", {
            title: 'Category',
            currentCategory: foundCategory,
            products: allProducts, req_products,
            categories,category
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
});

module.exports = {productsRouter};