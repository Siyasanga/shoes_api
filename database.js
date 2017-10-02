var mongoose = require('mongoose');
var mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/shoesdb";
mongoose.connect(mongoURL, function(err) {
  if(err) console.log("Error connecting to the database:\n"+err);
  else console.log("Database connection established!");
});
var shoeModel = mongoose.model("shoe",{
  id : Number,
  color : String,
  brand : String,
  price : Number,
  size : Number,
  in_stock : Number
});
module.exports = shoeModel;
