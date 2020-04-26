const Router = require("express").Router();
const Mongo = require("../../lib/mongo.js");
module.exports = Router;

Router.get("/all", async (req, res) => {
    let programs = await Mongo.retrievePrograms(["major", "minor", "certificate", "academic"]);
    res.status(200).send(programs);
});

Router.get("/filter", async (req, res) => {
    let programs = await Mongo.retrievePrograms(Object.keys(req.query));
    res.status(200).send(programs);
});

Router.get("/fuzzy", async (req, res) => {
    let programs = await Mongo.fuzzyProgramSearch(req.query.q);
    res.status(200).send(programs);
});

Router.get("/:program_id", async (req, res) => {
    if(/[\w\d]{24}/.test(req.params.program_id)) program_data = await Mongo.retrieveProgramInfoByID(req.params.program_id);
    else program_data = await Mongo.retrieveProgramInfoByName(req.params.program_id);
    res.status(200).send(program_data);
});
