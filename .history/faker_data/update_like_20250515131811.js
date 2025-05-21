import pandas as pd
from supabase import create_client, Client

# Kết nối Supabase
url = 'https://YOUR_PROJECT_ID.supabase.co'
key = 'YOUR_ANON_OR_SERVICE_ROLE_KEY'
supabase: Client = create_client(url, key)

# Đọc file Excel
df = pd.read_excel("duongdan_toi_file.xlsx")  # thay đường dẫn cho đúng

for index, row in df.iterrows():
    firstname = row['firstname']
    surname = row['surname']
    gender = int(row['Gender'])
    birthday = pd.to_datetime(row['birthday']).strftime('%Y-%m-%d')
    country = row['Country']
    
    # Parse hashtags từ chuỗi thành list
    hashtags = eval(row['SuggestedHashtags'])  # ['#fashiongoals', '#art', ...]

    # 1. Insert vào bảng profiles
    response = supabase.table('profiles').insert({
        'firstname': firstname,
        'surname': surname,
        'gender': gender,
        'birthday': birthday,
        'country': country
    }).execute()
    
    user_id = response.data[0]['id']  # Lấy id của người dùng vừa thêm

    # 2. Lấy các post có hashtag trùng
    posts = supabase.table('posts').select('*').execute().data
    for post in posts:
        post_id = post['id']
        post_hashtags = post['hashtags']
        post_likes = post.get('likes') or []

        # Nếu có ít nhất 1 hashtag trùng
        if any(tag in hashtags for tag in post_hashtags):
            if user_id not in post_likes:
                post_likes.append(user_id)
                # 3. Update likes
                supabase.table('posts').update({
                    'likes': post_likes
                }).eq('id', post_id).execute()
