const express = require("express");
const router = express.Router();

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateName, validateEmail, validatePassword } = require('../utils/validators');

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, isSeller } = req.body;
        console.log(name, email, password, isSeller);
        const existingUser = await pool.query('SELECT * FROM userinfo WHERE email=$1', [email]);
        // console.log("fetching from DB", existingUser.rows);
        if (existingUser.rows.length !== 0) {
            return res.status(403).json({ err: "user already exists" });
        }
        console.log("no existingUser");

        if (!validateName(name)) {
            return res.status(403).json({ err: "user name validation failed" });
        }
        if (!validateEmail(email)) {
            return res.status(403).json({ err: "user email validation failed" });
        }
        if (!validatePassword(password)) {
            return res.status(403).json({ err: "user password requirement validation failed" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        // console.log(hashedPassword);

        const newUser = {
            name: name,
            email: email,
            password: hashedPassword,
            isSeller: isSeller
        };

        const createdUser = await pool.query('INSERT INTO userinfo(name,email,password,isSeller) VALUES($1,$2,$3,$4) RETURNING *', [newUser.name, newUser.email, newUser.password, newUser.isSeller]);
        console.log(">>", createdUser.rows[0]);

        return res.status(201).json({ message: `Welcome! ${newUser.name}` });

    } catch (error) {
        return res.status(500).send(e);
    }
});

router.post("/signin", async (req, res) => {
    try {
        //after checking the credentials exists or not, if exists then generate JWT token(we call it bearer token and we need an secrect message/password whatever we can call, it is used for encryption and decryption and this also have an expiry time)(it is encrypting the userid) for the user id only(using this we can query from DB), and then we send it to the client and set it in their cookie storage(reason behind using cookie is that DB can also access cookie, where DB cannot access localstorage, sessionstorage ), so it means they are authorized to access rest of the website.
        const { email, password } = req.body;
        if (email.length === 0) {
            return res.status(400).json({ err: "Please provide an email" })
        }
        if (password.length === 0) {
            return res.status(400).json({ err: "Please provide a password" })
        }

        const existingUser = await pool.query('SELECT * FROM userinfo WHERE email=$1', [email]);
        console.log(existingUser.rows[0]);
        if (existingUser.rows.length === 0) {
            return res.status(404).json({ err: "User not found." })
        }

        const isPasswordMatching = await bcrypt.compare(password, existingUser.rows[0].password);

        if (!isPasswordMatching) {
            return res.status(400).json({ err: "email or password mismatch" });
        }

        const payload = { user: { id: existingUser.rows[0].id } };

        const bearerToken = jwt.sign(payload, "The door slammed on the watermelon", {
            expiresIn: 360000
        });

        res.cookie('bt', bearerToken, { expire: new Date() + 9889 });
        return res.status(200).json({ bearer: bearerToken })
    } catch (error) {
        return res.status(500).send(e);
    }
})

router.get("/signout", async (req, res) => {
    try {
        res.clearCookie('bt');
        return res.status(200).json({ message: "cookie deleted" });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;