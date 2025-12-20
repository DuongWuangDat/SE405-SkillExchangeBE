# Skill Exchange API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 📝 Table of Contents
1. [User APIs](#user-apis)
2. [Topic APIs](#topic-apis)
3. [Request APIs](#request-apis)
4. [Chat APIs](#chat-apis)
5. [Message APIs](#message-apis)
6. [Report APIs](#report-apis)
7. [Token APIs](#token-apis)
8. [Upload APIs](#upload-apis)
9. [Service APIs](#service-apis)

---

## User APIs

### 1. Register User
**POST** `/user/register`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "phoneNumber": "0123456789",
  "password": "password123",
  "birthDay": "15/06/1995",
  "avatar": "https://example.com/avatar.jpg",
  "imageCerti": ["https://example.com/cert1.jpg"],
  "description": ["Experienced developer"],
  "userTopicSkill": ["topic_id_1", "topic_id_2"],
  "learnTopicSkill": ["topic_id_3"],
  "skill": ["JavaScript", "React"]
}
```

**Response:**
```json
{
  "message": "Register successfully",
  "data": {
    "username": "john_doe",
    "email": "john@example.com",
    "_id": "user_id"
  }
}
```

### 2. Login
**POST** `/user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Change Password
**PATCH** `/user/changePassword` 🔒

**Request Body:**
```json
{
  "email": "john@example.com",
  "oldPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "message": "Change password successfully"
}
```

### 4. Update User
**PATCH** `/user/update/:id` 🔒

**Parameters:**
- `id` - User ID

**Request Body:**
```json
{
  "username": "john_updated",
  "avatar": "https://example.com/new_avatar.jpg",
  "description": ["Updated description"],
  "userTopicSkill": ["topic_id_1"],
  "learnTopicSkill": ["topic_id_2"],
  "skill": ["JavaScript", "TypeScript", "Node.js"]
}
```

**Response:**
```json
{
  "message": "Update successfully",
  "data": {
    "_id": "user_id",
    "username": "john_updated"
  }
}
```

### 5. Delete User (Soft Delete)
**DELETE** `/user/delete/:id` 🔒

**Parameters:**
- `id` - User ID

**Response:**
```json
{
  "message": "Delete successfully"
}
```

### 6. Get User by Topic
**GET** `/user/find/topic` 🔒

**Query Parameters:**
- `userTopicSkill` - Topic ID to search for

**Example:**
```
GET /user/find/topic?userTopicSkill=topic_id_1
```

**Response:**
```json
{
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "avatar": "https://example.com/avatar.jpg",
      "userTopicSkill": ["topic_id_1"]
    }
  ]
}
```

### 7. Get All Users
**GET** `/user/find` 🔒

**Response:**
```json
{
  "data": [
    {
      "_id": "user_id",
      "username": "john_doe",
      "email": "john@example.com"
    }
  ]
}
```

### 8. Get User by Email
**GET** `/user/find/email` 🔒

**Query Parameters:**
- `email` - User email

**Example:**
```
GET /user/find/email?email=john@example.com
```

**Response:**
```json
{
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### 9. Get User by ID
**GET** `/user/findbyid/:id` 🔒

**Parameters:**
- `id` - User ID

**Response:**
```json
{
  "data": {
    "_id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "userTopicSkill": [
      {
        "_id": "topic_id",
        "name": "JavaScript"
      }
    ]
  }
}
```

### 10. Logout
**POST** `/user/logout` 🔒

**Request Body:**
```json
{
  "token": "refresh_token_here"
}
```

**Response:**
```json
{
  "message": "Logout successfully"
}
```

---

## Topic APIs

### 1. Create Topic
**POST** `/topic/create` 🔒

**Request Body:**
```json
{
  "name": "JavaScript",
  "image": "https://example.com/js-logo.png"
}
```

**Response:**
```json
{
  "message": "Created successfully",
  "data": {
    "_id": "topic_id",
    "name": "JavaScript",
    "image": "https://example.com/js-logo.png"
  }
}
```

### 2. Create Many Topics
**POST** `/topic/create/many` 🔒

**Request Body:**
```json
{
  "topics": [
    {
      "name": "React",
      "image": "https://example.com/react.png"
    },
    {
      "name": "Node.js",
      "image": "https://example.com/nodejs.png"
    }
  ]
}
```

**Response:**
```json
{
  "message": "Created successfully",
  "data": [
    {
      "_id": "topic_id_1",
      "name": "React"
    },
    {
      "_id": "topic_id_2",
      "name": "Node.js"
    }
  ]
}
```

### 3. Delete Topic
**DELETE** `/topic/delete/:id` 🔒

**Parameters:**
- `id` - Topic ID

**Response:**
```json
{
  "message": "Delete successfully"
}
```

### 4. Update Topic
**PATCH** `/topic/update/:id` 🔒

**Parameters:**
- `id` - Topic ID

**Request Body:**
```json
{
  "name": "JavaScript ES6+",
  "image": "https://example.com/new-js-logo.png"
}
```

**Response:**
```json
{
  "message": "Update successfully",
  "data": {
    "_id": "topic_id",
    "name": "JavaScript ES6+",
    "image": "https://example.com/new-js-logo.png"
  }
}
```

### 5. Get All Topics
**GET** `/topic/find` 🔒

**Response:**
```json
{
  "data": [
    {
      "_id": "topic_id",
      "name": "JavaScript",
      "image": "https://example.com/js-logo.png"
    }
  ]
}
```

### 6. Get Topic by ID
**GET** `/topic/find/:id` 🔒

**Parameters:**
- `id` - Topic ID

**Response:**
```json
{
  "data": {
    "_id": "topic_id",
    "name": "JavaScript",
    "image": "https://example.com/js-logo.png"
  }
}
```

### 7. Get Topics with Limit
**GET** `/topic/limit/:limit` 🔒

**Parameters:**
- `limit` - Number of topics to return

**Response:**
```json
{
  "data": [
    {
      "_id": "topic_id_1",
      "name": "JavaScript"
    },
    {
      "_id": "topic_id_2",
      "name": "React"
    }
  ]
}
```

### 8. Get Topics with Pagination
**GET** `/topic/pagination` 🔒

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Example:**
```
GET /topic/pagination?page=1&limit=10
```

**Response:**
```json
{
  "data": [
    {
      "_id": "topic_id",
      "name": "JavaScript"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 50
}
```

### 9. Delete All Topics
**DELETE** `/topic/deleteall` 🔒

**Response:**
```json
{
  "message": "Delete all successfully"
}
```

---

## Request APIs

### 1. Create New Request
**POST** `/request/create` 🔒

**Request Body:**
```json
{
  "senderID": "user_id_1",
  "receiverID": "user_id_2"
}
```

**Response:**
```json
{
  "message": "Created new request successfully",
  "data": {
    "_id": "request_id",
    "senderID": "user_id_1",
    "receiverID": "user_id_2",
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

### 2. Get Requests by Sender ID
**GET** `/request/find/sender/:senderID` 🔒

**Parameters:**
- `senderID` - Sender user ID

**Response:**
```json
{
  "data": [
    {
      "_id": "request_id",
      "senderID": "user_id_1",
      "receiverID": {
        "_id": "user_id_2",
        "username": "jane_doe",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  ]
}
```

### 3. Get Requests by Receiver ID
**GET** `/request/find/receiver/:receiverID` 🔒

**Parameters:**
- `receiverID` - Receiver user ID

**Response:**
```json
{
  "data": [
    {
      "_id": "request_id",
      "senderID": {
        "_id": "user_id_1",
        "username": "john_doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "receiverID": "user_id_2"
    }
  ]
}
```

### 4. Delete Request
**DELETE** `/request/delete/:id` 🔒

**Parameters:**
- `id` - Request ID

**Response:**
```json
{
  "message": "Delete successfully"
}
```

### 5. Delete Request by Sender ID
**DELETE** `/request/deletebysenderid` 🔒

**Request Body:**
```json
{
  "senderID": "user_id_1",
  "receiverID": "user_id_2"
}
```

**Response:**
```json
{
  "message": "Delete successfully"
}
```

---

## Chat APIs

### 1. Create New Chat Room
**POST** `/chat/create` 🔒

**Request Body:**
```json
{
  "members": ["user_id_1", "user_id_2"]
}
```

**Response:**
```json
{
  "message": "Created new chat successfully",
  "data": {
    "_id": "chat_id",
    "members": ["user_id_1", "user_id_2"],
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

### 2. Get All Chat Rooms
**GET** `/chat/find` 🔒

**Response:**
```json
{
  "data": [
    {
      "_id": "chat_id",
      "members": [
        {
          "_id": "user_id_1",
          "username": "john_doe"
        },
        {
          "_id": "user_id_2",
          "username": "jane_doe"
        }
      ]
    }
  ]
}
```

### 3. Get Chat by User ID
**GET** `/chat/find/:uid` 🔒

**Parameters:**
- `uid` - User ID

**Response:**
```json
{
  "data": [
    {
      "_id": "chat_id",
      "members": ["user_id_1", "user_id_2"]
    }
  ]
}
```

### 4. Get Chat by Two User IDs
**GET** `/chat/find/both` 🔒

**Query Parameters:**
- `uid1` - First user ID
- `uid2` - Second user ID

**Example:**
```
GET /chat/find/both?uid1=user_id_1&uid2=user_id_2
```

**Response:**
```json
{
  "data": {
    "_id": "chat_id",
    "members": ["user_id_1", "user_id_2"]
  }
}
```

### 5. Delete Chat Room
**DELETE** `/chat/delete/:id` 🔒

**Parameters:**
- `id` - Chat room ID

**Response:**
```json
{
  "message": "Delete successfully"
}
```

---

## Message APIs

### 1. Send Message
**POST** `/message/send` 🔒

**Request Body:**
```json
{
  "chatID": "chat_id",
  "senderID": "user_id_1",
  "content": "Hello, how are you?"
}
```

**Response:**
```json
{
  "message": "Send message successfully",
  "data": {
    "_id": "message_id",
    "chatID": "chat_id",
    "senderID": "user_id_1",
    "content": "Hello, how are you?",
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

**Note:** Messages containing toxic content will be rejected with error response.

### 2. Get Messages by Chat ID
**GET** `/message/find/:chatID` 🔒

**Parameters:**
- `chatID` - Chat room ID

**Response:**
```json
{
  "data": [
    {
      "_id": "message_id",
      "chatID": "chat_id",
      "senderID": {
        "_id": "user_id_1",
        "username": "john_doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "content": "Hello!",
      "createdAt": "2025-12-20T10:00:00.000Z"
    }
  ]
}
```

### 3. Get Messages by Both User IDs
**GET** `/message/findbyboth` 🔒

**Query Parameters:**
- `uid1` - First user ID
- `uid2` - Second user ID

**Example:**
```
GET /message/findbyboth?uid1=user_id_1&uid2=user_id_2
```

**Response:**
```json
{
  "data": [
    {
      "_id": "message_id",
      "content": "Hello!",
      "senderID": "user_id_1",
      "createdAt": "2025-12-20T10:00:00.000Z"
    }
  ]
}
```

### 4. Delete Message
**DELETE** `/message/delete/:id` 🔒

**Parameters:**
- `id` - Message ID

**Request Body:**
```json
{
  "senderID": "user_id_1"
}
```

**Response:**
```json
{
  "message": "Delete message successfully"
}
```

**Note:** Only the sender can delete their own messages.

---

## Report APIs

### 1. Add New Report
**POST** `/report/add` 🔒

**Request Body:**
```json
{
  "senderID": "user_id_1",
  "targetID": "user_id_2",
  "content": "User này sử dụng ngôn từ không phù hợp trong chat",
  "evidence": "https://example.com/screenshot.png"
}
```

**Response:**
```json
{
  "message": "Report created successfully",
  "data": {
    "_id": "report_id",
    "senderID": {
      "_id": "user_id_1",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "targetID": {
      "_id": "user_id_2",
      "username": "jane_doe",
      "email": "jane@example.com"
    },
    "content": "User này sử dụng ngôn từ không phù hợp trong chat",
    "evidence": "https://example.com/screenshot.png",
    "isDeleted": false,
    "isResolved": false,
    "createdAt": "2025-12-20T10:00:00.000Z"
  }
}
```

### 2. Get All Reports
**GET** `/report/all` 🔒

**Response:**
```json
{
  "message": "Get all reports successfully",
  "data": [
    {
      "_id": "report_id",
      "senderID": {
        "_id": "user_id_1",
        "username": "john_doe"
      },
      "targetID": {
        "_id": "user_id_2",
        "username": "jane_doe"
      },
      "content": "Report content",
      "evidence": "https://example.com/evidence.png",
      "isResolved": false,
      "createdAt": "2025-12-20T10:00:00.000Z"
    }
  ]
}
```

### 3. Get All Resolved Reports
**GET** `/report/resolved` 🔒

**Response:**
```json
{
  "message": "Get all resolved reports successfully",
  "data": [
    {
      "_id": "report_id",
      "senderID": {
        "_id": "user_id_1",
        "username": "john_doe"
      },
      "targetID": {
        "_id": "user_id_2",
        "username": "jane_doe"
      },
      "content": "Report content",
      "isResolved": true,
      "createdAt": "2025-12-20T10:00:00.000Z"
    }
  ]
}
```

### 4. Resolve Report
**PUT** `/report/resolve/:id` 🔒

**Parameters:**
- `id` - Report ID

**Response:**
```json
{
  "message": "Report resolved successfully",
  "data": {
    "_id": "report_id",
    "isResolved": true,
    "updatedAt": "2025-12-20T11:00:00.000Z"
  }
}
```

### 5. Delete Report
**DELETE** `/report/:id` 🔒

**Parameters:**
- `id` - Report ID

**Response:**
```json
{
  "message": "Report deleted successfully"
}
```

---

## Token APIs

### 1. Refresh Token
**GET** `/token/refresh-token`

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Check Token
**POST** `/token/checktoken`

**Request Body:**
```json
{
  "token": "access_token_here"
}
```

**Response:**
```json
{
  "message": "Token is valid"
}
```

**Error Responses:**
```json
{
  "message": "Token is expired"
}
```
or
```json
{
  "message": "Token is revoked"
}
```

### 3. Delete All Tokens (Development)
**DELETE** `/token/deleteall` 🔒

**Response:**
```json
{
  "message": "Deleted successfully"
}
```

---

## Upload APIs

### 1. Upload Image
**POST** `/upload/image`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image` - Image file

**Response:**
```json
{
  "image": "https://firebasestorage.googleapis.com/v0/b/skillexchange-62da0.appspot.com/o/files%2Fimage.jpg?alt=media&token=..."
}
```

### 2. Upload File
**POST** `/upload/file`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - Any file

**Response:**
```json
{
  "file": "https://firebasestorage.googleapis.com/v0/b/skillexchange-62da0.appspot.com/o/files%2Fdocument.pdf?alt=media&token=..."
}
```

---

## Service APIs

### 1. Send Email
**POST** `/service/sendEmail`

**Request Body:**
```json
{
  "to": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

### 2. Delete All (Development)
**DELETE** `/service/deleteall` 🔒

**Response:**
```json
{
  "message": "Delete all successfully"
}
```

---

## Socket.IO Events

### Connection
```javascript
socket.on('connection', (socket) => {
  console.log('User connected:', socket.id);
});
```

### Add Online User
**Event:** `addOnlineUser`

**Emit:**
```javascript
socket.emit('addOnlineUser', userId);
```

### Send Message
**Event:** `sendMessage`

**Emit:**
```javascript
socket.emit('sendMessage', {
  chatID: 'chat_id',
  senderID: 'user_id',
  content: 'Hello!'
});
```

**Listen for:**
- `getMessage` - Receive new message
- `getLatestMessage` - Receive latest message
- `messageToxicError` - Message rejected due to toxic content

### Get Online Users
**Event:** `getOnlineUser`

**Listen:**
```javascript
socket.on('getOnlineUser', (users) => {
  console.log('Online users:', users);
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (Invalid data) |
| 401 | Unauthorized (Invalid/expired token) |
| 403 | Forbidden (No permission) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Notes

- 🔒 indicates authentication required
- All timestamps are in ISO 8601 format
- File uploads use Firebase Storage
- Toxicity detection is applied to all messages (Vietnamese and English)
- Soft delete is implemented for users and reports (data is not permanently deleted)
- Admin account credentials: username=`admin`, password=`admin` (encrypted)

---

## Admin Features

Admin users have `isAdmin: true` field. Create admin accounts using the migration script or database directly.

---

**Last Updated:** December 20, 2025
