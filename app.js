const express = require("express");
const appRouter = require("./routers/appRouter");
const app = express();
const path = require("path");

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "Views"));

app.use("", appRouter);

let port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("server started at ", port);
});
