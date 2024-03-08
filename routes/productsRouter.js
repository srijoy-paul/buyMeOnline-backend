const express = require("express");
const router = express.Router();

const { isAuthenticated } = require('../middlewares/auth');

router.post("/createProduct", isAuthenticated, async (req, res) => {
    try {

    } catch (error) {

    }
})

module.exports = router;