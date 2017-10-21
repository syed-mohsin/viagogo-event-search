(function() {
  // listener to read input and send to server to be processed
  $('[name=find_tickets]').on('click', function(e) {
    e.preventDefault();

    console.log($('[name=coordinates]').val());
  });
}());
