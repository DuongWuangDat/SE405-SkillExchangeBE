const { register } = require("../controller/user_controller.js"); // Đường dẫn tới file controller
const helper = require("../pkg/helper/helper.js"); // Module chứa helper functions
const User = require("../model/user.js"); // Mongoose model
const Topic = require("../model/topic.js");
const bcrypt = require("../pkg/auth/authorization.js");
const auth = require("../pkg/auth/authentication.js"); // Token generation utility
const tokenController = require("../controller/token_controller.js");
const { default: mongoose } = require("mongoose");
const exp = require("constants");

jest.mock("../pkg/helper/helper");
jest.mock("../model/user");
jest.mock("../model/topic");
jest.mock("../pkg/auth/authorization.js");
jest.mock("../pkg/auth/authentication.js");
jest.mock("../controller/token_controller");

describe("register function", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        phoneNumber: "1234567890",
        password: "password123",
        birthDay: "01/01/2000",
        learnTopicSkill: [new mongoose.Types.ObjectId()],
        userTopicSkill: [new mongoose.Types.ObjectId()],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return 400 if email is invalid", async () => {
    helper.isValidEmail.mockResolvedValue(false);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email",
    });
  });

  it("should return 400 if phone number is invalid", async () => {
    helper.isValidEmail.mockResolvedValue(true);
    helper.isValidPhoneNumber.mockResolvedValue(false);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid phone number",
    });
  });

  it("should return 400 if email already exists", async () => {
    helper.isValidEmail.mockResolvedValue(true);
    helper.isValidPhoneNumber.mockResolvedValue(true);
    User.findOne.mockResolvedValue({ email: "test@example.com" });

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Existed email",
    });
  });

  it("should return 400 if any topic does not exist", async () => {
    helper.isValidEmail.mockResolvedValue(true);
    helper.isValidPhoneNumber.mockResolvedValue(true);
    User.findOne.mockResolvedValue(null);
    Topic.findById.mockResolvedValueOnce(null); // First topic not found

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Topic not exist",
    });
  });

  it("should return 400 if save fails", async () => {
    helper.isValidEmail.mockResolvedValue(true);
    helper.isValidPhoneNumber.mockResolvedValue(true);
    User.findOne.mockResolvedValue(null);
    Topic.findById.mockResolvedValue({}); // All topics found
    bcrypt.hashPassword.mockResolvedValue("hashedPassword");
    User.prototype.save.mockRejectedValue(new Error("Database error"));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });

  it("should return tokens and user data on success", async () => {
    helper.isValidEmail.mockResolvedValue(true);
    helper.isValidPhoneNumber.mockResolvedValue(true);
    User.findOne.mockResolvedValue(null);
    Topic.findById.mockResolvedValue({}); // All topics found
    bcrypt.hashPassword.mockResolvedValue("hashedPassword");
    User.prototype.save.mockResolvedValue({});
    auth.generateToken
      .mockResolvedValueOnce("accessToken")
      .mockResolvedValueOnce("refreshToken");

    await register(req, res);
    expect(res.json).toHaveBeenCalledWith({
      accessToken: "accessToken",
      refreshToken: "refreshToken",
      data: expect.any(Object),
    });
  });

  it("should return 400 if birthday is invalid", async () => {
    req = {
      body: {
        email: "test@example.com",
        phoneNumber: "1234567890",
        password: "password123",
        birthDay: "01/abc/2000",
        learnTopicSkill: [new mongoose.Types.ObjectId()],
        userTopicSkill: [new mongoose.Types.ObjectId()],
      },
    };

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
