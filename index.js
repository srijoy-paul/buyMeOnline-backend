const express = require("express");
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const fs = require("fs")
const YAML = require('yaml')

const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productsRouter");

// const specs=swaggerJsDoc({
//     definition:{
//         openapi:""
//     }
// })
// const file = require("./swagger.yaml");
const file = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/images', express.static(path.join(__dirname, "content")));
app.use(cors());
app.use(express.static("../buyMeOnline-frontend"))

app.use(cookieParser());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productsRouter);

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Server running on port number", PORT);
});