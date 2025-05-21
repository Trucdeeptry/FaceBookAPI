import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function saveHashtagsToStorage() {
  try {
    // Gọi hàm SQL
    const { data, error } = await supabase.rpc('getall_hashtags');
    if (error) throw error;

    // Chuẩn bị dữ liệu
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    // Tải lên Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('hashtags-bucket')
      .upload('hashtags.json', blob, {
        contentType: 'application/json',
        upsert: true,
      });

    if (uploadError) throw uploadError;
    console.log('Tệp đã được tải lên:', uploadData);
  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

saveHashtagsToStorage();