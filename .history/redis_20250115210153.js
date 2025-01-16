const redis = require("redis");

// Khởi tạo client Redis
const client = redis.createClient({
  host: "127.0.0.1", // Địa chỉ Redis server (thường là localhost)
  port: 6379, // Cổng mặc định của Redis
});

// Xử lý lỗi kết nối
client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

// Kiểm tra kết nối thành công
client.on("connect", () => {
  console.log("✅ Đã kết nối Redis thành công!");
});

module.exports = client; 
