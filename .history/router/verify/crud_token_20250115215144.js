const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "token.json"); // Đường dẫn đến file JSON

const loadData = () => {
  if (!fs.existsSync(filePath)) {
    return []; // Trả về mảng rỗng nếu file chưa tồn tại
  }
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData); // Chuyển từ JSON sang object
};
const addUser = (email, token) => {
  let users = loadData();
  const newUser = {
    id: users.length + 1, // Tạo ID tự động tăng
    name,
    email,
  };
  users.push(newUser);
  saveData(users);
  console.log("Người dùng mới đã được thêm!");
};
