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

const addToken= (email, token) => {
  let users = loadData();
  const newToken= {
    id: users.length + 1, // Tạo ID tự động tăng
    email,
    token,
  };
  users.push(newUser);
  saveData(users);
  console.log("Người dùng mới đã được thêm!");
};
const deleteUser = (userId) => {
    let users = loadData();
    const filteredUsers = users.filter((user) => user.id !== userId);
    
    if (users.length === filteredUsers.length) {
      console.log("Không tìm thấy người dùng!");
    } else {
      saveData(filteredUsers);
      console.log(`Người dùng có ID ${userId} đã bị xóa!`);
    }
  };