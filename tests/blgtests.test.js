const listHelper = require("../utils/listhelp");
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 4,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Michael Chan",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 6,
    __v: 0,
  },
];

describe("test value one", () => {
  test("dummy returns one", () => {
    const result = listHelper.dummy(blogs);
    expect(result).toBe(1);
  });
});

describe("test tt likes", () => {
  test("total likes", () => {
    const result = listHelper.ttlikes(blogs);
    expect(result).toBe(15);
  });
});

describe("test most likes", () => {
  test("most likes", () => {
    const y = {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 6,
    };
    const result = listHelper.favBlgs(blogs);
    expect(result).toEqual(y);
  });
});

describe("test author with most blogs", () => {
  test("total blogs", () => {
    const y = {
      author: "Michael Chan",
      blogs: 2,
    };
    const result = listHelper.mostBlgs(blogs);
    expect(result).toEqual(y);
  });
});

describe("test author with most likes", () => {
  test("total likes", () => {
    const y = {
      author: "Michael Chan",
      likes: 9,
    };
    const result = listHelper.mostLks(blogs);
    expect(result).toEqual(y);
  });
});
