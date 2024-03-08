const jwt = require("jsonwebtoken");
const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ err: "authorization header not found" })
        };

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ err: "You are not authorized to access" });
        };

        const decoded = jwt.verify(token, "The door slammed on the watermelon");

        const { user: { id } } = decoded;
        console.log(id);
    } catch (error) {

    }
}

module.exports = { isAuthenticated };