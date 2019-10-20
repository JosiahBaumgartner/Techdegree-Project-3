const $name = $("#name");
const $mail = $("#mail");
const $title = $("#title");
const $otherTitle = $("#other-title");
const $design = $("#design");
const $color = $("#color");
const $payment = $("#payment");
// Display total price at the bottom of the activities section
let totalCost = 0;
const $activities = $(".activities").append( "<label>Total: $" + totalCost + "</label>" );
// Email Regex from https://www.emailregex.com
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// Credit Card 13-16 digit regex from https://www.regular-expressions.info/creditcard.html
const ccRegex = /\b\d{13,16}\b/;
const zipRegex = /^\d{5}$/;
const cvvRegex = /^[0-9]{3,4}$/;

/* NAME */

// Defaults focus onto first input field, name.
$name.focus();

/* JOB ROLE */

// Hides text field to type other job titles unless "other" option is selected.
$otherTitle.hide();

$title.change( function() {
  if ( $title.val() === "other" ) {
    $otherTitle.show();
  } else {
    $otherTitle.hide();
  }
});

/* T-SHIRT */

// Hides select field to select shirt color unless a design option is selected.
$color.parent().hide();

// Upon change of theme selector
$design.change( function() {
  // Display color selection
  $color.parent().show();
  // Remove "Select Theme" option from theme drop down menu.
  $("#design option:contains(Select Theme)").remove();

  // Only displays colors valid for pun theme option while selected
  if($('#design').val() === 'js puns'){
    $("#color option").hide();
    $("#color option:contains(JS Puns shirt only)").show();
    // Resets selected color option to first within theme set
    $("#color option").eq(0).prop('selected', true);
  }
     // Only displays colors valid for heart theme option while selected
  else if ($('#design').val() === 'heart js'){
    $("#color option").hide();
    $("#color option:contains(JS shirt only)").show();
    // Resets selected color option to first within theme set
    $("#color option").eq(3).prop('selected', true);
     }
   });

   /* ACTIVITIES */

// Activites section change event handler
$activities.change( function(event) {

  // Adds or subtracts price of course selected and updates global total price variable "totalCost"
  if ( $(event.target).prop("checked")){
    totalCost += parseInt($(event.target).data("cost").substring(1));
  } else {
    totalCost -= parseInt($(event.target).data("cost").substring(1));
  }
  // Updates total cost label to current value
  $activities.children().last().text("Total: $" + totalCost)

  // Disables conflicting activities when an activity is selected
  $(".activities input").each( function() {
    if ( $(event.target).data("day-and-time") === $(this).data("day-and-time") && event.target !== this ){
      if ($(event.target).prop("checked") === true) {
        $(this).prop("disabled", true);
        $(this).parent().addClass("disabled-checkbox-label");
      }
      // Re-enables checkboxes once conflicting box is unchecked
      else {
        $(this).prop("disabled", false);
        $(this).parent().removeClass("disabled-checkbox-label");
      }
    }
  });
});

/* PAYMENT */

// Removes Select Payment Method option from payment drop down menu.
$("#payment option:contains(Select Payment Method)").remove();

// Hides all payment method divs then unhides the one with specified id
function showPaymentMethod( id ) {
  $payment.parent().children("div").hide();
  $(id).show();
}

// Defaults Payment select to Credit Card, hides other payment type messages
$("#payment option").eq(0).prop('selected', true);
showPaymentMethod("#credit-card");

$payment.change( function(event) {
  // Displays Credit Card form if select option = Credit Card, hides rest
  if ( $payment.val() === "Credit Card" ){
    showPaymentMethod("#credit-card");
  }
  // Displays Paypal message if select option = PayPal, hides rest
  else if ( $payment.val() === "PayPal" ) {
    showPaymentMethod("#paypal");
  }
  // Displays bitcoin message if select option = Bitcoin, hides rest
  else if ( $payment.val() === "Bitcoin" ) {
    showPaymentMethod("#bitcoin");
  }
});

/*

          *** VALIDATION ***

*/

// Checks if an input is empty
function inputCheck(inputElement) {
  const check = inputElement.val() !== ""
  return check;
}

