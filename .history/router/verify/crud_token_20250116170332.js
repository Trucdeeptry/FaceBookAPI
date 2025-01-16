const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "token.json"); // Đường dẫn đến file JSON

const saveData = (data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};
const loadData = () => {
  if (!fs.existsSync(filePath)) {
    return []; // Trả về mảng rỗng nếu file chưa tồn tại
  }
  const rawData = fs.readFileSync(filePath, "utf8");
  return JSON.parse(rawData); // Chuyển từ JSON sang object
};

const addToken = (email, token) => {
  let tokens = loadData();
  const newToken = {
    id: token.length + 1, // Tạo ID tự động tăng
    email,
    token,
  };
  tokens.push(newToken);
  saveData(tokens);
};
const deleteToken = (targetToken) => {
  let tokens = loadData();
  const filteredTokens = tokens.filter((t) => t.token !== targetToken);

  if (tokens.length === filteredTokens.length) {
    console.log("Không tìm thấy người dùng!");
  } else {
    saveData(filteredTokens);
    console.log(`Người dùng có ID ${targetToken} đã bị xóa!`);
  }
};

const isExistToken = (targetToken) => {
  const tokens = loadData();
  return Object.values(tokens).some((t) => t.token == targetToken);
};
const isExistEmail = (targetEmail) => {
  const data = loadData();
  return Object.values(data).some((t) => t.email == targetEmail);
};

module.exports = {
  loadData,
  addToken,
  deleteToken,
  isExistToken,
};
