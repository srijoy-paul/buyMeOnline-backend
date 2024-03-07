const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("api/v1/user", userRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log("Server running on port number", PORT);
})