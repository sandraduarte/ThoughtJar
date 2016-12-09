// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Comment schema
var CommentSchema = new Schema({
  // just a string
  author: {
    type: String,
    required: true,
  },
    authorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },

  // just a string
  text: {
    type:String
  },
  article: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Article"
  },

});

// Remember, Mongoose will automatically save the ObjectIds of the Comments.
// These ids are referred to in the Article model.

// create the Comment model with the CommentSchema
var Comment = mongoose.model('Comment', CommentSchema);

// export the Comment model
module.exports = Comment;
