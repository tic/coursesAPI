const Router = require("express").Router();
const Mongo = require("../../lib/mongo.js");
module.exports = Router;

Router.get("/:semester_id/filter", async (req, res) => {
    let page = 1;
    if(req.query.page) {
        page = req.query.page;
        delete req.query.page;
    }

    let per_page = 25;
    if(req.query.per_page) {
        per_page = req.query.per_page;
        delete req.query.per_page;
    }

    let results = await Mongo.filterSemester(req.params.semester_id, req.query, page, per_page);
    res.status(200).send(results);
});

Router.get("/:semester_id/fuzzy", async (req, res) => {
    let results = await Mongo.fuzzySearch(req.params.semester_id, req.query.q);
    res.status(200).send(results);
});
