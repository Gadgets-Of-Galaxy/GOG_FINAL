const express = require("express");
const Product = require("../models/product");
const Category = require("../models/category");
const Cart = require("../models/cart");
const Wishlist = require("../models/wishlist");
const Checkout = require("../models/checkout");
const ContactUs = require("../models/contact");
const middleware = require("../middleware");
const User = require('../models/user');
const passport = require('passport');
const { check } = require("express-validator");
const router = express.Router();

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gadgetsofgalaxy123@gmail.com",
        pass: "hxaqzlreadakbpbd"
    }
})

router.get('/', async (req, res) => {
    try {
        const users = await User.find({})
        const categories = await Category.find({})
        const products = await Product.find({})
        // .populate("category");
        // console.log(users)
        // console.log(products)
        // console.log(categories)
        res.render('home', { title: 'Homepage', users, products, categories, middleware })
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

router.get('/homepage', (req, res) => {
    return res.redirect('/')
})

router.get("/category", (req, res) => {
    res.render("pagecategory", { title: 'Category' });
});


router.get('/featuredproducts', async (req, res) => {
    try {
        const categories = await Category.find({})
        const products = await Product.find({}).sort("-reviewed")
        res.render('products', { title: 'Featured Products', products, categories });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/relatedProducts/:id', async (req, res) => {
    try {
        const categories = await Category.find({})
        const products = await Product.find({ brand: req.params.id })
        res.render('products', { title: 'Related Products', products, categories });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/trendingproducts', async (req, res) => {
    try {
        const categories = await Category.find({})
        const products = await Product.find({}).sort("-sold")
        res.render('products', { title: 'Trending Products', products, categories });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});


router.post("/search", async (req, res) => {
    try {
        console.log(req.body);
        // const products = await Product.find({
        //     title: { $regex: req.query.search, $options: "i" },
        // }).exec();
        const products = await Product.find({ title: { $regex: req.body.search, $options: "i" } })
        // console.log(products)
        res.render("products", {
            title: "Search Results",
            products
        });
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

router.get("/contactUs", (req, res) => {
    res.render("contactUs", { title: 'Contact Us' });
});

router.post("/contactUs", async (req, res) => {
    // console.log(req.body);
    try {
        const newContactUs = await new ContactUs();
        newContactUs.name = req.body.name;
        newContactUs.email = req.body.email;
        newContactUs.subject = req.body.subject;
        newContactUs.phone = req.body.phone;
        newContactUs.message = req.body.message;
        await newContactUs.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
})

// router.get("/myAccount", (req, res) => {
//     res.render("user_profile", { title: 'User Profile' });
// });

// GET: display the register form
router.get("/register", middleware.isNotLoggedIn, (req, res) => {
    res.redirect('/login')
});

// POST: handle the register logic
router.post(
    "/register",
    [
        middleware.isNotLoggedIn,
        passport.authenticate("local.register", {
            successRedirect: "/login",
            failureRedirect: "/register",
            failureFlash: true,
        }),
    ],
    async (req, res) => {
        try {
            res.redirect("/login");
        } catch (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/");
        }
    }
);

// GET: display the login form
router.get("/login", middleware.isNotLoggedIn, async (req, res) => {
    res.render("login", {
        title: 'Login | Register',
    });
});

// POST: handle the login logic
router.post(
    "/login",
    [
        middleware.isNotLoggedIn,
        passport.authenticate("local.login", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
    ],
    async (req, res) => {
        try {
            // cart logic when the user logs in
            let cart = await Cart.findOne({ user: req.user._id });
            // if there is a cart session and user has no cart, save it to the user's cart in db
            if (req.session.cart && !cart) {
                const cart = await new Cart(req.session.cart);
                cart.user = req.user._id;
                await cart.save();
            }
            // if user has a cart in db, load it to session
            if (cart) {
                req.session.cart = cart;
            }
            // redirect to old URL before loging in
            if (req.session.oldUrl) {
                var oldUrl = req.session.oldUrl;
                req.session.oldUrl = null;
                res.redirect(oldUrl);
            } else {
                res.redirect("/myAccount");
            }
        } catch (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/");
        }
    }
);

// GET: display user's profile
router.get("/myAccount", middleware.isLoggedIn, async (req, res) => {
    try {
        user_details = await User.find({ email: req.user.email }).exec();
        // console.log(user_details[0])
        res.render("user_profile", {
            user: user_details,
            title: "User Profile",
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

router.get("/editProfile", middleware.isLoggedIn, async (req, res) => {
    try {
        user_details = await User.find({ email: req.user.email }).exec();
        // console.log(user_details[0])
        res.render("edit_profile", {
            user: user_details,
            title: "Edit Profile",
        });
    } catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

router.post('/editProfile/:id', middleware.isLoggedIn, async (req, res) => {
    console.log(req.params);
    console.log(req.body);
    var user_id = req.params.id;
    User.findByIdAndUpdate(user_id, {
        mobileNumber: req.body.profileInputMobileNum,
        gender: req.body.profileInputGender,
        dob: req.body.profileInputBirthday.toString(),
        location: req.body.profileInputLocation,
    }, function (err, docs) {
        if (err) {
            console.log(err)
            res.redirect('/editProfile');
        }
        else {
            console.log("Updated User");
            res.redirect('/myAccount');
        }
    });
});

router.get("/myOrders", middleware.isLoggedIn, async (req, res) => {
    try {
        if (req.user && !req.session.checkout) {
            res.render("myorders", {
                user_checkout: null,
                user_checkout_items: null,
                title: "My Orders",
            });
        }
        else {
            user_checkout = await Checkout.find({ user: req.user._id });
            console.log(user_checkout);
            user_checkout_items = user_checkout[0].items;
            res.render("myorders", {
            user_checkout: user_checkout[0],
            user_checkout_items: user_checkout_items,
            title: "My Orders",
        });
        }
    }
    catch (err) {
        console.log(err);
        return res.redirect("/");
    }
});

// GET: logout
router.get("/logout", middleware.isLoggedIn, (req, res) => {
    req.logout();
    req.session.cart = null;
    req.session.wishlist = null;
    res.redirect("/");
});


router.get("/shopping-cart", middleware.isLoggedIn, async (req, res) => {
    try {
        if (req.user && !req.session.cart) {
            const categories = await Category.find({});
            res.render("cart", { title: 'Cart', categories, cartitems: null });
        }
        else {
            const categories = await Category.find({});
            const requireuser = await Cart.findOne({ user: req.user._id })
            const cartitems = requireuser.items;
            // console.log(cartitems[0])
            res.render("cart", { title: 'Cart', categories, cartitems });
        }
    } catch (error) {
        console.log(error);
        // res.redirect('/');
    }
});

router.get("/wishlist", middleware.isLoggedIn, async (req, res) => {
    try {
        if (!req.user) {
            const categories = await Category.find({});
            res.render("wishlist", { title: 'wishlist', categories, wishlistitems: null });
        }
        if (req.user && !req.session.wishlist) {
            const categories = await Category.find({});
            res.render("wishlist", { title: 'wishlist', categories, wishlistitems: null });
        }
        else {
            // console.log(req.session)
            const categories = await Category.find({});
            const requireuser = await Wishlist.findOne({ user: req.user._id })
            // console.log(requireuser.items[0])
            const wishlistitems = requireuser.items;
            res.render("wishlist", { title: 'wishlist', categories, wishlistitems });
        }
    } catch (error) {
        console.log(error);
        //res.redirect('/');
    }
});

router.get("/add-to-wishlist/:id", middleware.isLoggedIn, async (req, res) => {
    const productId = req.params.id;
    try {
        // get the correct cart, either from the db, session, or an empty cart.
        let user_wishlist;
        if (req.user) {
            user_wishlist = await Wishlist.findOne({ user: req.user._id });
        }
        let wishlist;
        if (
            (req.user && !user_wishlist && req.session.wishlist) ||
            (!req.user && req.session.wishlist)
        ) {
            wishlist = await new Wishlist(req.session.wishlist);
        } else if (!req.user || !user_wishlist) {
            wishlist = new Wishlist({});
        } else {
            wishlist = user_wishlist;
        }

        // add the product to the cart
        const product = await Product.findById(productId);
        const itemIndex = wishlist.items.findIndex((p) => p.productId == productId);
        if (itemIndex > -1) {
        } else {
            // console.log(productId);
            // if product does not exists in cart, find it in the db to retrieve its price and add new item
            wishlist.items.push({
                productId: productId,
                price: product.price,
                title: product.title,
                imagePath: product.imagePath,
                productCode: product.productCode,
            });
            wishlist.totalQty++;
        }

        // if the user is logged in, store the user's id and save cart to the db
        if (req.user) {
            wishlist.user = req.user._id;
            await wishlist.save();
        }
        req.session.wishlist = wishlist;
        req.flash("success", "Item added to the shopping wishlist");
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

async function productsFromCart(cart) {
    let products = []; // array of objects
    for (const item of cart.items) {
        let foundProduct = (
            await Product.findById(item.productId).populate("category")
        ).toObject();
        foundProduct["qty"] = item.qty;
        foundProduct["totalPrice"] = item.price;
        products.push(foundProduct);
    }
    return products;
}


// GET: add a product to the shopping cart when "Add to cart" button is pressed
router.get("/add-to-cart/:id", async (req, res) => {
    const productId = req.params.id;
    try {
        // get the correct cart, either from the db, session, or an empty cart.
        let user_cart;
        if (req.user) {
            user_cart = await Cart.findOne({ user: req.user._id });
        }
        let cart;
        if (
            (req.user && !user_cart && req.session.cart) ||
            (!req.user && req.session.cart)
        ) {
            cart = await new Cart(req.session.cart);
        } else if (!req.user || !user_cart) {
            cart = new Cart({});
        } else {
            cart = user_cart;
        }

        // add the product to the cart
        const product = await Product.findById(productId);
        const itemIndex = cart.items.findIndex((p) => p.productId == productId);
        if (itemIndex > -1) {
            // if product exists in the cart, update the quantity
            cart.items[itemIndex].qty++;
            cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
            cart.totalQty++;
            cart.totalCost += product.price;
        } else {
            // console.log(productId);
            // if product does not exists in cart, find it in the db to retrieve its price and add new item
            cart.items.push({
                productId: productId,
                qty: 1,
                price: product.price,
                title: product.title,
                imagePath: product.imagePath,
                productCode: product.productCode,
            });
            cart.totalQty++;
            cart.totalCost += product.price;
        }

        // if the user is logged in, store the user's id and save cart to the db
        if (req.user) {
            cart.user = req.user._id;
            await cart.save();
        }
        req.session.cart = cart;
        req.flash("success", "Item added to the shopping cart");
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});


// GET: reduce one from an item in the shopping cart
router.get("/reduce/:id", async function (req, res, next) {
    // if a user is logged in, reduce from the user's cart and save
    // else reduce from the session's cart
    const productId = req.params.id;
    let cart;
    // console.log(productId);
    const product = await Product.find({_id: productId});
        // console.log(product);
    try {
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        } else if (req.session.cart) {
            cart = await new Cart(req.session.cart);
        }
        // find the item with productId
        let itemIndex = cart.items.findIndex((p) => p.productId == productId);
        // if (itemIndex > -1) {
            // find the product to find its price
            // if product is found, reduce its qty
            // console.log(cart.totalCost);
            cart.items[itemIndex].qty--;
            cart.items[itemIndex].price = cart.items[itemIndex].price - product.price;
            cart.totalQty--;
            cart.totalCost -= product.price;
            // if the item's qty reaches 0, remove it from the cart
            if (cart.items[itemIndex].qty <= 0) {
                await cart.items.remove({ _id: cart.items[itemIndex]._id });
            }
            req.session.cart = cart;
            //save the cart it only if user is logged in
            if (req.user) {
                await cart.save();
            }
            //delete cart if qty is 0
            if (cart.totalQty <= 0) {
                req.session.cart = null;
                await Cart.findByIdAndRemove(cart._id);
            }
        // }
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        // res.redirect("/");
    }
});

// GET: remove all instances of a single product from the cart
router.get("/removeAll/:id", async function (req, res, next) {
    const productId = req.params.id;
    let cart;
    try {
        if (req.user) {
            cart = await Cart.findOne({ user: req.user._id });
        } else if (req.session.cart) {
            cart = await new Cart(req.session.cart);
        }
        //fnd the item with productId
        let itemIndex = cart.items.findIndex((p) => p.productId == productId);
        if (itemIndex > -1) {
            //find the product to find its price
            cart.totalQty -= cart.items[itemIndex].qty;
            cart.totalCost -= cart.items[itemIndex].price;
            await cart.items.remove({ _id: cart.items[itemIndex]._id });
        }
        req.session.cart = cart;
        //save the cart it only if user is logged in
        if (req.user) {
            await cart.save();
        }
        //delete cart if qty is 0
        if (cart.totalQty <= 0) {
            req.session.cart = null;
            await Cart.findByIdAndRemove(cart._id);
        }
        res.redirect(req.headers.referer);
    } catch (err) {
        console.log(err.message);
        res.redirect("/");
    }
});

// GET: checkout form with csrf token
router.get("/checkout", middleware.isLoggedIn, async (req, res) => {
    if (!req.session.cart) {
        return res.redirect("/shopping-cart");
    }
    //load the cart with the session's cart's id from the db
    const cart = await Cart.findById(req.session.cart._id);
    // console.log(cart);
    res.render("checkout", { title: "Checkout", cost: cart.totalCost });
});

router.get("/placeOrder", middleware.isLoggedIn, async (req, res) => {
    const cart = await Cart.findById(req.session.cart._id);
    let checkout = new Checkout();
    checkout.items = cart.items;
    checkout.totalCost = cart.totalCost;
    checkout.totalQty = cart.totalQty;
    checkout.user = cart.user;
    req.session.checkout = checkout;
    await checkout.save();
    await cart.save();
    await Cart.findByIdAndDelete(cart._id);
    req.session.cart = null;
    const mailOptions = {
        from: "gadgetsofgalaxy123@gmail.com",
        to: req.user.email,
        subject: "GOG Registration",
        html: "<h1>Your Order has been placed succesfully</h1>"
    }
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log("Email sent:" + info.response);
        }
    })
    res.redirect('/')
});


module.exports = router;