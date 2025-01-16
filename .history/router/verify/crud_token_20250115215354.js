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

const addToken = (email, token) => {
  let token = loadData();
  const newToken = {
    id: token.length + 1, // Tạo ID tự động tăng
    email,
    token,
  };
  token.push(newToken);
  saveData(token);
};
const deleteToken= (token) => {
  let tokens = loadData();
  const filteredTokens = to.filter((user) => user.id !== userId);

  if (users.length === filteredUsers.length) {
    console.log("Không tìm thấy người dùng!");
  } else {
    saveData(filteredUsers);
    console.log(`Người dùng có ID ${userId} đã bị xóa!`);
  }
};
