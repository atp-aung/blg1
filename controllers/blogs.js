const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Author = require("../models/author");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
  const blogs = await Blog.find({}).populate("author", {
    authorname: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const author = await Author.findById(decodedToken.id);
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    author: author.id,
  });
  const savedBlog = await blog.save();
  author.blogs = author.blogs.concat(savedBlog._id);
  await author.save();
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blg = await Blog.findById(request.params.id);
  if (blg) {
    response.json(blg);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: {
      likes: 55,
    },
  });
  response.json(updatedBlog);
});

// notesRouter.get("/", (request, response) => {
//   Note.find({}).then((notes) => {
//     response.json(notes);
//   });
// });

// notesRouter.get("/:id", (request, response, next) => {
//   Note.findById(request.params.id)
//     .then((note) => {
//       if (note) {
//         response.json(note);
//       } else {
//         response.status(404).end();
//       }
//     })
//     .catch((error) => next(error));
// });

// notesRouter.post("/", (request, response, next) => {
//   const body = request.body;

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//   });

//   note
//     .save()
//     .then((savedNote) => {
//       response.json(savedNote);
//     })
//     .catch((error) => next(error));
// });

// notesRouter.delete("/:id", (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(() => {
//       response.status(204).end();
//     })
//     .catch((error) => next(error));
// });

// notesRouter.put("/:id", (request, response, next) => {
//   const body = request.body;
//   const note = {
//     content: body.content,
//     important: body.important,
//   };
//   Note.findByIdAndUpdate(request.params.id, note, { new: true })
//     .then((updatedNote) => {
//       response.json(updatedNote);
//     })
//     .catch((error) => next(error));
// });

module.exports = blogsRouter;
