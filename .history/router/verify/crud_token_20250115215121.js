const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "token.json"); // Đường dẫn đến file JSON

const addUser = (name, email) => {
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
