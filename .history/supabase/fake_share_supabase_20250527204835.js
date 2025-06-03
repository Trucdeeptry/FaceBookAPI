const supabase = require("../router/composables/supabase.js");
// Hàm tạo timestamp ngẫu nhiên trong quá khứ
function randomPastDate(cre) {
  const start = new Date(2018, 0, 1).getTime()
  const end = new Date().getTime()
  const randomTime = new Date(start + Math.random() * (end - start))
  return randomTime.toISOString().slice(0, 19).replace('T', ' ')
}

// Hàm tạo dữ liệu share ngẫu nhiên
function generateShares(userIds, maxShares = 5, created_at) {
  const shares = []
  const numShares = Math.floor(Math.random() * maxShares) + 1
  const usedUserIds = new Set()

  while (shares.length < numShares) {
    const userId = userIds[Math.floor(Math.random() * userIds.length)]
    if (usedUserIds.has(userId)) continue
    usedUserIds.add(userId)

    shares.push({
      user_id: userId,
      shared_at: randomPastDate(created_at),
    })
  }
  console.log(shares);
  
  return shares
}

async function updatePostsShares() {
  // Lấy danh sách user_id từ bảng profiles
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('user_id')

  if (profilesError) {
    console.error('Lỗi lấy profiles:', profilesError)
    return
  }

  const userIds = profiles.map(p => p.user_id)

  // Lấy danh sách bài viết
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('created_at, id')

  if (postsError) {
    console.error('Lỗi lấy posts:', postsError)
    return
  }

  for (const post of posts) {
    const shares = generateShares(userIds, 50, post.created_at)

    const { error: updateError } = await supabase
      .from('posts')
      .update({ share: shares })
      .eq('id', post.id)

    if (updateError) {
      console.error(`Lỗi cập nhật post ${post.id}:`, updateError)
    } else {
      console.log(`✅ Đã cập nhật post ${post.id} với ${shares.length} shares`)
    }
  }
}

updatePostsShares()