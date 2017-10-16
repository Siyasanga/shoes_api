var compiledBrandOptions = Handlebars.compile(document.querySelector("#brandOptions").innerHTML);
var compiledColorOptions = Handlebars.compile(document.querySelector("#colorOptions").innerHTML);
var stockCompiler = Handlebars.compile(document.querySelector("#shoe-template").innerHTML);
var sizesCompiler = Handlebars.compile(document.querySelector("#availSizes").innerHTML);
$.ajax({
  url: "http://localhost:3000/api/shoes",
  type:"get"
}).done(function(stock) {
  document.querySelector("#brands").innerHTML += compiledBrandOptions({shoeBrand:stock.availBrands});
  document.querySelector("#colors").innerHTML += compiledColorOptions({shoeColor:stock.availColors});
  document.querySelector("#max").min = stock.minPrice; document.querySelector("#min").min = stock.minPrice;
  document.querySelector("#max").max = stock.maxPrice; document.querySelector("#min").max = stock.maxPrice;
  document.querySelector("#min").value = stock.minPrice; document.querySelector("#max").value = stock.maxPrice;
  document.querySelector(".sizeOptions").innerHTML += sizesCompiler({availSizes:stock.sizes});
  document.querySelector(".main").innerHTML += stockCompiler({shoe:stock.shoes});
})
//******************************************************************************
// Capture new stock from the user
function captureNewShoe() {
  var newShoe = {};
  if(validateForm()){
      newShoe.brand = document.querySelector("#brand").value;
      newShoe.color = document.querySelector("#color").value;
      newShoe.size = document.querySelector("#sizes").value;
      sizesObject = {};
      document.querySelector("#sizes").value.split(",").forEach(function(currentSize) {
        size = currentSize.substring(0,currentSize.indexOf(":"));
        sizesObject[size] = Number(currentSize.substring(currentSize.indexOf(":")+1));
      })
      newShoe.size = JSON.stringify(sizesObject);
      newShoe.price = Number(document.querySelector("#price").value);
      console.log(newShoe.price);
      newShoe.shoeImgUrl =  document.querySelector("#image").value;
      // stock.push(newStock(brand,color,cost,sizes,shoeImgUrl));
    console.log(newShoe);
    $.ajax({
      url:"http://localhost:3000/api/shoes",
      type:"post",
      data:newShoe
    }).done(function(result) {
      location.reload(true);
      console.log("hello");
      window.location.reload(false);
    })
  }
}
//*************Validate Form**************************//
// Validating form and returning false is data is not valid
newItem = document.querySelector("#newStock");
function validateForm() {
  flag = true;
  if(document.querySelector("#brand").value == ""){
    document.querySelector("#errBrand").style.display = "block";
    flag = false;
  }
  if(document.querySelector("#color").value == ""){
    document.querySelector("#errColor").style.display = "block";
    flag = false;
  }
  if(document.querySelector("#sizes").value.length == 0){
    document.querySelector("#errSize").style.display = "block";
    flag = false;
  }
  if(document.querySelector("#image").value == ""){
    document.querySelector("#errImage").style.display = "block";
    flag = false;
  }
  if(document.querySelector("#sex").value == ""){
    document.querySelector("#errSex").style.display = "block";
    flag = false;
  }
  return flag;
}
//*****************************************************//
//******************Getting all property types***********************
var activeBrands = [];
var activeColors = [];
var priceRange = [];
var selectedSize = "";
//*********************Filtering Shoes*************************
function filterShoes() {
  if(event.srcElement.classList.contains("brand")) {
    //Capturing selected brands
    if(event.srcElement.checked){
      if(activeBrands.indexOf(event.srcElement.value) == -1)
        activeBrands.push(event.srcElement.value);
    }else {
      activeBrands.splice(activeBrands.indexOf(event.srcElement.value),1);
    }
  } // End capturing selected brands
  else if(event.srcElement.classList.contains("colorFilter")){
    //Capturing selected colors
    if(event.srcElement.checked){
      if(activeColors.indexOf(event.srcElement.value) == -1)
        activeColors.push(event.srcElement.value);
    }else {
      activeColors.splice(activeColors.indexOf(event.srcElement.value),1);
    }
  } // End capturing selected colors
  else {
    if(Number(document.querySelector("#min").value) <= Number(document.querySelector("#max").value)){
      priceRange[0] = document.querySelector("#min").value;
      priceRange[1] = document.querySelector("#max").value;
    }
  } // End capturing price range

  selectedSize = document.querySelector(".sizeOptions").value;
  queryString = "["+JSON.stringify(activeBrands)+","+JSON.stringify(activeColors)+","+JSON.stringify(priceRange)+",\""+selectedSize+"\"]";
  console.log(queryString);
  $.ajax({
    url:"http://localhost:3000/api/filterShoes/"+queryString,
    type:"get"
  }).done(function(shoes) {
    console.log(shoes);
      document.querySelector(".main").innerHTML = stockCompiler({shoe:shoes});
  });
  // filtered = [];
  // if(brand.length !== 0){
  //   activeBrands.push(brand);
  // }
  // for(var i=0; i<stock.length; i++){
  //   for(var j=0; j<activeBrands.length; j++){
  //     if(stock[i].brand == activeBrands[j]){
  //       filtered.push(stock[i]);
  //     }
  //   }
  // }
  // if(activeBrands.length==0){
  //   filtered = stock;
  // }
  // document.querySelector(".main").innerHTML = compShoe({shoe:filtered});
  // pullColors("");
  // return filtered;
}
//*************************Filtering By Colors*******************************
// function pullColors(color) {
//   results = [];
//   if(color.length !== 0){
//     activeColors.push(color);
//   }
//   var focus = filtered;
//   if(filtered.length ==0){
//     focus = stock;
//   }
//   if(activeColors.length !== 0)
//   for(var i=0; i<focus.length; i++){
//     for(var j=0; j<activeColors.length; j++){
//       if(focus[i].color == activeColors[j]){
//         results.push(focus[i]);
//       }
//     }
//   }
//   else {
//     results = filtered;
//   }
//   document.querySelector(".main").innerHTML = compShoe({shoe:results});
//   return results;
// }
//**************************Removing a Filter******************************
// function remove(value,source) {
//   source.splice(source.indexOf(value),1);
//   return source;
// }
// function priceFilter() {
//   results = [];
//   if(document.querySelector("#min").value > document.querySelector("#max").value){
//     console.log(document.querySelector("#min").value);
//     extra = document.querySelector("#max").value;
//     document.querySelector("#max").value = document.querySelector("#min").value;
//     document.querySelector("#min").value = extra;
//   }
//   var focus = pullColors("");
//   for(var i=0; i<focus.length; i++){
//     if(1000 >= min.value && 1000 <= max.value){
//       console.log("Hello");
//       results.push(focus[i]);
//     }
//   }
//   document.querySelector(".main").innerHTML = compShoe({shoe:results});
//   return results;
// }
//***************Getting the Min-price***************************
// function getMin() {
//   var min = stock[0].price;
//   for(var i=0; i<stock.length; i++){
//     if(stock[i].price < min){
//       min = stock[i].price;
//     }
//   }
//   return min;
// }
//***************Getting the Max-price***************************
// function getMax() {
//   var max = stock[0].price;
//   for(var i=0; i<stock.length; i++){
//     if(stock[i].price > max){
//       max = stock[i].price;
//     }
//   }
//   return max;
// }
// document.querySelector("#min").value = getMin();
// document.querySelector("#max").value = getMax();
//*********************Compiling shoe template***************************
// database.shoes.find({},function(err, shoes) {
//   if(err) console.log("Encountered an error while trying to find all shoes from database:\n"+err);
//   else {
//     var shoeScript = document.querySelector("#shoe-template").innerHTML;
//     var compShoe = Handlebars.compile(shoeScript);
//     var result = compShoe({shoe:shoes});
//     document.querySelector(".main").innerHTML+=result;
//   }
// });
//*******************Compiling shoe brands menu*************************
// getOptions("brand",function(result) {
//   var menuscript = document.querySelector("#brandOptions").innerHTML;
//   var compMenu = Handlebars.compile(menuscript);
//   var menuItem = compMenu({shoeBrand:result});
//   document.querySelector(".brands").innerHTML+=menuItem;
// });
// //*******************Compiling shoe colors menu*************************
// getOptions("color",function(colors) {
//   var colorscript = document.querySelector("#colorOptions").innerHTML;
//   var compColor = Handlebars.compile(colorscript);
//   var colorResult = compColor({shoeColor:colors});
//   document.querySelector(".colors").innerHTML += colorResult;
// });
// //********************Making Brand checkboxes work*********************
// var brandDiv = document.querySelector(".brands");
// brandDiv.addEventListener('click',function () {
//   if(event.srcElement.classList.value == "check") {
//     var status = event.srcElement.checked;
//     if(status){
//         pullBrands(event.srcElement.nextElementSibling.innerHTML);
//     }
//     else {
//       console.log("Deselect");
//       remove(event.srcElement.nextElementSibling.innerHTML,activeBrands);
//       pullBrands("");
//     }
//   }
// },false);
//********************Making color checkboxes work*********************
// var colorDiv = document.querySelector(".colors");
// colorDiv.addEventListener('click',function () {
//   if(event.srcElement.classList.value == "check") {
//     var status = event.srcElement.checked;
//     if(status){
//         pullColors(event.srcElement.nextElementSibling.innerHTML);
//     }
//     else {
//       console.log("Deselect");
//       remove(event.srcElement.nextElementSibling.innerHTML,activeColors);
//       pullColors("");
//     }
//   }
// },false);
// var min = document.querySelector("#min");
// var max = document.querySelector("#max");
// min.addEventListener("change",function() {
//   priceFilter();
// },false);
// var submit = document.querySelector("#submit");
// submit.addEventListener("click",function() {
//   var copy;
//   if(validateForm()){
//     createStock();
//   }
// });
