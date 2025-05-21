const supabase = require("../router/composables/supabase.js");
const axios = require('axios');

async function createVirtualUser(email, password) {


  try {
    const response = await axios.post(
      `${SUPABASE_URL}/auth/v1/admin/users`,
      {
        email: email,
        password: password,
        email_confirm: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('User đã được tạo:', response.data);
    return response.data;
  } catch (error) {
    console.error('Lỗi:', error.response?.data?.message || error.message);
    throw error;
  }
}

createVirtualUser('virtual_user@example.com', 'secure_password123')
  .then(user => console.log('Thành công:', user))
  .catch(err => console.error('Thất bại:', err));