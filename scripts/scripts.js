//information fetched from products.json stored in these arrays
var productIDArray = [];
var productNameArray = [];
var beanTypeArray = [];
var originArray = [];
var priceArray = [];
var imageLinkArray = [];
var propertiesArray = [];
var descriptionArray = [];
var hintsArray=[];
var grindTypesArray=[];

//HTML for bootstrap cards on Products page
var cardsContent = 
`<div class="card">
    <img src="" class="card-img-top" alt="">
    <div class="card-body">
    <h5 class="card-title"></h5>
    <h6 class="card-subtitle mb-2 text-muted"></h6>
    <p class="card-text"></p>
</div>`;

//HTML for Bootstrap quiz card on products page
var quizCardContent = 
`<div class="card text-center" style="width: 18rem;">
  <img src="" class="card-img-top" alt="">
  <div class="card-body">
    <h5 class="card-title"></h5>
    <p class="card-text"></p>
    <p class="card-text"></p>
    <p class="card-text"></p>
    <input type="text" id="user-guess"/>
    <a href="#" id="check-answer" class="btn btn-primary">Guess</a>
  </div>
</div>`;

$(document).ready(function () {
  //get products info when loading each page
  $.getJSON("products.json", function (data) {
    $.each(data, function (index, value) {
      productIDArray.push(value.productID);
      productNameArray.push(value.productName);
      beanTypeArray.push(value.beanType);
      originArray.push(value.origin);
      priceArray.push(value.price);
      imageLinkArray.push(value.imageLink);
      propertiesArray.push(value.properties);
      descriptionArray.push(value.description);
      hintsArray.push(value.hints);
      grindTypesArray.push(value.grindTypes);
    });
  });

  //Heber almost had a heart attack to make this work
  //also known as importing navbar
  $("#main-navigation").load("navigation.html");
  setTimeout(() => {
    // Get the current page
    var currentUrl = window.location.pathname;
    // Remove the current/active class from the nav
    $("#navigation-list .nav-link").removeClass("active");
    // Loop through each nav link and add the active class if its href matches the current URL
    $("#navigation-list .nav-link").each(function () {
      if ($(this).attr("href") === currentUrl) {
        $(this).addClass("active");
      }
    });
  }, "50");
  loadElements();
});

/*footer*/
$(function () {
  $("#block-footer").load("footer.html");
});
/* JS function to trigger to toggle an event, in this case a button if we wanted to*/
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

//onLoad function. Staying for now but can just externalise it and use defer later.
function loadElements() {
  var username;
  //check if username is already in localStorage, otherwise prompt for username
  if (localStorage.getItem("username") == null) {
    var nameSelection = confirm(
      "We would love to personalise your experience here just like we personalise your coffee! Would you like to give us your name?"
    );
    //set username if there is an input, otherwise use default "Coffee Lover"
    if (nameSelection == true) {
      username = prompt("Please enter your name");
    } else {
      username = "Coffee Lover";
    }

    localStorage.setItem("username", username);
  } else {
    username = localStorage.getItem("username");
  }

  //populate username into relevant fields within the page
  if (document.getElementById("username") != null) {
    document.getElementById("username").innerHTML = username;
  } else {
    //pass
  }

  //hide products on the products page
  if (document.getElementById("product-div") != null) {
    hideProducts();
  } else {
    //pass
  }
}

//load external header
$(function () {
  $("#page-header").load("header.html");
});

//validate form input. This wants attention in fairness
function formValidate() {
  var lettersAndDash = /^[A-Za-z-]+$/;
  var numbers = /^[0-9]+$/;
  var lettersAndNumbers = /^[0-9A-Za-z]+$/;

  if (document.getElementById("order-form").checkValidity()) {
    if (
      document.getElementById("first-name").value.match(lettersAndDash) &&
      document.getElementById("last-name").value.match(lettersAndDash)
    ) {
      if (document.getElementById("eircode").value.match(/^[0-9A-Za-z]{7}/)) {
        alert("Form submitted")
      } else {
        alert(
          "Incorrect eircode format. Please enter full 7-digit eircode without spaces"
        );
      }
    } else {
      alert(
        "Please provide your first and last name. If you do happen to have numbers in your name, contact us."
      );
    }
  } else {
    //HTML form errors first
  }
}

//Function on the brewing page
function letsGo() {
  //add available grind types to drop-down menu
  var grindSelection = Math.floor(Math.random() * (grindTypesArray.length) + 1);

  for(i=0;i<grindTypesArray[grindSelection-1].length;i++){
    const option = document.createElement("option");
    option.value=grindTypesArray[grindSelection-1][i];
    option.innerHTML=grindTypesArray[grindSelection-1][i];
    document.getElementById("grind-beans").add(option);
  }
  
  //roll a random product, display name and type of bean
  var beanSelection = Math.floor(Math.random() * (beanTypeArray.length) + 1);
  document.getElementById("bean-types").innerHTML = 
    productNameArray[beanSelection] + "\r\n" + beanTypeArray[beanSelection];
}

//hide products function for products page
function hideProducts() {
  document.getElementById("product-div").style.display = "none";
}