// Checks if any checkboxes within child elements are checked.
function checkboxValidation(checkboxParent) {
  if ( checkboxParent.find("input").filter(":checkbox:checked").length ) {
      if ( checkboxParent.children().eq(0).first().text().includes("Field Required") === true ) {
        checkboxParent.children().first().remove();
      }
  } else if ( checkboxParent.children().first().text().includes("Field Required") === false ) {
    checkboxParent.prepend("<label class='validation-error-message'>Field Required</label>");
  }
}

// Conditional that checks if an input is empty and turns it red if it is or sets it back to default if it isn't
function emptyInputValidation(inputElement) {
    if (inputElement.val() !== "") {
      inputElement.removeClass("validation-error-input");
       if ( inputElement.prev().text().includes("Field Required") === true ) {
         inputElement.prev().remove();
       }
    } else if ( inputElement.prev().text().includes("Field Required") === false ) {
      inputElement.addClass("validation-error-input");
      inputElement.before("<label class='validation-error-message'>Field Required</label>");
    }
}

function allCCValidation() {
  emptyInputValidation( $("#cc-num") );
  emptyInputValidation( $("#zip") );
  emptyInputValidation( $("#cvv") );
}

// Tests an element's value against a regex and displays error message and highlights red if false. Removes error message and error class on true.
function formatValidation(element, regex, message) {
  if ( regex.test($(element).val()) === true ) {
    $(element).removeClass("validation-error-input");
    if ( $(element).prev().text().includes(message) === true ) {
      $(element).prev().remove();
    }
    // Checks if the field value matches Regex and if the format or "field required" messages aren't already there.
  } else if (regex.test($(element).val()) === false && $(element).prev().text().includes(message) === false && $(element).prev().text().includes('Field Required') === false) {
    $(element).addClass("validation-error-input");
    $(element).before('<label class="validation-error-message"></label>');
    $(element).prev().text(message);
  }
}

// Blur event handler for Name field
$name.blur( function() {
  emptyInputValidation( $name );
});

// Blur event handler for Email field
$mail.on("blur input", function() {
  emptyInputValidation( $mail );
  // Change event handler for Email field for real time Email validation
  formatValidation($mail, emailRegex,'Email must be in this format: "example@site.com"');
});

// Change event handler for Activities field, conditional to determine if any checkboxes have been checked and displayerror message if none have.
$(".activities input").change( function() {
  checkboxValidation($activities)
});

// Blur event handler for Credit Card field
$("#cc-num").on("blur input", function() {
  emptyInputValidation( $("#cc-num") );
  // Real time Credit Card Number regex validation
  formatValidation("#cc-num", ccRegex, "Credit card number must be between 13-16 digits long");
});

// Blur event handler for ZIP field
$("#zip").on("blur input", function() {
  emptyInputValidation( $("#zip") );
  // Real time Zip Code regex validation
  formatValidation("#zip", zipRegex, "Zip Code should be 5 digits long");
});

// Blur event handler for CVV field
$("#cvv").on("blur input", function() {
  emptyInputValidation( $("#cvv") );
  // Real time CVV regex validation
  formatValidation("#cvv", cvvRegex, "CVV should be 3 or 4 digits long");
});

// Event handler for "register" button instead of change/input/blur for real time validation as before
$("form button:contains(Register)").click( function(event) {

  if ( (inputCheck($name) === false || inputCheck($mail) === false || $(".activities input:checkbox:checked").length <= 0) ||
    // Credit card, zipcode and cvv field validation only active if credit card option is selected.
    ($payment.val() === "Credit Card" &&
    (inputCheck($("#cc-num")) === false || ccRegex.test($("#cc-num").val()) === false
    || inputCheck($("#zip")) === false || zipRegex.test($("#zip").val()) === false
    || inputCheck($("#cvv")) === false || cvvRegex.test($("#cvv").val()) === false )) ) {
    event.preventDefault();
    emptyInputValidation( $name );
    emptyInputValidation( $mail );
    checkboxValidation($activities);
    allCCValidation();
  }
});
