jest.mock("../models/user");
jest.mock("../models/post");
const User = require("../models/user");
const Post = require("../models/post");
const { follow, unFollow, userPosts } = require("./user");

describe("follow", () => {
  test("사용자를 찾아 팔로잉을 추가하고 ok를 반환함", async () => {
    User.findOne.mockReturnValue({
      addFollowing(id) {
        return Promise.resolve(true);
      },
    });
    const result = await follow(1, 2);
    expect(result).toEqual("ok");
  });
  test("사용자를 못 찾으면 no user를 반환함", async () => {
    User.findOne.mockReturnValue(null);
    const result = await follow(1, 2);
    expect(result).toEqual("no user");
  });
  test("DB에서 에러가 발생하면 throw", async () => {
    const message = "DB 에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    try {
      await follow(1, 2);
    } catch (err) {
      expect(err).toEqual(message);
    }
  });
});

describe("unFollow", () => {
  const userId = 1;
  const unFollowId = 2;
  test("사용자를 찾아 언팔로우하고 ok를 리턴", async () => {
    User.findOne.mockReturnValue({
      removeFollowing(id) {
        return Promise.resolve(true);
      },
    });
    const result = await unFollow(userId, unFollowId);
    expect(result).toEqual("ok");
  });
  test("사용자를 못 찾으면 no user를 리턴", async () => {
    User.findOne.mockReturnValue(null);
    const result = await unFollow(userId, unFollowId);
    expect(result).toEqual("no user");
  });
  test("DB에서 에러가 발생하면 throw", async () => {
    const message = "DB 에러";
    User.findOne.mockReturnValue(Promise.reject(message));
    try {
      await unFollow(userId, unFollowId);
    } catch (err) {
      expect(err).toEqual(message);
    }
  });
});

describe("userPosts", () => {
  const userId = 1;
  test("유저의 게시물을 검색하고 ok를 리턴", async () => {
    Post.findAll.mockReturnValue(Promise.resolve(true));
    const result = await userPosts(userId);
    expect(result.message).toEqual("ok");
  });
  test("DB에서 에러가 발생하면 throw", async () => {
    const message = "DB 에러";
    Post.findAll.mockReturnValue(Promise.reject(message));
    try {
      await userPosts(userId);
    } catch (err) {
      expect(err).toEqual(message);
    }
  });
});
