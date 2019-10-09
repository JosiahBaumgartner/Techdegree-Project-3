const $name = $("#name");
const $title = $("#title");
const $otherTitle = $("#other-title");
const $design = $("#design");
const $color = $("#color");
let totalCost = 0;
const $activities = $(".activities").append( "<label>Total: $" + totalCost + "</label>" );

// Defaults focus onto first input field, name.
$name.focus();

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
  // Remove "Select Theme" option
  if ( $design.children().first().val() === "Select Theme" ) {
  $design.children().first().remove();
  }

  // Only displays colors valid for currently selected theme option
  if ( $design.val() === "js puns" ) {
    // Resets selected color option to first within theme set.
    $color.children().eq(0).prop("selected", true);
    $color.children().each( function(i) {
      if ( $(this).text().includes("Puns") === true ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  } else if ( $design.val() === "heart js" ) {
    // Resets selected color option to first within theme set.
    $color.children().eq(3).prop("selected", true);
    $color.children().each( function(i) {
      if ( $(this).text().includes("♥") === true ) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }
});

// Display total price at the bottom of the activities section.
$activities.change( function(event) {
  // Clear old total label
  if ( $activities.children().last().text().includes("Total: $") === true ) {
    $activities.children().last().remove();
  }

  // Adds or subtracts price of course selected, updating global total price variable "totalCost"
  if ($(event.target).prop("checked") === true){
    totalCost += parseInt($(event.target).data("cost").substring(1));
  } else {
    totalCost -= parseInt($(event.target).data("cost").substring(1));
  }

  // Re-append updated total price label
  $activities.append( "<label>Total: $" + totalCost + "</label>" );
});
