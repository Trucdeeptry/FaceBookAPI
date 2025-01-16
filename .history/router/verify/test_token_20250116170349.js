const { loadData, addToken, deleteToken, isExistToken, isExistEmail } = require("./crud_token");

// 1. Thêm một token mới
addToken("user@example.com", "abcd1234");
console.log("After adding token:", loadData()); // Kiểm tra dữ liệu sau khi thêm token

// 2. Kiểm tra token có tồn tại không
const exists = isExistToken("abcd1234");
console.log("Is token 'abcd1234' exist?", exists); // Kiểm tra token đã tồn tại chưa

// 2. Kiểm tra token có tồn tại không
const exists = isExistToken("abcd1234");
console.log("Is token 'abcd1234' exist?", exists); // Kiểm tra token đã tồn tại chưa

// 3. Xóa token
deleteToken("abcd1234");
console.log("After deleting token:", loadData()); // Kiểm tra dữ liệu sau khi xóa token

// 4. Kiểm tra lại token đã bị xóa chưa
const existsAfterDelete = isExistToken("abcd1234");
console.log("Is token 'abcd1234' exist after delete?", existsAfterDelete); // Kiểm tra token sau khi xóa
