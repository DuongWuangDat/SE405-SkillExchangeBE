const { getUserByTopic } = require("../controller/user_controller"); // Đổi path thực tế
const User = require("../model/user");
const Topic = require("../model/topic");
const Chat = require("../model/chat");
const Request = require("../model/request");
const tokenController = require("../controller/token_controller");

// Mock các model Mongoose và controller
jest.mock("../model/user");
jest.mock("../model/topic");
jest.mock("../model/chat");
jest.mock("../model/request");
jest.mock("../controller/token_controller");

describe("getUserByTopic", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { topics: "JavaScript,NodeJS" },
      headers: { authorization: "Bearer mockToken" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    tokenController.getUIDfromToken.mockResolvedValue("user123");
  });

  afterEach(() => {
    jest.clearAllMocks(); // Dọn dẹp các mock sau mỗi test
  });

  it("should return users filtered by topics", async () => {
    // Mock topic IDs
    Topic.findOne
      .mockImplementationOnce(() => ({ _id: "topic1" }))
      .mockImplementationOnce(() => ({ _id: "topic2" }));

    Chat.find.mockResolvedValue([{ members: ["user123", "user456"] }]);

    Request.find.mockImplementation((filter) => {
      if (filter.senderID)
        return { distinct: jest.fn().mockResolvedValue(["user789"]) };
      if (filter.receiverID)
        return { distinct: jest.fn().mockResolvedValue(["user567"]) };
    });

    User.find.mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            populate: jest.fn().mockImplementation(() => {
              return {
                populate: jest.fn().mockResolvedValue([
                  {
                    _id: "user100",
                    name: "Test User",
                    userTopicSkill: ["topic1"],
                  },
                ]),
              };
            }),
          };
        }),
      };
    });

    await getUserByTopic(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: [{ _id: "user100", name: "Test User", userTopicSkill: ["topic1"] }],
    });
  });

  it("should return 404 if no users are found", async () => {
    Topic.findOne.mockResolvedValue(null);
    User.find.mockImplementation(() => {
      return {
        select: jest.fn().mockImplementation(() => {
          return {
            populate: jest.fn().mockImplementation(() => {
              return {
                populate: jest.fn().mockResolvedValue([]),
              };
            }),
          };
        }),
      };
    });

    await getUserByTopic(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User is not found" });
  });
});
