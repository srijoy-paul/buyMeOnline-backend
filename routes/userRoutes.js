const express = require("express");

const router = express.Router();

const { validateName, validateEmail, validatePassword } = require('../utils/validators')

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;

    } catch (error) {

    }
});

module.exports = router;