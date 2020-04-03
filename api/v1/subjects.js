const Router = require("express").Router();
const Mongo = require("../../lib/mongo.js");
module.exports = Router;

Router.get("/filter", async (req, res) => {
    let subjects = await Mongo.filterSubjects(req.query);
    res.status(200).send(subjects);
});

Router.get("/all", async (req, res) => {
    let subjects = await Mongo.retrieveSubjects();
    res.status(200).send(subjects);
});

Router.get("/fuzzy", async (req, res) => {
    let results = await Mongo.fuzzySubjectSearch(req.query.q);
    res.status(200).send(results);
});
