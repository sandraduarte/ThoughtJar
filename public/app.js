// Display article's comments when it is clicked
$(document).on('click', '.article', function(event) {
    // remove 'selected' class from other articles
    removeSelected();
    // apply 'selected' class to highlight article
    $(this).addClass("selected");

    // clear any comment from other articles
    $("#comments").empty();

    // pull the comments for the selected article from the database
    var articleId = $(this).attr("data-id");
    $("#commentSubmit").attr("data-article", articleId);
    $.get("/articles/" + articleId + "/comments", function(comments) {

        // once received, append those comments to the DOM
        for (var i = 0; i < comments.length; i++) {
          // div for all comment related info
            var div = $("<div>");
            div.addClass("comment");
            div.attr("data-user", comments[i].author);

            // the text of the comment
            var commentText = $("<p>");
            commentText.text(comments[i].text);

            // username of commenter
            var commentUser = $("<a>");
            commentUser.attr("href", "/users/" + comments[i].author);
            commentUser.text(comments[i].author);

            // append elements to the div
            div.append(commentText);
            div.append(commentUser);

            // append the div to the comments page
            $("#comments").append(div);
        }
    });
    return false;
});

// Make links clickable inside article div
$('div a').on('click', function(e){
    e.stopPropagation();
});

// When a user submits a comment
$("#commentSubmit").on('click',function() {
    var comment = {};
    // get the article ID
    var articleId = $(this).attr("data-article");
    
    // get the comment text
    comment.text = $("#commentText").val().trim();
    // connect the comment to the article in the database
    comment.article = articleId;

    // make sure the user isn't somehow submitting a comment without an article selected
    if (comment.article == "none") {
        console.log("not commenting on an article!");
    } else {
        // add the comment to the database via post request
        $.post("/articles/" + articleId, comment);
    }
});

//when a user clicks on a comment
$(document).on('click', '.comment', function(event) {
    // remove 'selected' class from other articles
    removeSelected();
    // apply 'selected' class to highlight article
    $(this).addClass("selected");

});

function removeSelected() {
    $(".selected").each(function(i) {
        $(this).removeClass("selected");
    });

   
}