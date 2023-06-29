const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Author = require("../models/author");

loginRouter.post("/", async (request, response) => {
  const { authorname, password } = request.body;

  const author = await Author.findOne({ authorname });
  const passwordCorrect =
    author === null
      ? false
      : await bcrypt.compare(password, author.passwordHash);

  if (!(author && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    authorname: author.authorname,
    id: author._id,
  };

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response
    .status(200)
    .send({ token, authorname: author.authorname, name: author.name });
});

module.exports = loginRouter;

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JuYW1lIjoiYWEiLCJpZCI6IjY0OWQ0YjVmYjQ2NTE2NDM2NTc3NzQ2YiIsImlhdCI6MTY4ODAzMzEwOH0.V8vWLjXh9W-NPKqnRcYC02qg0ngbJfxlZ_7L9n1Cll8",
