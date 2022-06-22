const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database");
const baseRoutes = require("./routes/base.routes");
const authRoutes = require("./routes/auth.routes");
const productsRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const csrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const createSessionConfig = require("./config/session");


const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(csrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use(protectRoutesMiddleware);
app.use("/admin", adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function () {
    app.listen(3000);
}).catch(function (error) {
    console.log("Failed to connect to database!");
    console.log(error)
});