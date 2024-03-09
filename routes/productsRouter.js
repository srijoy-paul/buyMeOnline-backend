const express = require("express");
const router = express.Router();

const upload = require("../utils/fileUpload");
const pool = require("../config/db");
const dotenv = require("dotenv").config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
// const stripe = require('stripe')(STRIPE_KEY);
// const { WebhookClient } = require("discord.js");

// const ordersWebhook = new WebhookClient({
//     url: 'https://discord.com/api/webhooks/1215909029612748830/vDeYIxzuHGbmOslL20aLmA5PCNt-ADPCxL99etjKEXeK7yWPZCyS84lvA0cSlsupn0aU',
// })
// const failedOrdersWebhook = new WebhookClient({
//     url: 'https://discord.com/api/webhooks/1215920312869326940/pOC6x7R1MgvluA_5wFccldPqqihYb4ebQ8B1-g9nZ1atwvaH5MzR6XrlawdhSmIwEIqc',
// })

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
                })
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
        const allProducts = await pool.query("SELECT * FROM products");
        console.log(allProducts.rows);
        res.status(200).json({ allProducts });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

// router.post("/buy/:productId", isAuthenticated, isBuyer, async (req, res) => {
//     try {
//         // console.log(req.params.productId);
//         const productId = req.params.productId;

//         const product = await pool.query('SELECT * FROM products WHERE id=$1', [productId]);
//         console.log(product.rows[0]);

//         if (product.rows.length === 0) {
//             return res.status(400).json({ err: "No Product Found" })
//         };
//         console.log(req.user.id);
//         const orderDetails = {
//             productId,
//             buyerId: req.user.id
//         };

//         let paymentMethod = await stripe.paymentMethod.create({
//             type: "card",
//             card: {
//                 number: "8989898787828483",
//                 exp_month: 9,
//                 exp_year: 2023,
//                 cvc: 376
//             },
//         });

//         console.log(paymentMethod.id);
//         let paymentIntent = await stripe.paymentIntent.create({
//             amount: product.rows[0].price,
//             currency: "inr",
//             payment_method_types: ["card"],
//             payment_method: paymentMethod.id,
//             confirm: true
//         });
//         if (paymentIntent) {
//             const createOrder = await pool.query('INSERT INTO orders(productid,buyerid) VALUES($1,$2)', [orderDetails.productId, orderDetails.buyerId]);

//             ordersWebhook.send({
//                 content: `Congratulations Your order for ${product.rows[0].name} with product id ${product.rows[0].id} have been placed successfully🟩.`,
//                 username: "orders-manager",
//                 avatarURL: "../content/assets/9912-rick-pfpsgg.png"
//             })

//             return res.status(200).json({
//                 createOrder: createOrder.rows[0],
//             });
//         } else {
//             failedOrdersWebhook.send({
//                 content: `Your request for product ${product.rows[0].name} with product id ${product.rows[0].id} because your payment wasn't successfull.`,
//                 username: "failedOrders-manager",
//                 avatarURL: "../content/assets/Stripe-Emblem-700x394.png"
//             })
//             return res.status(400).json({ err: "payment failed" });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).send(error);
//     }
// });

module.exports = router;