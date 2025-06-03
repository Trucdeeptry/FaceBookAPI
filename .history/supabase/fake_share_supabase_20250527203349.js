const supabase = require("../router/composables/supabase.js");
// Hàm tạo timestamp ngẫu nhiên trong quá khứ
function randomPastDate() {
  const start = new Date(2018, 0, 1).getTime()
  const end = new Date().getTime()
  const randomTime = new Date(start + Math.random() * (end - start))
  return randomTime.toISOString().slice(0, 19).replace('T', ' ')
}