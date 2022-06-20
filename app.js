const path = require("path");

const express = require("express");
const csrf = require("csurf");
const expressSession = require("express-session");

const db = require("./data/database")
const authRoutes = require("./routes/auth.routes");
const csrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const createSessionConfig = require("./config/session");

const app = express();

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({extended: false}));

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(csrfTokenMiddleware);

app.use(authRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase().then(function(){
    app.listen(3000);
}).catch(function(error){
    console.log("Failed to connect to database!");
    console.log(error)
});