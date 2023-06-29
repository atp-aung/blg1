const mongoose = require("mongoose");
const supertest = require("supertest");
const helper = require("./testhelper");
const app = require("../app");
const api = supertest(app);

const Blog = require("../models/blog");

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  // await Blog.deleteMany({});
  // let blogObject = new Blog(helper.initialBlogs[0]);
  // await blogObject.save();
  // blogObject = new Blog(helper.initialBlogs[1]);
  // await blogObject.save();
}, 100000);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("there are two blogs", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(2);
}, 100000);

test("the first blog is about aaaa1", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body[0].title).toBe("aaaa1");
}, 100000);

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");
  expect(response.body).toHaveLength(helper.initialBlogs.length);
}, 100000);

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get("/api/blogs");
  const titles = response.body.map((r) => r.title);
  expect(titles).toContain("aaaa1");
}, 100000);

test("verify id property", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
}, 100000);

test("blogs without likes is not added", async () => {
  const newBlog = {
    title: "aaaa5",
    author: "a5",
    url: "a5.com",
  };
  await api.post("/api/blogs").send(newBlog).expect(201);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
}, 100000);

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "aaaa4",
    author: "a4",
    url: "a4.com",
    likes: 4,
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  const titles = blogsAtEnd.map((n) => n.title);
  expect(titles).toContain("aaaa4");
}, 100000);

test("a specific blog can be viewed", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToView = blogsAtStart[0];
  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(resultBlog.body).toEqual(blogToView);
}, 100000);

test("like updating", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToView = blogsAtStart[0];
  await api
    .put(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect("Content-Type", /application\/json/);
}, 100000);

test("a blog can be deleted", async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  const title = blogsAtEnd.map((r) => r.title);
  expect(title).not.toContain(blogToDelete.title);
}, 100000);

test("blog without title is not added", async () => {
  const newBlog = {
    author: "a6",
    url: "a6.com",
    likes: 6,
  };
  await api.post("/api/blogs").send(newBlog).expect(400);
  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
}, 100000);

// test("succeeds with a valid id", async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToView = blogsAtStart[0];
//   const resultBlog = await api
//     .get(`/api/notes/${blogToView.id}`)
//     .expect(200)
//     .expect("Content-Type", /application\/json/);
//   expect(resultBlog.body).toEqual(blogToView);
// });

test("fails with statuscode 404 if blog does not exist", async () => {
  const validNonexistingId = await helper.nonExistingId();
  await api.get(`/api/blogs/${validNonexistingId}`).expect(404);
});

test("fails with statuscode 400 if id is invalid", async () => {
  const invalidId = "44332211";
  await api.get(`/api/blogs/${invalidId}`).expect(400);
});

afterAll(async () => {
  await mongoose.connection.close();
}, 100000);
