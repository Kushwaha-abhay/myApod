const bodyParser = require('body-parser');
const express = require("express");
const appRouter = express();
const { getHomePage } = require("../controllers/appController");
appRouter.use(bodyParser.json());

appRouter.get("/myapod",getHomePage);
appRouter.post("/myapod",getHomePage);


module.exports = appRouter;