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

///////////////// General Route for the API/////////////////////
app
  .route("/names")

  // Sending data to the api
  .get(function (req, res) {
    //reading data from the database;
    Name.find({}, function (err, found) {
      if (err) res.send(err);
      else {
        res.send(found);
      }
    });
  })

  //updating our database using api calls;
  .post(function (req, res) {
    //storing updated values in a variable;
    const name = req.body.name;
    const value = new Name({
      name: name,
    });
    value.save(function (err) {
      if (err) res.send(err);
      else res.send("Value Inserted successfully in the database");
    });
  })

  //deleting value from our database using api calls;
  .delete(function (req, res) {
    //storing deleting value;
    const value = req.body.name;
    Name.deleteOne({ name: value }, function (err) {
      if (err) res.send(err);
      else res.send("Value deleted successfully in the database");
    });
  })

  //updating value from the database;
  .put(function (req, res) {
    const id = req.body.id;
    const value = req.body.name;
    Name.updateOne({ _id: id }, { name: value }, function (err) {
      if (err) res.send(err);
      else res.send("Value Updated successfully in the database");
    });
  });

///////////////////////  For Specific Routes///////////////////////////////

app
  .route("/names/:name")

  .get(function (req, res) {
    const value = req.params.name;
    Name.findOne({ name: value }, function (err, found) {
      if (err) res.send(err);
      else if (found == null) res.send("Value not found");
      else res.send(found);
    });
  })

  .post(function (req, res) {
    const name = req.params.name;
    const value = new Name({
      name: name,
    });
    value.save(function (err) {
      if (err) res.send(err);
      else res.send("Value inserted successfully in the database");
    });
  })

  .delete(function (req, res) {
    const name = req.params.name;
    Name.deleteOne({ name: name }, function (err) {
      if (err) res.send(err);
      else res.send("Value deleted successfully");
    });
  })

  .put(function (req, res) {
    const value = req.params.name;
    const id = req.body.id;
    Name.updateOne({ _id: id }, { name: value }, function (err) {
      if (err) res.send(err);
      else res.send("Value updated successfully in the database");
    });
  });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

