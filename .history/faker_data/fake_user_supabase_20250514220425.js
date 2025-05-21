import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client (chỉ để tham khảo, không dùng trực tiếp cho Admin API)
const supabase = createClient('https://<YOUR_PROJECT_REF>.supabase.co', '<YOUR_PUBLIC_ANON_KEY>');

// Hàm tạo user ảo bằng Admin API
async function createVirtualUser(email, password) {
  const SERVICE_ROLE_KEY = '<YOUR_SERVICE_ROLE_KEY>'; // Lấy từ Supabase Dashboard > Settings > API
  const SUPABASE_URL = 'https://<YOUR_PROJECT_REF>.supabase.co';

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY, // Service Role Key cũng cần cho header apikey
      },
      body: JSON.stringify({
        email: email,
        password: password,
        email_confirm: true, // Tự động xác nhận email
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

// Gọi hàm để tạo user ảo
createVirtualUser('virtual_user@example.com', 'your_secure_password');