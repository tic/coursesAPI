const Router = require("express").Router();
const swaggerUI = require('swagger-ui-express');
const docs = require('./swagger.json');
module.exports = Router;

Router.use("/", swaggerUI.serve, swaggerUI.setup(docs));
