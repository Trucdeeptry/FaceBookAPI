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
  tokens = {
    ...tokens,
    ...newToken,
  };
  saveData(tokens);
};
const deleteToken = (targetToken) => {
  let tokens = loadData();

  // Chuyển object thành array các giá trị (mỗi phần tử là một token)
  const filteredTokens = Object.values(tokens).filter(
    (t) => t.token !== targetToken
  );

  // Nếu số lượng token không thay đổi, tức là không tìm thấy token cần xóa
  if (Object.values(tokens).length === filteredTokens.length) {
    console.log("Không tìm thấy người dùng!");
  } else {
    // Chuyển lại array thành object và lưu lại
    const newTokens = filteredTokens.reduce((acc, token) => {
      acc[token.email] = token; // Sử dụng email làm key để tái tạo object
      return acc;
    }, {});

    saveData(newTokens); // Lưu lại object mới
    console.log(`Người dùng có token ${targetToken} đã bị xóa!`);
  }
};

const isExistToken = (targetToken) => {
  const tokens = loadData();
  return Object.values(tokens).some((t) => t.token == targetToken);
};

module.exports = {
  loadData,
  addToken,
  deleteToken,
  isExistToken,
};
