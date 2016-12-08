// require mongoose
var mongoose = require('mongoose');
// create a schema class
var Schema = mongoose.Schema;

// create the Thought schema
var ThoughtSchema = new Schema({
  // just a string
  title: {
    type:String
  },
  // just a string
  body: {
    type:String
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the Thoughts.
// These ids are referred to in the Story model.

// create the Thought model with the ThoughtSchema
var Thought = mongoose.model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;
