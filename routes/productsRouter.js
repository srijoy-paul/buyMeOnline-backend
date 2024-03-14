const express = require("express");
const router = express.Router();

const upload = require("../utils/fileUpload");
const pool = require("../config/db");
const dotenv = require("dotenv").config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(STRIPE_KEY);
const { WebhookClient } = require("discord.js");

const ORDERS_CHANNEL_WEBHOOK = process.env.ORDERS_CHANNEL_WEBHOOK;
const FAILED_ORDERS_CHANNEL_WEBHOOK = process.env.FAILED_ORDERS_CHANNEL_WEBHOOK;

const ordersWebhook = new WebhookClient({
    url: ORDERS_CHANNEL_WEBHOOK,
});
const failedOrdersWebhook = new WebhookClient({
    url: FAILED_ORDERS_CHANNEL_WEBHOOK,
});

const { isAuthenticated, isSeller, isBuyer } = require('../middlewares/auth');

router.post("/create", isAuthenticated, isSeller, async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }

            const { name, price } = req.body;
            if (!name || !price || !req.file) {
                return res.status(400).json({
                    err: "All 3 fields are required"
                });
            }
            if (Number.isNaN(price)) {
                return res.status(400).json({
                    err: "price should be in number"
                });
            }
            let productDetails = {
                name,
                price,
                content: req.file.path
            };
            console.log(productDetails.content);
            const createdProduct = await pool.query('INSERT INTO products(name,price,content) VALUES($1,$2,$3) RETURNING *', [productDetails.name, productDetails.price, productDetails.content]);
            console.log(createdProduct.rows[0]);
            return res.status(200).json({
                status: "ok",
                productDetails
            });
        });
    } catch (error) {
        return res.status(500).send(error);
    }
});

router.get("/get/all", isAuthenticated, async (req, res) => {
    try {
        const allProducts = await pool.query("SELECT * FROM products ORDER BY id");
        const buyedProducts = await pool.query("SELECT * FROM orders");
        console.log("boughtproducts", buyedProducts.rows);
        res.status(200).json({ allProducts: allProducts.rows, boughtProducts: buyedProducts.rows });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.post("/buy/:productId", isAuthenticated, isBuyer, async (req, res) => {
    try {
        // Get the product ID from the request parameters
        const productId = req.params.productId;

        const product = await pool.query('SELECT * FROM products WHERE id=$1', [productId]);
        console.log(product.rows[0]);

        // If no product is found, return an error response
        if (product.rows.length === 0) {
            return res.status(400).json({ err: "No Product Found" })
        };
        console.log(req.user.id, req.user.name);
        // Create an object with the order details, for further use
        const orderDetails = {
            productId,
            buyerId: req.user.id
        };

        // console.log("Amount:", product.rows[0].price);
        // console.log("Currency:", "inr");

        // let paymentMethod = await stripe.paymentMethods.create({
        //     type: "card",
        //     card: {
        //         number: "4242424242424242",
        //         exp_month: 12,
        //         exp_year: 2034,
        //         cvc: 376
        //     },
        // });
        // console.log("Payment Method:", paymentMethod.id);
        // if (!paymentMethod) {
        //     return res.status(400).json({ err: "Payment method creation failed" });
        // }
        //this is the actual interaction with the stripe servers regarding the payments👇🏻
        let paymentIntent = await stripe.paymentIntents.create({
            amount: product.rows[0].price,
            currency: "inr",
            payment_method_types: ["card"],
            payment_method: "pm_card_visa",
            // payment_method: paymentMethod.id,
            confirm: true
        });
        console.log("no error in payments");
        // If payment is successful, create an order in the database
        if (paymentIntent) {
            const createOrder = await pool.query('INSERT INTO orders(productid,buyerid) VALUES($1,$2) RETURNING *', [orderDetails.productId, orderDetails.buyerId]);

            console.log(createOrder.rows[0]);

            // Send a success message to the discord channel configured using orders webhook
            ordersWebhook.send({
                content: `Congratulations  **${req.user.name.charAt(0).toUpperCase() + req.user.name.slice(1)}**, Your order for ${product.rows[0].name} with product id #${product.rows[0].id} have been placed successfully✅, and the payment for order #${product.rows[0].id} of Rs.${product.rows[0].price} is complete!`,
                username: "orders-manager",
                avatarURL: "https://www.pngkit.com/png/full/25-258694_cool-avatar-transparent-image-cool-boy-avatar.png"
            });
            console.log("after sending mssg on discord");

            return res.status(200).json({
                createOrder: createOrder.rows[0],
            });
        } else {
            // If payment fails, send a failure message to another discord channel using the failedorders webhook
            failedOrdersWebhook.send({
                content: `Your request for product ${product.rows[0].name} with product id ${product.rows[0].id} because your payment wasn't successfull.`,
                username: "failedOrders-manager",
                avatarURL: "https://wallup.net/wp-content/uploads/2016/07/20/35951-Avatar_The_Last_Airbender-Appa-glasses.jpg"
            })
            return res.status(400).json({ err: "payment failed" });

        }
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;