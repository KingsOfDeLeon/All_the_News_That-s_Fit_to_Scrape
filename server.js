var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Routes
app.get("/scrape", function (req, res) {
    //initial scrape
    axios.get("https://www.sandiegouniontribune.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        // $("ps-promo div.PromoSmall-title").each(function (i, element) {
        //     var result = {};
        //     result.title = $(this)
        //         .children("a")
        //         .text();
        //     result.link = $(this)
        //         .children("a")
        //         .attr("href");
        //     db.Article.create(result)
        //         .then(function (dbArticle) {
        //             console.log(dbArticle);
        //         })
        //         .catch(function (err) {
        //             console.log("NOW CONSOLING ===>");
        //             console.log(err);
        //         });
        // });
        $("ps-promo div.PromoSmall-wrapper").each(function (i, element) {
            var result = {};
            result.category = $(this)
                .children(".PromoSmall-titleContainerDupe")
                .children(".PromoSmall-category")
                .children("a")
                .text();
            result.title = $(this)
                .children(".PromoSmall-titleContainerDupe")
                .children(".PromoSmall-title")
                .children("a")
                .text();
            result.link = $(this)
                .children(".PromoSmall-titleContainerDupe")
                .children(".PromoSmall-title")
                .children("a")
                .attr("href");
            result.summary = $(this)
                .children(".PromoSmall-content")
                .children(".PromoSmall-description")
                .text();
            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log("NOW CONSOLING ===>");
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});

// Route for getting all Articles from the db
// app.get("/articles", function (req, res)
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                note: dbNote._id
            }, {
                new: true
            });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});