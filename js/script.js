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


// Conditional that checks if an input is empty and turns it red if it is or sets it back to default if it isn't
function emptyInputCheck(inputElement) {
    if (inputElement.val() !== "") {
      inputElement.removeClass("validation-error-input");
    } else {
      inputElement.addClass("validation-error-input");
    }
}

// Blur event handler for name field validation
$name.blur( function() {
  emptyInputCheck( $name );
});

// Defaults focus onto first input field, name.
$name.focus();

// Blur event handler for email field validation
$mail.blur( function() {
  emptyInputCheck( $mail );
});

// Hides text field to type other job titles unless "other" option is selected.
$otherTitle.hide();

$title.change( function() {
  if ( $title.val() === "other" ) {
    $otherTitle.show();
  } else {
    $otherTitle.hide();
  }
});

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
    // Code Credit card validation error messages here@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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

// Checks for empty credit card number field
$("#cc-num").blur( function() {
  emptyInputCheck( $("#cc-num") );
});

// Checks for empty ZIP code field
$("#zip").blur( function() {
  emptyInputCheck( $("#zip") );
});

// Checks for empty CVV field
$("#cvv").blur( function() {
  emptyInputCheck( $("#cvv") );
});
