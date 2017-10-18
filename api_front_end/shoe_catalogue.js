var compiledBrandOptions = Handlebars.compile(document.querySelector("#brandOptions").innerHTML);
var compiledColorOptions = Handlebars.compile(document.querySelector("#colorOptions").innerHTML);
var stockCompiler = Handlebars.compile(document.querySelector("#shoe-template").innerHTML);
var sizesCompiler = Handlebars.compile(document.querySelector("#availSizes").innerHTML);
var singleShoe = Handlebars.compile(document.querySelector("#singleView").innerHTML);

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
  document.querySelector(".main_space").innerHTML += stockCompiler({shoe:stock.shoes});
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
      document.querySelector(".main_space").innerHTML = stockCompiler({shoe:shoes});
  });
}
//****************************************************************************
var shoeInFocus = {};
function buyShoe(shoeId){
  console.log(shoeId);
  toggleDisplay("#singleShoe");
  $.ajax({
    url:"http://localhost:3000/api/shoesId/"+shoeId,
    type:"get"
  }).done(function(shoe) {
    var sizes = JSON.parse(shoe.size);
    shoeInFocus.sizes = sizes;
    shoeInFocus.shoe = shoe;
    availSizes = Object.keys(sizes);
    in_stock = sizes[availSizes[0]];
    document.querySelector("#shoe").innerHTML = singleShoe({shoe, availSizes, in_stock, totalPrice:shoe.price});
  });
}
//***************************************************************************
function pairs4size() {
  console.log(event.srcElement.value);
  document.querySelector("#in_stock").innerHTML = shoeInFocus.sizes[event.srcElement.value];
  document.querySelector("#stock_limit").max = shoeInFocus.sizes[event.srcElement.value];
}
function calcTotPrice(){
  if(Number(document.querySelector("#stock_limit").max) >= Number(event.srcElement.value)){
    console.log(shoeInFocus.shoe.price*event.srcElement.value);
    document.querySelector("#totalPrice").innerHTML = shoeInFocus.shoe.price*event.srcElement.value;
  }
}
function updateStock() {
  console.log(shoeInFocus.sizes);
  shoeInFocus.sizes[document.querySelector("#sizeOptions").value] -= Number(document.querySelector("#stock_limit").value);
  console.log(shoeInFocus.sizes);
  console.log(event.srcElement.value);
  $.ajax({
    url: "http://localhost:3000/api/shoes/sold/"+event.srcElement.value,
    type: "post",
    data: shoeInFocus.sizes
  }).done(function(updatedShoe) {
    console.log(updatedShoe);
    window.location.reload();
    console.log(updatedShoe);
  })

}
//***************************************************************************
  function toggleDisplay(id) {
    console.log(document.querySelector(id));
  if(document.querySelector(id).style.display == "none"){
    document.querySelector(id).style.display = "block";
  }else {
    document.querySelector(id).style.display = "none";
  }
}
toggleDisplay("#newStock");
toggleDisplay("#singleShoe");
