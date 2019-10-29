var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");

// Routes
app.get("/scrape", function (req, res) {
    //initial scrape
    axios.get("https://www.sandiegouniontribune.com/").then(function (response) {
        var $ = cheerio.load(response.data);
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