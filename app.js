const express = require('express');
var database = require('./database');
const body = require('body-parser');
var app = express();
app.use(body.urlencoded({
  extended:false
}));
// app.use(body.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Origin, X-requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods","PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});
// GET all the shoe stock
app.get("/api/shoes",function(req, res) {
  database.find({},null,{sort:{brand:1}},function(err, shoes) {
    if(err) console.log("Error finding the shoes from the database:\n"+err);
    else res.json(shoes);
  });
});
// List all shoes for a given brand
app.get("/api/shoes/brand/:brandName",function(req, res) {
  console.log(req.params.brandName);
  database.find({brand:req.params.brandName},function(err,shoes) {
    if(err) console.log("Error finding shoes by brand name:\n"+err);
    else res.json(shoes);
  });
});
// Building a mega search feature
app.get("/api/shoes/brand/:queryString",function(req, res) {
  // expecting something like: ["Bronx","Gucci","Converse"],["Black","Blue","Pink"],[0,350];
  var
  console.log(req.params.brandName);
  database.find({brand:req.params.brandName},function(err,shoes) {
    if(err) console.log("Error finding shoes by brand name:\n"+err);
    else res.json(shoes);
  });
});
// List all shoes for a given size
app.get("/api/shoes/size/:shoeSize",function(req, res) {
  console.log(req.params.shoeSize);
  database.find({size:req.params.shoeSize},function(err,shoes) {
    if(err) console.log("Error finding shoes by shoe size:\n"+err);
    else res.json(shoes);
  });
});
// List all shoes for a given brand & size
app.get("/api/shoes/brand/:brandName/size/:size",function(req, res) {
  console.log("Brand: "+req.params.brandName+" Size: "+req.params.size);
  database.find({brand:req.params.brandName, size:req.params.size},function(err,shoes) {
    if(err) console.log("Error finding shoes by shoe size:\n"+err);
    else res.json(shoes);
  });
});
// Update shoe stock after selling
app.post("/api/shoes/sold/:shoeId",function(req, res) {
  console.log("Shoe ID: "+req.params.shoeId);
  console.log(req.body);
  var amount = req.body.amount;
  database.findOneAndUpdate({_id:req.params.shoeId},
                            {$inc: {in_stock:-amount}},
                            {new:true},
                            function(err, affected) {
                              if(err) console.log("Error finding and updating shoe by id:\n"+err);
                              else res.json(affected);
                            });
}); // end of post
// Add new shoe to stock
app.post("/api/shoes",function(req, res) {
  var newShoe = new database(req.body);
  newShoe.save(function(err,doc) {
    if(err) console.log("Error saving the new shoe:\n"+err);
    else {
      console.log("New shoe saved succesfully:\n"+newShoe);
      res.json(doc);
    }
  })
})
// Starting the server
var port = process.env.PORT || 3000;
var host = process.env.HOST || "http://localhost";
app.listen(port, function() {
  console.log("Server running at "+host+":"+port+"/");
});
