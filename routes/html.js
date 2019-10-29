var db = require("../models");

module.exports = function (app) {

    // Route for getting all Articles from the db
    // app.get("/articles", function (req, res)
    app.get("/", function (req, res) {
        // Look at unsaved articles on loadup only
        db.Article.find({
                saved: false
            })
            .then(function (dbArticle) {
                res.render("index", {
                    Article: dbArticle
                });
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

    // Route for grabbing saved articles only
    app.get("/saved", function (req, res) {
        db.Article.find({
                saved: true
            })
            .then(function (dbArticle) {
                res.render("article_saved", {
                    Article: dbArticle
                });
            })
    });

}