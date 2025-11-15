const { createNewRequest } = require("../controller/request_controller"); // Đảm bảo đúng đường dẫn
const User = require("../model/user");
const Request = require("../model/request");
const Chat = require("../model/chat");
const helper = require("../pkg/helper/helper");

// Mock các mô-đun cần thiết
jest.mock("../model/user");
jest.mock("../model/request");
jest.mock("../model/chat");
jest.mock("../pkg/helper/helper");

describe("createNewRequest", () => {
  let req, res;

  beforeEach(() => {
    // Thiết lập giả lập cho `req` và `res`
    req = {
      body: {
        senderID: "validSenderID",
        receiverID: "validReceiverID",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Dọn dẹp các mock sau mỗi test
  });

  test("should return 400 if senderID or receiverID is invalid", async () => {
    helper.isValidObjectID.mockResolvedValueOnce(false); // Giả lập isValidObjectID trả về false

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid id",
    });
  });

  test("should return 400 if user not found", async () => {
    helper.isValidObjectID.mockResolvedValue(true);
    User.findById.mockResolvedValueOnce(null);

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  test("should return 400 if request already exists", async () => {
    helper.isValidObjectID.mockResolvedValue(true);
    User.findById.mockResolvedValue({});
    Request.findOne.mockResolvedValue({});

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Existed request",
    });
  });

  test("should return 400 if chat room already exists", async () => {
    helper.isValidObjectID.mockResolvedValue(true);
    User.findById.mockResolvedValue({});
    Request.findOne.mockResolvedValue(null);
    Chat.findOne.mockResolvedValueOnce({}); // Giả lập phòng chat đã tồn tại

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Existed chat room",
    });
  });

  test("should return 400 if something went wrong while saving", async () => {
    helper.isValidObjectID.mockResolvedValue(true);
    User.findById.mockResolvedValue({});
    Request.findOne.mockResolvedValue(null);
    Chat.findOne.mockResolvedValueOnce(null);

    const mockRequestSave = jest
      .fn()
      .mockRejectedValueOnce(new Error("Some error"));
    Request.prototype.save = mockRequestSave;

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Something went wrong",
    });
  });

  test("should return 200 and created request if everything is successful", async () => {
    helper.isValidObjectID.mockResolvedValue(true);
    User.findById.mockResolvedValue({});
    Request.findOne.mockResolvedValue(null);
    Chat.findOne.mockResolvedValueOnce(null);

    const mockRequestSave = jest.fn().mockResolvedValueOnce({});
    Request.prototype.save = mockRequestSave;

    await createNewRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Created new request successfully",
      data: expect.any(Object),
    });
  });
});
