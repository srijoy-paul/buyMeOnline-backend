const express = require("express");
const app = express();
const cors = require('cors');
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productsRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("content"));
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port number", PORT);
});