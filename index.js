// Load environment variables
require("dotenv").config();

const Mongo = require("./lib/mongo.js").Client;
const express = require("express");
const application = express();
const Router = express.Router();
const http = require("http");

// Listen for API version 1 requests
application.use("/api/v1", require("./api/v1/index.js"));

application.use("/", (req, res) => {
    res.status(200).send("The API can be accessed at /api/v1.");
});

console.log("Creating server...\r");
const Server = http.createServer(application);
console.log("Done.");

console.log("Connecting to Mongo...");
Mongo.connect(err => {
    console.log("Done.");
    if(err) console.log(err);
    else {
        console.log("Successfully connected to the MongoDB.");
        Server.listen(process.env.PORT || 8000);
        console.log("All setup complete. The server has started successfully.\n")
    }
});
