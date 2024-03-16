const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log("authheader", authHeader);

        if (!authHeader) {
            return res.status(401).json({ err: "You don't have authorization to access further." })
        };

        const token = authHeader.split(" ")[1];
        console.log("token", token);

        if (!token) {
            return res.status(401).json({ err: "You are not authorized to access" });
        };

        const decoded = jwt.verify(token, process.env.SECRECT_MSSG);

        const { user: { id } } = decoded;
        // console.log(id);

        const user = await pool.query('SELECT * FROM userinfo WHERE id=$1', [id]);

        // console.log(user);

        if (user.rows.length === 0) {
            res.status(404).json({ err: "User not found" });
        };

        req.user = user.rows[0]; //we are adding user to the req object, as this will be the same req object, that will be passed on to the next middlewares (i.e in this case isSeller).
        next(); // whenever it is invoked, it just calls the next middleware.
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

const isSeller = async (req, res, next) => {
    console.log("extended user in req obj", req.user.isseller);
    if (req.user.isseller) { //here by extending the req object with the user, we just optimized a extra DB call(as to fetch the isseller value, it was required to query the DB).
        // console.log(`${req.user.name} is a seller`);
        next();
    }
    else {
        console.log(`${req.user.name} is not a seller`);
        return res.status(401).json({ err: "You are not a seller." });
    }
};
const isBuyer = async (req, res, next) => {
    console.log("extended user in req obj", req.user.isseller);
    if (req.user.isseller !== true) {
        console.log(`${req.user.name} is a buyer`);
        next();
    }
    else {
        console.log(`${req.user.name} is not a buyer`);
        return res.status(401).json({ err: "You are having a seller account and currently seller accounts are restricted to buy products." });
    }
};

module.exports = { isAuthenticated, isSeller, isBuyer };