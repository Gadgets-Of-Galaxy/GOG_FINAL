const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            imagePath: {
                type: String,
                required: false,
            },
            price: {
                type: Number,
                default: 0,
            },
            title: {
                type: String,
            },
            productCode: {
                type: String,
            },
        },
    ],
    totalQty: {
        type: Number,
        default: 0,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);