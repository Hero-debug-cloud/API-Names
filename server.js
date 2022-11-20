require("dotenv").config();

const express = require("express");
// Add Authencation

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const password = process.env.PASS;
// connecting with mongodb
mongoose.connect(
  "mongodb+srv://admin-hero:" +
    password +
    "@cluster0.gxfyvlz.mongodb.net/NameDB",
  { useNewUrlParser: true }
);

const NamesSchema = {
  name: String,
};
const keySchema = {
  key: String,
};
const Name = mongoose.model("Name", NamesSchema);
const user_key = mongoose.model("User_Key", keySchema);
const admin_key = mongoose.model("Admin_Key", keySchema);

///////////////// General Route for the API   /////////////////////
app
  .route("/names")

  // Sending data to the api
  .get(function (req, res) {
    //authenticating user
    user_key.findOne({ key: req.query.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        //reading data from the database;
        Name.find({}, function (err, found) {
          if (err) res.send(err);
          else {
            res.send(found);
          }
        });
      } else {
        res.send("Key is Invalid");
      }
    });
  })

  //updating our database using api calls;
  .post(function (req, res) {
    admin_key.findOne({ key: req.query.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        //storing updated values in a variable;
        const name = req.body.name;
        const value = new Name({
          name: name,
        });
        value.save(function (err) {
          if (err) res.send(err);
          else res.send("Value Inserted successfully in the database");
        });
      } else res.send("Key is Invalid");
    });
  })

  //deleting value from our database using api calls;
  .delete(function (req, res) {
    admin_key.findOne({ key: req.params.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        //storing deleting value;
        const value = req.body.name;
        Name.deleteOne({ name: value }, function (err) {
          if (err) res.send(err);
          else res.send("Value deleted successfully in the database");
        });
      } else res.send("Key is Invalid");
    });
  })

  //updating value from the database;
  .put(function (req, res) {
    admin_key.findOne({ key: req.params.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        const id = req.body.id;
        const value = req.body.name;
        Name.updateOne({ _id: id }, { name: value }, function (err) {
          if (err) res.send(err);
          else res.send("Value Updated successfully in the database");
        });
      } else {
        res.send("Key is Invalid");
      }
    });
  });

///////////////////////  For Specific Routes///////////////////////////////

app
  .route("/names/:name")

  .get(function (req, res) {
    //authenticating Users;
    user_key.findOne({ key: req.query.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        const value = req.params.name;
        Name.findOne({ name: value }, function (err, found) {
          if (err) res.send(err);
          else if (found == null) res.send("Value not found");
          else res.send(found);
        });
      } else {
        res.send("User Key is invalid");
      }
    });
  })

  .post(function (req, res) {
    admin_key.findOne({ key: req.query.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        const name = req.params.name;
        const value = new Name({
          name: name,
        });
        value.save(function (err) {
          if (err) res.send(err);
          else res.send("Value inserted successfully in the database");
        });
      } else res.send("Key is Invalid");
    });
  })

  .delete(function (req, res) {
    admin_key({ key: req.params.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        const name = req.params.name;
        Name.deleteOne({ name: name }, function (err) {
          if (err) res.send(err);
          else res.send("Value deleted successfully");
        });
      } else res.send("key is Invalid");
    });
  })

  .put(function (req, res) {
    admin_key.findOne({ key: req.params.key }, function (err, found) {
      if (err) res.send(err);
      else if (found != null) {
        const value = req.params.name;
        const id = req.body.id;
        Name.updateOne({ _id: id }, { name: value }, function (err) {
          if (err) res.send(err);
          else res.send("Value updated successfully in the database");
        });
      } else res.send("Key is Invalid");
    });
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
