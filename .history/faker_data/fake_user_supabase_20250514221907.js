const { faker } = require("@faker-js/faker");
const supabase = require("../router/composables/supabase.js");

// Hàm tạo user ảo bằng Admin API
async function createVirtualUser(email, password) {
  const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3cmRuYW1jdmp5dG5hc2h5aWx2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTczMzYyMywiZXhwIjoyMDYxMzA5NjIzfQ.9EmpW994jmzj9bGFUWaF2pgpe4Gn3GWzqAYAvb2PWgs'; // Lấy từ Supabase Dashboard > Settings > API
  const SUPABASE_URL = 'https://xwrdnamcvjytnashyilv.supabase.co';

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY, 
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi tạo user');
    }

    console.log('User ảo đã được tạo:', data);
    return data;
  } catch (error) {
    console.error('Lỗi:', error.message);
    return null;
  }
}

// // Gọi hàm để tạo user ảo
// for (let index = 0; index < 85; index++) {
//     createVirtualUser(`virtual_user@example.com${index}`, '9942994Ngoc');
// }


// Hàm tạo ngày sinh ngẫu nhiên từ 1990 đến 2010
function randomBirthday() {
  const start = new Date(1990, 0, 1);
  const end = new Date(2010, 11, 31);
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
}

// Hàm tạo gender ngẫu nhiên (1, 2, 3)
function randomGender() {
  return Math.floor(Math.random() * 3) + 1;
}

// Hàm lấy user_id từ email trong bảng auth.users
async function getUserIdByEmail(email) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (error || !data) {
    console.error(`Không tìm thấy user với email ${email}:`, error?.message);
    return null;
  }
  return data.id;
}

// Hàm tạo và chèn 85 bản ghi vào bảng profiles
async function insertVirtualProfiles() {
  const profiles = [];

  // Tạo dữ liệu cho 85 user
  for (let index = 0; index < 85; index++) {
    const email = `virtual_user@example.com${index}`;
    const user_id = await getUserIdByEmail(email);

    if (!user_id) {
      console.error(`Bỏ qua user với email ${email} vì không tìm thấy user_id`);
      continue;
    }

    profiles.push({
      email: email,
      birthday: randomBirthday(),
      gender: randomGender(),
      user_id: user_id,
      firstname: faker.person.firstName(),
      surname: faker.person.lastName(),
    });
  }

  // Chèn tất cả bản ghi vào bảng profiles
  const { data, error } = await supabase
    .from('profiles')
    .insert(profiles)
    .select();

  if (error) {
    console.error('Lỗi khi chèn dữ liệu:', error.message);
    return;
  }

  console.log('Đã chèn thành công:', data.length, 'bản ghi');
}

// Chạy hàm
// insertVirtualProfiles().catch(console.error);
getUserIdByEmail