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
var stock = {}; // This is where all the stock will be stored
setStock();
// This function iterates stock to return kinds of a property
function getOptions(property, stock) {
  var result = [];
  for(var i=0; i<stock.length; i++){
    if(result.indexOf(stock[i][property])==-1){
      result.push(stock[i][property]);
    }
  } // end of loop
  return result;
} // End of getOptions()
function setStock(cb){
  database.find({},null,{sort:{price:1}},function(err, shoes) {
    if(err){
      console.log("Error finding the shoes from the database:\n"+err);
      return;
    }
    else if(shoes){
      if(shoes.length > 0){
        stock.availBrands = getOptions("brand",shoes);
        stock.availColors = getOptions("color",shoes);
        stock.minPrice = shoes[0].price;
        stock.maxPrice = shoes[shoes.length-1].price;
        stock.shoes = shoes;
      }
      if(typeof(cb) == "function") cb(stock); // Passing shoes to the callback
    }
  });
}
// GET all the shoe stock
app.get("/api/shoes",function(req, res) {
  setStock(function(stock) {
  res.json(stock);
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
app.get("/api/filterShoes/:queryString",function(req, res) {
  // expecting queryString to be like: [["Bronx","Gucci","Converse"],["Black","Blue","Pink"],[0,350]];
  console.log(req.params.queryString);
  var filteringOptions =  JSON.parse(req.params.queryString);
  console.log(filteringOptions[0]);
  selectedBrands = stock.availBrands;
  if(filteringOptions[0].length !== 0) selectedBrands = filteringOptions[0];
  selectedColors = stock.availColors;
  if(filteringOptions[1].length !== 0) selectedColors = filteringOptions[1];
  priceRange = {"$gt":stock.minPrice-1, "$lt":stock.maxPrice+1};
  if(filteringOptions[2].length !== 0){
    priceRange.$gt = filteringOptions[2][0];
    priceRange.$lt = filteringOptions[2][1];
  }
  database.find({brand:{$in:selectedBrands}, color:{$in:selectedColors}, price:priceRange},function(err,shoes) {
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
                              else res.redirect("/api/shoes");
                            });
}); // end of post
// Add new shoe to stock
app.post("/api/shoes",function(req, res) {
  var newShoe = new database(req.body);
  newShoe.save(function(err,doc) {
    if(err) console.log("Error saving the new shoe:\n"+err);
    else {
      console.log("New shoe saved succesfully:\n"+newShoe);
      res.redirect("/api/shoes");
    }
  })
});
// Starting the server
var port = process.env.PORT || 3000;
var host = process.env.HOST || "http://localhost";
app.listen(port, function() {
  console.log("Server running at "+host+":"+port+"/");
});
