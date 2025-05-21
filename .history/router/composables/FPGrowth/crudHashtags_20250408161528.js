const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "hashtags.json"); // Đường dẫn đến file JSON

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