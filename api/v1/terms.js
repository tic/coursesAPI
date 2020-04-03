const Router = require("express").Router();
const Mongo = require("../../lib/mongo.js");
module.exports = Router;

Router.get("/all", async (req, res) => {
    let terms = await Mongo.retrieveTerms();
    res.status(200).send(terms);
});

Router.get("/current", async (req, res) => {
    let current_term = await Mongo.retrieveCurrentTerm();
    res.status(200).send(current_term);
});
