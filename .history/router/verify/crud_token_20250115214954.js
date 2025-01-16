const fs = require("fs");
const path = require("path"); 
const filePath = path.join(__dirname, "token.json"); // Đường dẫn đến file JSON

const saveData = (data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  };