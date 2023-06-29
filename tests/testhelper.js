const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "aaaa1",
    author: "aa",
    url: "aa.com",
    likes: 4,
  },
  {
    title: "aaaa2",
    author: "aa",
    url: "aa.com",
    likes: 5,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "willremovethissoon" });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
};
