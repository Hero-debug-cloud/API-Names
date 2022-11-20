const express = require("express");
// Add Authencation

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connecting with mongodb
mongoose.connect(
  "mongodb+srv://admin-hero:test123@cluster0.gxfyvlz.mongodb.net/NameDB",
  { useNewUrlParser: true }
);

const NamesSchema = {
  name: String,
};
const Name = mongoose.model("Name", NamesSchema);

app.route("/names").get(function (req, res) {
  //reading data from the database;
  Name.find({}, function (err, found) {
    if (err) res.send(err);
    else {
      res.send(found);
    }
  });
});

app.listen(3000, function () {
  console.log("Server Started on port 3000");
});