//show products function for products page; calls separate addCardContent function
function showProducts() {
  var buttonText = document.getElementById("show-products-button").innerHTML;

  var showMessage = "Just show me the products";
  var hideMessage = "Hide";

  if (buttonText == hideMessage) {
    hideProducts();
    document.getElementById("show-products-button").innerHTML = showMessage;
    buttonText = showMessage;
  } else {
    document.getElementById("product-div").style.display = "block";
    document.getElementById("show-products-button").innerHTML = hideMessage;
    buttonText = hideMessage;
  }
  addCardContent();
}

//show products function for quiz part of products page, calls separate fillQuizCard function
function takeFlight() {
  if(document.getElementById("card-group").innerHTML=="" && document.getElementById("journey-div").innerHTML==""){
    document.getElementById("product-div").style.display = "block";
    fillQuizCard();
  }
  else{
    document.getElementById("card-group").innerHTML="";
    document.getElementById("journey-div").innerHTML="";
    document.getElementById("product-div").style.display = "block";
    fillQuizCard();
  }
}

//For quiz game on products page
function fillQuizCard(){

  //set up card 
  document.getElementById("journey-div").innerHTML=quizCardContent;
  document.getElementsByClassName("card-title")[0].innerHTML="Guess the country";
  var image = document.getElementsByClassName("card-img-top")[0];
    
  //roll random number to select random product from products.json
  var randomSelection = Math.floor(Math.random() * (imageLinkArray.length)+ 1);
  console.log(randomSelection)

  //add image of randomly selected product
  image.src=imageLinkArray[randomSelection-1];

  //add hints[][] for randomly selected product
  for(i=0;i<hintsArray[randomSelection-1].length;i++){
      document.getElementsByClassName("card-text")[i].innerHTML=hintsArray[randomSelection-1][i];
  }

  //check user answer on click
  document.getElementById("check-answer").addEventListener("click",function(){
  
    //check if user guess is correct
    if(document.getElementById("user-guess").value==originArray[(randomSelection-1)]){
      alert("You guessed it!")

      //play again prompt
      var again = confirm("Play again?");
      
      if(again){
        fillQuizCard();
      }
        
      else{
        alert("Thanks for playing!")
      }
    }

    //incorrect user guess
    else{
      alert("Bad luck. It was "+originArray[randomSelection-1])
      
      //play again prompt
      var again = confirm("Play again?");
      
      if(again){
        fillQuizCard();
      }
      else{
        alert("Thanks for playing!")
      }
    }
  });
}

//addCardContent to populate product cards when user opts to show all products
function addCardContent(){

  //check if page content is empty
  if(document.getElementById("card-group").innerHTML==""&&document.getElementById("journey-div").innerHTML==""){
    
    //add & populate card for each product in products.json
    for(i=0;i<imageLinkArray.length;i++){
      document.getElementById("card-group").innerHTML+=cardsContent;
      
      //add image
      var image = document.getElementsByClassName("card-img-top")[i];
      image.src=imageLinkArray[i];
      image.alt=imageLinkArray[i];
      //product name
      document.getElementsByClassName("card-title")[i].innerHTML=productNameArray[i];
      //origin
      document.getElementsByClassName("card-subtitle mb-2 text-muted")[i].innerHTML=originArray[i];
      //product description
      document.getElementsByClassName("card-text")[i].innerHTML=descriptionArray[i];
    }
  }
  else{
    //if page content not empty, set it to empty
    document.getElementById("card-group").innerHTML="";
    document.getElementById("journey-div").innerHTML="";

    //add & populate card for each product in products.json
    for(i=0;i<imageLinkArray.length;i++){
      document.getElementById("card-group").innerHTML+=cardsContent;
      //product image
      var image = document.getElementsByClassName("card-img-top")[i];
      image.src=imageLinkArray[i];
      image.alt=imageLinkArray[i];
      //product name
      document.getElementsByClassName("card-title")[i].innerHTML=productNameArray[i];
      //origin
      document.getElementsByClassName("card-subtitle mb-2 text-muted")[i].innerHTML=originArray[i];
      //product description
      document.getElementsByClassName("card-text")[i].innerHTML=descriptionArray[i];
    }
  } 
}
/* Form validation for contact page */
document.addEventListener('DOMContentLoaded', function() {
  // Find the form by its id
  var form = document.getElementById('contact-form');

  // Add an event listener for the form submission
  form.addEventListener('submit', function(event) {
      // Prevent the default form submission
      event.preventDefault();

      // Display a message for successful form submission
      alert("Thank you! We will contact you as soon as possible.");
  });
});

/* Form validation for feedback */
document.addEventListener('DOMContentLoaded', function() {
  // Find the form by its id
  var form = document.getElementById('feedbackForm');

  // Add an event listener for the form submission
  form.addEventListener('submit', function(event) {
      // Prevent the default form submission
      event.preventDefault();

      // Display a message for successful form submission
      alert("Thank you for your review!");
  });
});

// Function to change the image when clicked
function changeImage() {
  // Get the image element by its ID
  var image = document.getElementById("homepageImg");
  
  /*if there is coffeeframe1.jpg on the screen, when pressed it will change to picture 2*/
  if (image.src.endsWith("images/coffeeframe1.jpg")) {
      image.src = "images/coffeeespresso1.jpg";
  } else {
      image.src = "images/filtercoffee1.jpg";
  }
}