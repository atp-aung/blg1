const bcrypt = require("bcrypt");
const authorsRouter = require("express").Router();
const Author = require("../models/author");

authorsRouter.get("/", async (request, response) => {
  const authors = await Author.find({}).populate("blogs", {
    title: 1,
    url: 1,
    likes: 1,
  });
  response.json(authors);
});

authorsRouter.post("/", async (request, response) => {
  const { authorname, name, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const author = new Author({
    authorname,
    name,
    passwordHash,
  });

  const savedAuthor = await author.save();

  response.status(201).json(savedAuthor);
});

module.exports = authorsRouter;
