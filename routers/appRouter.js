const bodyParser = require('body-parser');
const express = require("express");
const appRouter = express();
const { getHomePage } = require("../controllers/appController");
appRouter.use(bodyParser.json());

appRouter.get("",getHomePage);
appRouter.post("",getHomePage);


module.exports = appRouter;