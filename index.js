const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productsRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, "content")));
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port number", PORT);
});