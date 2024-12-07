jest.mock("../models/user");
jest.mock("../models/post");
const User = require("../models/user");
const Post = require("../models/post");
const { follow, unFollow, userPosts } = require("./user");

describe("follow", () => {
  const next = jest.fn();
  test("사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함", async () => {
    const res = {
      send: jest.fn(),
    };
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    await follow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("사용자를 못 찾으면 res.status(404).send(no user)를 호출 함", async () => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const req = {
      user: { id: 100 },
      params: { id: 100 },
    };
    User.findOne.mockReturnValue(null);
    await follow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });
  test("알 수 없는 응답이오면 next(error)를 호출함", async () => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const req = {
      user: { id: 100 },
      params: { id: 100 },
    };
    const message = "알 수 없는 응답";
    User.addFollowing.mockReturnValue(Promise.resolve(message));
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
  test("DB에서 에러가 발생하면 next(error)를 호출함", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {};
    const message = "DB 에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    await follow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});

describe("unFollow", () => {
  const req = {
    user: { id: 1 },
    params: { id: 2 },
  };
  test("언팔로우할 사용자를 찾아 언팔로우하고 success를 호출해야함", async () => {
    const res = {
      send: jest.fn(() => "success"),
    };
    const next = jest.fn();
    User.findOne.mockReturnValue({
      removeFollowing(id) {
        return Promise.resolve(true);
      },
    });
    await unFollow(req, res, next);
    expect(res.send).toBeCalledWith("success");
  });
  test("언팔로우할 사용자가 존재하지 않으면 res.status(404).send(no user)를 호출해야함", async () => {
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    const next = jest.fn();
    User.findOne.mockReturnValue(null);
    await unFollow(req, res, next);
    expect(res.status).toBeCalledWith(404);
    expect(res.send).toBeCalledWith("no user");
  });
  test("DB에서 에러가 발생하면 next(error)를 호출함", async () => {
    const req = {
      user: { id: 1 },
      params: { id: 2 },
    };
    const res = {};
    const next = jest.fn();
    const message = "DB 에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    await unFollow(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});

describe("userPosts", () => {
  const next = jest.fn();
  test("해당 유저의 포스트를 json으로 반환", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {
      json: jest.fn(),
    };

    Post.findAll.mockReturnValue(Promise.resolve(true));
    await userPosts(req, res, next);
    expect(res.json).toBeCalled();
  });
  test("DB에서 에러가 발생하면 next(error)를 호출함", async () => {
    const req = {
      params: { id: 1 },
    };
    const res = {};
    const message = "DB 에러";
    Post.findAll.mockReturnValue(Promise.reject(message));
    await userPosts(req, res, next);
    expect(next).toBeCalledWith(message);
  });
});
