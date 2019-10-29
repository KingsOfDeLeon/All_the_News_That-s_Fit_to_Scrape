var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({
    extended: true
}));

//handlebars
app.engine("handlebars", exphbs({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");


app.use(express.json());
app.use(express.static("public"));

//mongo connection
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);


require("./routes/html.js")(app);
require("./routes/api.js")(app);

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});