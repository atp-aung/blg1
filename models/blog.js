const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: String,
  likes: Number,
  author: String,
});

blogSchema.set("toJSON", {
  transform: (dc, rtobj) => {
    rtobj.id = rtobj._id.toString();
    delete rtobj._id;
    delete rtobj.__v;
  },
});

module.exports = mongoose.model("Blog", blogSchema);
