// grab the stories as a json
$.getJSON('/stories', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#stories').append('<p data-id="' + data[i]._id + '">'+ data[i].title + '<br />'+ data[i].link + '</p>');
  }
});


// whenever someone clicks a p tag
$(document).on('click', 'p', function(){
  // empty the thoughts from the thought section
  $('#thoughts').empty();
  // save the id from the p tag
  var thisId = $(this).attr('data-id');

  // now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/stories/" + thisId,
  })
    // with that done, add the thought information to the page
    .done(function( data ) {
      console.log(data);
      // the title of the article
      $('#thoughts').append('<h2>' + data.title + '</h2>'); 
      // an input to enter a new title
      $('#thoughts').append('<input id="titleinput" name="title" >'); 
      // a textarea to add a new thought body
      $('#thoughts').append('<textarea id="bodyinput" name="body"></textarea>'); 
      // a button to submit a new thought, with the id of the article saved to it
      $('#thoughts').append('<button data-id="' + data._id + '" id="savethought">Save Thought</button>');

      // if there's a thought in the article
      if(data.thought){
        // place the title of the thought in the title input
        $('#titleinput').val(data.thought.title);
        // place the body of the thought in the body textarea
        $('#bodyinput').val(data.thought.body);
      }
    });
});

// when you click the savethought button
$(document).on('click', '#savethought', function(){
  // grab the id associated with the article from the submit button
  var thisId = $(this).attr('data-id');

  // run a POST request to change the thought, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/stories/" + thisId,
    data: {
      title: $('#titleinput').val(), // value taken from title input
      body: $('#bodyinput').val() // value taken from thought textarea
    }
  })
    // with that done
    .done(function( data ) {
      // log the response
      console.log(data);
      // empty the thoughts section
      $('#thoughts').empty();
    });

  // Also, remove the values entered in the input and textarea for thought entry
  $('#titleinput').val("");
  $('#bodyinput').val("");
});
