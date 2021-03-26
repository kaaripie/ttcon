var source = $.getJSON( "/copy.json", function() {
    console.log( "getJSON success" );
  })
    .done(function(data) {
      console.log( "done" );
      console.log( data.name );
    })
    .fail(function() {
      alert ( "error" );
    })
    .always(function() {
      console.log( "complete" );
    });