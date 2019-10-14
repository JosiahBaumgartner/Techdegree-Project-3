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
  // Clear old total label
  if ( $activities.children().last().text().includes("Total: $") === true ) {
    $activities.children().last().remove();
  }

  // Adds or subtracts price of course selected and updates global total price variable "totalCost"
  if ( $(event.target).prop("checked") === true){
    totalCost += parseInt($(event.target).data("cost").substring(1));
  } else {
    totalCost -= parseInt($(event.target).data("cost").substring(1));
  }

  // Re-append updated total price label
  $activities.append( "<label>Total: $" + totalCost + "</label>" );

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

function inputCheck(inputElement) {
  const check = inputElement.val() !== ""
  return check;
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

// Blur event handler for Name field
$name.blur( function() {
  emptyInputValidation( $name );
});

// Blur event handler for Email field
$mail.on("blur input", function() {
  emptyInputValidation( $mail );
  // Change event handler for Email field for real time Email validation
  if ( emailRegex.test($mail.val()) === true ) {
    $mail.removeClass("validation-error-input");
     if ( $mail.prev().text().includes('Email must be in this format: "example@site.com"') === true ) {
       $mail.prev().remove();
     }
    // Very long 3 gate conditional that I know is bad :( It checks if the email field value matches Regex and if the "email format" or "field required" messages aren't already there.
  } else if (emailRegex.test($mail.val()) === false && $mail.prev().text().includes('Email must be in this format: "example@site.com"') === false && $mail.prev().text().includes('Field Required') === false) {
    $mail.addClass("validation-error-input");
    $mail.before('<label class="validation-error-message">Email must be in this format: "example@site.com"</label>');
  }
});

// Change event handler for Activities field, conditional to determine if any checkboxes have been checked and displayerror message if none have.
$(".activities input").change( function() {
  const activityChecked = false;
  if ( $(".activities input").eq(0).prop("checked") === true ||
       $(".activities input").eq(1).prop("checked") === true ||
       $(".activities input").eq(2).prop("checked") === true ||
       $(".activities input").eq(3).prop("checked") === true ||
       $(".activities input").eq(4).prop("checked") === true ||
       $(".activities input").eq(5).prop("checked") === true ||
       $(".activities input").eq(6).prop("checked") === true ) {
         activityChecked = true;
      if ( $activities.children().eq(0).first().text().includes("Field Required") === true ) {
        $activities.children().first().remove();
      }
  } else if ( $activities.children().first().text().includes("Field Required") === false ) {
    $activities.prepend("<label class='validation-error-message'>Field Required</label>");
  }
});

  // Blur event handler for Credit Card field
$("#cc-num").on("blur input", function() {
  emptyInputValidation( $("#cc-num") );
  // Change event handler for Credit Card Number field for real time Credit Card Number validation
  if ( ccRegex.test($("#cc-num").val()) === true ) {
    $("#cc-num").removeClass("validation-error-input");
    if ( $("#cc-num").prev().text().includes('Credit card number must be between 13-16 digits long') === true ) {
      $("#cc-num").prev().remove();
    }
    // Very long 3 gate conditional that I know is bad :( It checks if the cc field value matches Regex and if the "cc format" or "field required" messages aren't already there.
  } else if (ccRegex.test($("#cc-num").val()) === false && $("#cc-num").prev().text().includes('Credit card number must be between 13-16 digits long') === false && $("#cc-num").prev().text().includes('Field Required') === false) {
    $("#cc-num").addClass("validation-error-input");
    $("#cc-num").before('<label class="validation-error-message">Credit card number must be between 13-16 digits long</label>');
  }
});

// Blur event handler for ZIP field
$("#zip").blur( function() {
  emptyInputValidation( $("#zip") );
});

// Blur event handler for CVV field
$("#cvv").blur( function() {
  emptyInputValidation( $("#cvv") );
});

function masterValidation() {
    // Event handler for "register" button
  $("form button:contains(Register)").click( function(event) {

    if ( inputCheck($name) === false || inputCheck($mail) === false || activityChecked === false ) {
      event.preventDefault();
      emptyInputValidation( $name );
      emptyInputValidation( $mail );
      //This un-DRY section triggers on button click instead of change
      if ( $(".activities input").eq(0).prop("checked") === true ||
           $(".activities input").eq(1).prop("checked") === true ||
           $(".activities input").eq(2).prop("checked") === true ||
           $(".activities input").eq(3).prop("checked") === true ||
           $(".activities input").eq(4).prop("checked") === true ||
           $(".activities input").eq(5).prop("checked") === true ||
           $(".activities input").eq(6).prop("checked") === true ) {
         if ( $activities.children().first().text().includes("Field Required") === true ) {
           $activities.children().first().remove();
         }
      } else if ( $activities.children().first().text().includes("Field Required") === false ) {
        $activities.prepend("<label class='validation-error-message'>Field Required</label>");
      }
      // Credit card, zipcode and cvv field validation only active if credit card option is selected.
      if ($payment.val() === "Credit Card" && inputCheck($("#cc-num")) === false && inputCheck($("#zip")) === false && inputCheck($("#cvv")) === false) {
        allCCValidation();
      }
    }
    // Super not DRY, dunno how to make this work in a single condition though
    else if ($payment.val() === "Credit Card" && inputCheck($("#cc-num")) === false && inputCheck($("#zip")) === false && inputCheck($("#cvv")) === false) {
      event.preventDefault();
      allCCValidation();
    }
  });
}
masterValidation();
