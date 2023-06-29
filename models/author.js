const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const authorSchema = new mongoose.Schema({
  authorname: { type: String, minLength: 3, required: true },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
    },
  ],
});
authorSchema.plugin(uniqueValidator);
authorSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;
