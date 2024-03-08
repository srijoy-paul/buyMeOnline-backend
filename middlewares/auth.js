const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ err: "authorization header not found" })
        };

        const token = authHeader.split(" ")[1];
        console.log(token);

        if (!token) {
            return res.status(401).json({ err: "You are not authorized to access" });
        };

        const decoded = jwt.verify(token, "The door slammed on the watermelon");

        const { user: { id } } = decoded;
        // console.log(id);

        const user = await pool.query('SELECT * FROM userinfo WHERE id=$1', [id]);

        // console.log(user);

        if (user.rows.length === 0) {
            res.status(404).json({ err: "User not found" });
        }

        req.user = user.rows[0];//we are adding user to the req object, as this will be the same req object, that will be passed on to the next middleware is isSeller.
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

const isSeller = async (req, res, next) => {
    console.log("extended user in req obj", req.user.isseller);
    if (req.user.isseller) {
        console.log(`${req.user.name} is a seller`);
        next();
    }
    else {
        console.log(`${req.user.name} is not a seller`);
        return res.status(401).json({ err: "You are not a seller." });
    }
};

module.exports = { isAuthenticated, isSeller };