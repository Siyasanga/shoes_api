var mongoose = require('mongoose');
var mongoURL = process.env.MONGO_DB_URL || "mongodb://admin:1234@ds229835.mlab.com:29835/shoesdb";
mongoose.connect(mongoURL, function(err) {
  if(err) console.log("Error connecting to the database:\n"+err);
  else console.log("Database connection established!");
});
var shoeModel = mongoose.model("shoe",{
  color : String,
  brand : String,
  price : Number,
  size : String,
  shoeImgUrl : String
});
module.exports = shoeModel;
