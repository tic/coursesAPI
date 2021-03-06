const Router = require("express").Router();
module.exports = Router;

Router.use("/courses", require("./courses.js"));
Router.use("/programs", require("./programs.js"));
Router.use("/terms", require("./terms.js"));
Router.use("/subjects", require("./subjects.js"));
Router.use("/grades", require("./grades.js"));
Router.use("/docs", require("./docs.js"));

Router.use("/", async (req, res) => {
    res.status(200).send("version 1.0 alpha");
});
