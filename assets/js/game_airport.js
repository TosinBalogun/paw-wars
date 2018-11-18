$( document ).ready(function() {

  $('#transport-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);
    // setting all the values from the button
    var id = button.data('id');
    var name = button.data('name');
    var city = button.data('city');
    var price = button.data('price');
    var flightNumber = button.data('flight-number');
    var flightTime = button.data('flight-time');
    var turnPlural = flightTime === "1" ? "turn" : "turns";
    // get the modal object
    var modal = $(this)
    // start populating it with values
    modal.find('#transport-title').text("Fly to " + city);
    var confirmButton = $('#transport-confirm-book-btn');
    // start populating the button with data
    confirmButton.data('id', id);
    confirmButton.data('price', price);
    $('#transport-confirm-destination').html(name);
    $('#transport-confirm-turns').html(flightTime + " " + turnPlural);
    $('#transport-confirm-price').html(price);
  });

  $('#transport-confirm-book-btn').on('click', function(e){
    var flight = {
      id: $(e.target).data('life-id'),
      destination: $(e.target).data('id')
    };
    $.ajax({
      type: 'POST', // Use POST with X-HTTP-Method-Override or a straight PUT if appropriate.
      dataType: 'json', // Set datatype - affects Accept header
      url: "/game/airport/fly", // A valid URL
      data: flight
    }).done(function(result) {
      if (result.error === true){
        throw new Error(result.message);
      }
      // this should redirect
      window.location.replace("/game/hotel");
    }).fail(function(result) {
      displayAlert("danger", result.responseJSON.message);
      $('#transport-modal').modal('hide');
    });

  });
});
