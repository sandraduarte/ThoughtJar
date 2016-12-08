// require mongoose
var mongoose = require('mongoose');
// create Schema class
var Schema = mongoose.Schema;

// Create Story schema
var StorySchema = new Schema({
  // title is required
  title: {
    type:String,
    required:true
  },
  // link is required
  link: {
    type:String,
    required:true
  },
  // this only saves one note's ObjectId. ref refers to the Note model.
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Thought'
  }
});

// Create the Story model with the StorySchema
var Story = mongoose.model('Story', StorySchema);

// export the model
module.exports = Story;
