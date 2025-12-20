# Hướng dẫn sử dụng AI phát hiện nội dung Toxic cho tin nhắn Tiếng Việt

## Tính năng
- Phát hiện và chặn tin nhắn có nội dung toxic/hate speech bằng Tiếng Việt
- Sử dụng model AI **ViHateT5-base-V2** từ Hugging Face (chính xác cao cho Tiếng Việt)
- Có fallback dự phòng bằng từ khóa nếu API không khả dụng

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install axios
```

### 2. Lấy Hugging Face API Key (MIỄN PHÍ)
1. Truy cập: https://huggingface.co/
2. Đăng ký/Đăng nhập tài khoản
3. Vào Settings → Access Tokens: https://huggingface.co/settings/tokens
4. Tạo token mới (chọn role: Read)
5. Copy token

### 3. Cấu hình .env file
Thêm vào file `.env` của bạn:
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxxx
```

## Model AI sử dụng

### Model chính: ViHateT5-base-V2
- **Tên model**: `tarudesu/ViHateT5-base-V2`
- **Mô tả**: Model được train đặc biệt cho hate speech detection Tiếng Việt
- **Độ chính xác**: Rất cao với văn bản Tiếng Việt
- **Link**: https://huggingface.co/tarudesu/ViHateT5-base-V2

### Các model thay thế (có thể thử)
1. **NlpHUST/vi-offensive-language-detection**
   - Phát hiện ngôn ngữ xúc phạm tiếng Việt
   - Link: https://huggingface.co/NlpHUST/vi-offensive-language-detection

2. **wonrax/phobert-base-vietnamese-sentiment**
   - Phân tích sentiment tiếng Việt
   - Link: https://huggingface.co/wonrax/phobert-base-vietnamese-sentiment

## Cách hoạt động

### Khi gửi tin nhắn text:
1. **Bước 1**: Tin nhắn được gửi qua AI model ViHateT5
2. **Bước 2**: Model trả về:
   - `LABEL_1` = Toxic/Hate speech
   - `LABEL_0` = Clean/Sạch
   - `score` = Độ tin cậy (0-1)
3. **Bước 3**: 
   - Nếu `LABEL_1` và `score > 0.5` → **CHẶN** tin nhắn
   - Ngược lại → Cho phép gửi

### Fallback (dự phòng):
- Nếu API lỗi hoặc không có API key
- Sử dụng từ khóa toxic phổ biến trong Tiếng Việt
- Danh sách từ khóa có thể tùy chỉnh trong `toxicityDetection.js`

## API Response

### Khi tin nhắn bị chặn:
```json
{
  "message": "Your message contains inappropriate content and cannot be sent",
  "messageToxic": "Tin nhắn của bạn chứa nội dung không phù hợp và không thể gửi",
  "toxicity": {
    "label": "toxic",
    "confidence": 0.95
  }
}
```
**HTTP Status**: `400 Bad Request`

### Khi tin nhắn được gửi:
```json
{
  "message": "Send message successfully",
  "data": {
    "_id": "...",
    "content": "...",
    "senderID": {...},
    ...
  }
}
```
**HTTP Status**: `200 OK`

## Tùy chỉnh

### Thay đổi ngưỡng phát hiện toxic
Mở file `pkg/helper/toxicityDetection.js`, tìm dòng:
```javascript
const isToxic = prediction.label === "LABEL_1" && prediction.score > 0.5;
```
Thay `0.5` thành giá trị khác (0.3 - 0.8):
- `0.3`: Nghiêm ngặt hơn (chặn nhiều hơn)
- `0.8`: Lỏng hơn (chặn ít hơn)

### Thêm từ khóa toxic mới
Mở file `pkg/helper/toxicityDetection.js`, tìm mảng `toxicKeywords`:
```javascript
const toxicKeywords = [
    "đụ", "địt", "lồn", ...,
    "từ_mới_của_bạn"  // Thêm vào đây
];
```

### Thay đổi model AI
Mở file `pkg/helper/toxicityDetection.js`, thay đổi:
```javascript
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/MODEL_NAME";
```

## Testing

### Test thủ công:
```javascript
const { detectToxicity } = require('./pkg/helper/toxicityDetection');

// Test
(async () => {
    const result = await detectToxicity("Xin chào bạn");
    console.log(result); // { isToxic: false, ... }
    
    const toxic = await detectToxicity("địt mẹ mày");
    console.log(toxic); // { isToxic: true, ... }
})();
```

## Performance

- **Latency**: ~500-2000ms (tùy Hugging Face server)
- **Rate limit**: Free tier - 1000 requests/day
- **Fallback**: Instant (< 10ms) nếu dùng keywords

## Lưu ý quan trọng

1. **API Key bảo mật**: Không commit `.env` vào Git
2. **Rate limiting**: Free tier có giới hạn, nên implement caching nếu traffic cao
3. **Timeout**: API timeout sau 10 giây, sẽ fallback sang keywords
4. **Chỉ kiểm tra text**: Image, video, file không được kiểm tra
5. **Tiếng Việt có dấu**: Model hoạt động tốt nhất với tiếng Việt có dấu đúng

## Troubleshooting

### Lỗi: "Model is loading"
- Model đang khởi động trên Hugging Face (lần đầu)
- Đợi 10-20 giây và thử lại
- Hoặc sẽ tự động fallback sang keywords

### Lỗi: "Unauthorized"
- Kiểm tra `HUGGINGFACE_API_KEY` trong `.env`
- Đảm bảo token còn hiệu lực

### Lỗi: "Rate limit exceeded"
- Free tier đã hết quota
- Đợi 24h reset hoặc upgrade plan
- Tạm thời dùng fallback keywords

### False positives/negatives
- Điều chỉnh threshold (ngưỡng)
- Thêm từ khóa vào blacklist
- Thử model khác

## Support

- Hugging Face Docs: https://huggingface.co/docs/api-inference/
- ViHateT5 Model Card: https://huggingface.co/tarudesu/ViHateT5-base-V2
