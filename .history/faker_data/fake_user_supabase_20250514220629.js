
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

// Gọi hàm để tạo user ảo
for (let index = 0; index < 85; index++) {
    createVirtualUser('virtual_user@example.com', 'your_secure_password');
    
}
