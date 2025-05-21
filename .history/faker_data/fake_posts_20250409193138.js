const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
faker.locale = "vi";
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function generateLikes(count, usersCollection) {
  const likedBy = [];
  const users = await usersCollection.find().toArray(); // Lấy tất cả người dùng

  const reactionTypes = ["like", "heart", "haha", "wow", "sad", "angry"];

  while (likedBy.length < count && likedBy.length < users.length) {
    const randomUser = users[randomIntFromInterval(0, users.length - 1)]._id;

    // Kiểm tra xem user này đã được thêm chưa (dựa vào user_id)
    const alreadyLiked = likedBy.some(
      (item) => item.user_id.toString() === randomUser.toString()
    );

    if (!alreadyLiked) {
      likedBy.push({
        type: reactionTypes[randomIntFromInterval(0, reactionTypes.length - 1)],
        user_id: randomUser,
      });
    }
  }

  return likedBy;
}

const meaningfulSentences = {
  Travel: [
    "Đà Nẵng chill phết, đi là mê luôn!",
    "Hội An xịn quá, hòa mình vào thiên nhiên là hết sảy!",
    "Sa Pa đỉnh cao, khám phá cảnh đẹp muốn xỉu!",
    "Huế chill chill, văn hóa độc lạ cuốn hút vãi!",
    "Nha Trang biển đẹp dã man, tắm xong không muốn về!",
    "Đi du lịch Việt Nam mới thấy văn hóa đỉnh thế nào!",
    "Sài Gòn ăn đồ phố ngon phát khóc luôn á!",
    "Dạo phố cổ mà cứ ngỡ lạc vào phim xưa!",
    "Miền Bắc yên bình, chill như ở nhà quê vậy!",
    "Hà Nội đi di tích lịch sử, cảm giác như chạm vào quá khứ!",
    "Núi rừng mát rượi, hít hà đã đời!",
    "Cảnh thiên nhiên đẹp mê hồn, khám phá không chán!",
    "Sống kiểu local qua mấy câu chuyện đời thường, thú vị vãi!",
    "Đi du lịch là cách mở rộng tầm mắt siêu xịn!",
    "Gió biển mát lạnh, đứng hoài không chán!",
    "Sờ vào di tích cổ mà cảm giác lịch sử ùa về!",
    "Đi du lịch xong tìm lại được vibe của chính mình!",
    "Lễ hội truyền thống đỉnh cao, học văn hóa mà vui!",
    "Du lịch không chỉ nghỉ mà còn học được bao điều hay!",
    "Mỗi chuyến đi là một kỷ niệm để đời, nhớ mãi luôn!",
  ],
  Food: [
    "Ẩm thực Việt Nam ngon xỉu, độc lạ hết nấc!",
    "Phở là huyền thoại, ăn là ghiền luôn!",
    "Bún chả ngon quên lối về, thử đi mà xem!",
    "Rau sống tươi rói, ăn là mê tít!",
    "Đồ ăn đường phố lúc nào cũng bất ngờ, đỉnh lắm!",
    "Mỗi món ăn là một câu chuyện, chill phết!",
    "Thử đồ truyền thống đi, ngon phát khóc!",
    "Hương vị các miền hòa quyện, ăn là nhớ mãi!",
    "Đặc sản chỗ nào cũng chất, văn hóa đầy mình!",
    "Ẩm thực không chỉ là ăn, mà là nghệ thuật luôn!",
    "Món miền Trung đậm đà, ăn một lần là nhớ đời!",
    "Cũ mà mới, hương vị lạ ghê!",
    "Ẩm thực là cầu nối siêu xịn giữa người với người!",
    "Mỗi bữa ăn là dịp quây quần, ấm áp vãi!",
    "Ăn ngon là auto vui, cải thiện mood liền!",
    "Đồ ăn ngon chạm thẳng vào tim, không đùa đâu!",
    "Trình bày món ăn xịn sò, đúng chất nghệ thuật!",
    "Đi ăn đường phố là có trải nghiệm mới liền!",
    "Hương vị món ăn làm tim rung rinh luôn á!",
    "Ẩm thực là sáng tạo đỉnh cao, không ngừng nghỉ!",
  ],
  Technology: [
    "Công nghệ xịn quá, thay đổi đời sống luôn!",
    "Đồ smart giờ đâu cũng thấy, cool phết!",
    "Internet nối cả thế giới, đỉnh thật!",
    "AI mở ra bao cơ hội, ngầu hết nấc!",
    "Công nghệ làm việc nhanh hơn, chill luôn!",
    "Mỗi ngày lại có phát minh mới, xịn vãi!",
    "Công nghệ lên đời, tiện ích ngập tràn!",
    "Thế giới số phát triển điên đảo luôn á!",
    "Giao tiếp kiểu mới nhờ công nghệ, đỉnh ghê!",
    "App xài trên điện thoại tiện muốn xỉu!",
    "Thực tế ảo chơi là mê, lạ lắm!",
    "Blockchain là tương lai, ngầu hết chỗ nói!",
    "Công nghệ cải tiến liên tục, phục vụ max đỉnh!",
    "Máy tính, điện thoại là bằng chứng công nghệ đỉnh cao!",
    "Kỹ thuật số mở cửa tương lai, xịn thật!",
    "Internet vạn vật kết nối mọi thứ, cool vãi!",
    "Công nghệ số hóa làm kinh tế bùng nổ luôn!",
    "Robot, drone phát triển vượt xa, ngầu quá!",
    "Sáng tạo công nghệ là động lực đỉnh cao!",
    "Công nghệ không chỉ giúp mình mà còn giúp cả thế giới!",
  ],
  Education: [
    "Học hành là chìa khóa mở tương lai, xịn lắm!",
    "Mỗi bài học là một bước gần tri thức hơn, cool ghê!",
    "Giáo dục không chỉ dạy kiến thức mà còn rèn người, đỉnh!",
    "Học cả đời là vibe của thời đại mới!",
    "Sáng tạo trong học giúp tụi nhỏ phát triển max luôn!",
    "Thầy cô truyền cảm hứng, ngầu hết chỗ nói!",
    "Học không chỉ ở trường, ngoài đời cũng chất!",
    "Công nghệ đổi cách dạy, hiện đại xỉu luôn!",
    "Gen Z cần kiến thức để tự tin bước đi, xịn ghê!",
    "Học là cơ hội cho tất cả, đỉnh thật!",
    "Học hành là chuyến đi không bao giờ hết, chill lắm!",
    "Giáo dục là nền tảng cho xã hội lên level!",
    "Kiên trì học là key để thành công, ngầu vãi!",
    "Học giúp mình nhận ra giá trị bản thân, xịn quá!",
    "Dạy kiểu mới hiệu quả dã man luôn á!",
    "Học qua trải nghiệm là đỉnh nhất, thử đi!",
    "Giáo dục khơi vibe đam mê, thích ghê!",
    "Đi học mỗi ngày là một chuyến phiêu lưu, cool phết!",
    "Học không chỉ là sách, mà là cả thế giới!",
    "Tương lai đất nước nhờ giáo dục mà lên luôn!",
  ],
  Fashion: [
    "Thời trang là cách thể hiện style riêng, chất lắm!",
    "Trend thay đổi theo mùa, cool vãi!",
    "Đồ đẹp là tự tin lên hẳn, xịn ghê!",
    "Thời trang không chỉ là đồ, mà là nghệ thuật luôn!",
    "Mỗi bộ sưu tập là dấu ấn riêng, đỉnh cao!",
    "Style thời trang thể hiện cá tính, ngầu hết nấc!",
    "Phối đồ tinh tế là key của fashion, xịn thật!",
    "Thời trang luôn biết cách nổi bật, chill phết!",
    "Đồ đẹp làm mood lên luôn, thích ghê!",
    "Thời trang là sáng tạo không ngừng, đỉnh vãi!",
    "Mỗi trend là một câu chuyện, cool lắm!",
    "Cổ điển mix hiện đại, đẹp lạ luôn á!",
    "Thời trang là cách thể hiện cái tôi, xịn sò!",
    "Style độc là thương hiệu riêng, ngầu quá!",
    "Đồ đẹp truyền cảm hứng, thích mê!",
    "Thời trang không chỉ là mặc, mà là sống luôn!",
    "Nhà thiết kế lấy vibe từ đời, đỉnh thật!",
    "Thời trang nối nghệ thuật với đời sống, cool ghê!",
    "Đồ xịn giúp mình nổi bần bật giữa đám đông!",
    "Thời trang là đổi mới liên tục, ngầu vãi!",
  ],
  Sport: [
    "Thể thao là cách chill mà khỏe, đỉnh ghê!",
    "Trận đấu nào cũng hype, phấn khích vãi!",
    "Chơi thể thao là vibe teamwork max luôn!",
    "Mỗi trận là cơ hội khoe bản thân, cool lắm!",
    "Tinh thần chiến là hồn của thể thao, ngầu hết nấc!",
    "Thể thao rèn kiên nhẫn, quyết tâm, xịn thật!",
    "Cố lên là có thưởng, thể thao đỉnh cao!",
    "Thể thao truyền cảm hứng, thích mê!",
    "Tập thể thao khỏe người, xịn vãi!",
    "Chơi thể thao vừa khỏe vừa vui, chill phết!",
    "Trận đấu kịch tính làm tim đập thình thịch luôn!",
    "Fair-play là vibe đẹp nhất của thể thao!",
    "Thể thao là nơi cạnh tranh chất lượng, ngầu ghê!",
    "Hype của thể thao làm đời vui hơn, đỉnh thật!",
    "Thể thao giúp vượt giới hạn, xịn sò!",
    "Tập đều là thể lực lên level, cool vãi!",
    "Thể thao khơi đam mê, nóng bỏng luôn á!",
    "Bền bỉ trong thể thao là đỉnh của cố gắng!",
    "Thể thao là vui và thử thách không ngừng, thích ghê!",
    "Thể thao không chỉ khỏe người mà còn khỏe tinh thần!",
  ],
  Music: [
    "Nhạc chạm vào hồn, cảm xúc dâng trào luôn!",
    "Giai điệu chill làm tim rung rinh, thích ghê!",
    "Âm nhạc là tiếng nói chung, đỉnh vãi!",
    "Mỗi bài hát là một câu chuyện, cool lắm!",
    "Nhạc hòa quyện là bản giao hưởng xịn sò!",
    "Nhạc làm dịu lòng, chill phết luôn á!",
    "Piano nhẹ nhàng, nghe là relax liền!",
    "Nhạc cụ truyền thống chất văn hóa, ngầu ghê!",
    "Nhạc nối tâm hồn, cảm xúc bùng nổ!",
    "Bài hát hay làm sống lại ký ức, xịn thật!",
    "Nhạc là vibe sáng tạo, đỉnh cao luôn!",
    "Giai điệu sôi động làm không khí bốc cháy!",
    "Nhạc không chỉ vui mà còn chữa lành, cool vãi!",
    "Nhạc sĩ sáng tạo giai điệu mới, ngầu hết nấc!",
    "Nhạc vượt mọi giới hạn, xịn sò!",
    "Nhạc mang niềm vui, cảm hứng cho đời!",
    "Bài hát hay là thuốc cho tâm hồn, chill lắm!",
    "Nhạc nối mọi người khắp thế giới, đỉnh thật!",
    "Mỗi nốt nhạc là cảm xúc thật, thích mê!",
    "Nhạc là nghệ thuật đỉnh cao của cảm xúc!",
  ],
  Health: [
    "Sức khỏe là vàng, quý hơn mọi thứ luôn!",
    "Chăm sức khỏe sớm là sống chất hơn, xịn ghê!",
    "Ăn lành mạnh là key khỏe mạnh, cool lắm!",
    "Tập thể dục đều, người khỏe như siêu nhân!",
    "Khỏe là làm việc ngon ơ, đỉnh vãi!",
    "Ngủ đủ là bí kíp khỏe đẹp, ngầu ghê!",
    "Tâm khỏe cũng quan trọng như thân, xịn thật!",
    "Chăm mình để sống vui, năng lượng ngập tràn!",
    "Sức khỏe là nền tảng cho đời chill, đỉnh cao!",
    "Thói quen tốt giữ sức khỏe bền lâu, cool vãi!",
    "Khỏe là bước đầu thành công, ngầu hết nấc!",
    "Lắng nghe cơ thể, chăm mình là number one!",
    "Khỏe để vượt mọi drama, xịn sò!",
    "Giữ sức khỏe là giữ hạnh phúc gia đình, chill phết!",
    "Cân bằng nghỉ và làm là bí kíp khỏe, đỉnh thật!",
    "Sức khỏe là hành trình, không phải đích, cool lắm!",
    "Chăm sức khỏe là đầu tư dài hạn, ngầu ghê!",
    "Khỏe là tự tin đối mặt mọi thứ, xịn vãi!",
    "Sống lành mạnh để khỏe mãi, đỉnh cao!",
    "Sức khỏe là tất cả để đời trọn vẹn!",
  ],
  Business: [
    "Kinh doanh cần sáng tạo và bản lĩnh, ngầu vãi!",
    "Khởi nghiệp là chuyến đi đầy drama và cơ hội!",
    "Hiểu thị trường là key thắng lớn, xịn ghê!",
    "Chiến lược đỉnh là nền tảng lên level, cool lắm!",
    "Linh hoạt, đổi mới là bí kíp kinh doanh, đỉnh thật!",
    "Kinh doanh không chỉ tiền, mà là tầm nhìn, xịn sò!",
    "Tinh thần doanh nhân vượt mọi khó khăn, ngầu hết nấc!",
    "Kinh doanh là nghệ thuật, chất vãi luôn!",
    "Thị trường đầy cơ hội cho ai dám chơi, đỉnh cao!",
    "Kiên trì là key thành công kinh doanh, cool ghê!",
    "Doanh nghiệp mạnh nhờ teamwork, xịn thật!",
    "Đầu tư đúng là bước ngoặt, ngầu vãi!",
    "Nghe khách hàng là cách kinh doanh đỉnh, chill phết!",
    "Đổi mới liên tục để doanh nghiệp lên luôn, xịn sò!",
    "Kinh doanh là học không ngừng, đỉnh cao!",
    "Tầm nhìn xa dẫn doanh nghiệp tới đỉnh, cool lắm!",
    "Kinh doanh là mix trí tuệ và cảm xúc, ngầu ghê!",
    "Bền bỉ là chìa khóa thành công, xịn thật!",
    "Thất bại là bài học, kinh doanh đỉnh vãi!",
    "Kinh doanh tạo giá trị cho đời, ngầu hết nấc!",
  ],
  Entertainment: [
    "Giải trí là cách xả stress đỉnh cao, chill lắm!",
    "Tối chill với bạn bè, vui quên lối về!",
    "Giải trí làm năng lượng lên max, xịn ghê!",
    "Nhạc với phim là combo giải trí đỉnh, cool vãi!",
    "Giải trí mang vui vẻ, thư giãn hết nấc!",
    "Thế giới giải trí đầy màu, sáng tạo vãi luôn!",
    "Giải trí là nghệ thuật sống chill, đỉnh thật!",
    "Mỗi show giải trí là một câu chuyện chất, ngầu ghê!",
    "Giải trí làm quên hết lo toan, xịn sò!",
    "Nghệ sĩ mang tiếng cười, vui phát khóc!",
    "Giải trí là thuốc tinh thần, chill phết luôn!",
    "Sự kiện giải trí để lại kỷ niệm đỉnh, cool lắm!",
    "Giải trí không chỉ xem mà còn cảm, xịn vãi!",
    "Show giải trí làm khán giả mê mẩn, ngầu hết nấc!",
    "Giải trí thổi bay áp lực, đỉnh cao!",
    "Sáng tạo trong giải trí là trải nghiệm mới, xịn thật!",
    "Giải trí truyền cảm hứng cho cả nghệ sĩ lẫn fan, cool ghê!",
    "Thế giới giải trí mở cửa niềm vui, đỉnh vãi!",
    "Giải trí là đam mê của bao người, ngầu ghê!",
    "Giải trí làm đời phong phú, gắn kết mọi người!",
  ],
};
const topicHashtags = {
  Travel: [
    "#dulich",
    "#travel",
    "#explore",
    "#adventure",
    "#vacation",
    "#trip",
    "#journey",
    "#wanderlust",
    "#travelgram",
    "#discover",
    "#tour",
    "#travelphotography",
    "#travelblog",
    "#destination",
    "#roadtrip",
    "#nature",
    "#landscape",
    "#instatravel",
    "#traveling",
    "#holiday",
  ],
  Food: [
    "#amthuc",
    "#food",
    "#delicious",
    "#chef",
    "#foodie",
    "#yum",
    "#cooking",
    "#recipe",
    "#foodphotography",
    "#tasty",
    "#gourmet",
    "#instafood",
    "#homemade",
    "#dinner",
    "#lunch",
    "#breakfast",
    "#foodlover",
    "#healthyfood",
    "#foodstagram",
    "#eatwell",
  ],
  Technology: [
    "#congnghe",
    "#tech",
    "#innovation",
    "#future",
    "#gadgets",
    "#technology",
    "#technews",
    "#programming",
    "#coding",
    "#startup",
    "#software",
    "#hardware",
    "#digital",
    "#ai",
    "#machinelearning",
    "#techlife",
    "#cyber",
    "#robotics",
    "#electronics",
    "#it",
  ],
  Education: [
    "#giaoduc",
    "#learning",
    "#knowledge",
    "#study",
    "#education",
    "#student",
    "#teach",
    "#school",
    "#university",
    "#classroom",
    "#studymotivation",
    "#edtech",
    "#learningneverstops",
    "#academic",
    "#read",
    "#studying",
    "#elearning",
    "#literacy",
    "#inspiration",
    "#educationforall",
  ],
  Fashion: [
    "#thoitrang",
    "#fashion",
    "#style",
    "#trend",
    "#fashionista",
    "#outfitoftheday",
    "#fashionblogger",
    "#streetstyle",
    "#designer",
    "#runway",
    "#instafashion",
    "#fashionstyle",
    "#glamour",
    "#chic",
    "#fashionweek",
    "#accessories",
    "#ootd",
    "#fashiongram",
    "#styleinspo",
    "#trendy",
  ],
  Sport: [
    "#thethao",
    "#sports",
    "#fitness",
    "#game",
    "#athlete",
    "#workout",
    "#sportslife",
    "#training",
    "#competition",
    "#sport",
    "#exercise",
    "#fit",
    "#motivation",
    "#active",
    "#health",
    "#running",
    "#soccer",
    "#basketball",
    "#football",
    "#win",
  ],
  Music: [
    "#amnhac",
    "#music",
    "#song",
    "#melody",
    "#musician",
    "#instamusic",
    "#concert",
    "#live",
    "#singing",
    "#band",
    "#musiclover",
    "#pop",
    "#rock",
    "#hiphop",
    "#jazz",
    "#classical",
    "#sound",
    "#musiclife",
    "#playlist",
    "#lyrics",
  ],
  Health: [
    "#suckhoe",
    "#health",
    "#wellness",
    "#lifestyle",
    "#fitness",
    "#healthyliving",
    "#nutrition",
    "#selfcare",
    "#mindfulness",
    "#exercise",
    "#wellbeing",
    "#meditation",
    "#workout",
    "#healthtips",
    "#cleaneating",
    "#mentalhealth",
    "#active",
    "#wellnessjourney",
    "#healthcare",
    "#fitlife",
  ],
  Business: [
    "#kinhdoanh",
    "#business",
    "#entrepreneur",
    "#startup",
    "#success",
    "#marketing",
    "#leadership",
    "#strategy",
    "#innovation",
    "#growth",
    "#investment",
    "#management",
    "#sales",
    "#hustle",
    "#motivation",
    "#smallbusiness",
    "#businessowner",
    "#enterprise",
    "#finance",
    "#biz",
  ],
  Entertainment: [
    "#giaitri",
    "#entertainment",
    "#fun",
    "#relax",
    "#movies",
    "#music",
    "#comedy",
    "#party",
    "#celebrities",
    "#tvshow",
    "#amusement",
    "#funny",
    "#event",
    "#theater",
    "#festival",
    "#leisure",
    "#popculture",
    "#gaming",
    "#hobby",
    "#joy",
  ],
};
async function getRandomImg(topic) {
  const length = 50;
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${topic}&per_page=${length}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "tzmVzX3VKCkvo6BNji6X9Nh8FRBKJtwu2nI3KFwfkmzmYVJVdo0GibUU",
      },
    }
  );
  const data = await response.json();
  const img = data.photos[randomIntFromInterval(1, length - 1)].src.original;
  return img;
}
function getRandomHashtags(topic) {
  // Lấy danh sách hashtag cho chủ đề đó
  const hashtags = topicHashtags[topic];
  const count = randomIntFromInterval(1, hashtags.length - 10);

  const shuffled = [...hashtags];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  // Lấy ra count hashtag đầu tiên
  return shuffled.slice(0, count);
}

const topics = {
  Travel: {
    image: () => getRandomImg("Travel"), // ảnh thiên nhiên phù hợp với chủ đề Travel
    content: meaningfulSentences["Travel"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Travel"),
  },
  Food: {
    image: () => getRandomImg("Food"), // ảnh Food
    content: meaningfulSentences["Food"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Food"),
  },
  Technology: {
    image: () => getRandomImg("Technology"), // ảnh kỹ thuật, Technology
    content: meaningfulSentences["Technology"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Technology"),
  },
  Education: {
    image: () => getRandomImg("Education"), // ảnh trừu tượng có thể dùng cho Education
    content: meaningfulSentences["Education"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Education"),
  },
  Fashion: {
    image: () => getRandomImg("Fashion"), // ảnh thời trang
    content: meaningfulSentences["Fashion"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Fashion"),
  },
  Sport: {
    image: () => getRandomImg("Sport"), // ảnh Sport
    content: meaningfulSentences["Sport"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Sport"),
  },
  Music: {
    image: () => getRandomImg("Music"), // sử dụng ảnh trừu tượng làm đại diện cho Music
    content: meaningfulSentences["Music"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Music"),
  },
  Health: {
    theme: "",
    image: () => getRandomImg("Health"), // ảnh con người có thể tượng trưng cho Health
    content: meaningfulSentences["Health"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Health"),
  },
  {
    theme: "Business",
    image: () => getRandomImg("Business"), // ảnh Business
    content: meaningfulSentences["Business"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Business"),
  },
  {
    theme: "Entertainment",
    image: () => getRandomImg("Entertainment"), // ảnh trừu tượng cho chủ đề Entertainment
    content: meaningfulSentences["Entertainment"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Entertainment"),
  },
};
const topicCorrelationMatrix = {
  Travel: {
    Travel: 1.0,
    Food: 0.7,
    Technology: 0.2,
    Education: 0.3,
    Fashion: 0.2,
    Sport: 0.3,
    Music: 0.4,
    Health: 0.4,
    Business: 0.5,
    Entertainment: 0.6,
  },
  Food: {
    Travel: 0.7,
    Food: 1.0,
    Technology: 0.2,
    Education: 0.3,
    Fashion: 0.3,
    Sport: 0.2,
    Music: 0.4,
    Health: 0.6,
    Business: 0.4,
    Entertainment: 0.5,
  },
  Technology: {
    Travel: 0.2,
    Food: 0.2,
    Technology: 1.0,
    Education: 0.6,
    Fashion: 0.4,
    Sport: 0.3,
    Music: 0.4,
    Health: 0.3,
    Business: 0.7,
    Entertainment: 0.5,
  },
  Education: {
    Travel: 0.3,
    Food: 0.3,
    Technology: 0.6,
    Education: 1.0,
    Fashion: 0.2,
    Sport: 0.3,
    Music: 0.3,
    Health: 0.5,
    Business: 0.5,
    Entertainment: 0.3,
  },
  Fashion: {
    Travel: 0.2,
    Food: 0.3,
    Technology: 0.4,
    Education: 0.2,
    Fashion: 1.0,
    Sport: 0.2,
    Music: 0.5,
    Health: 0.3,
    Business: 0.4,
    Entertainment: 0.6,
  },
  Sport: {
    Travel: 0.3,
    Food: 0.2,
    Technology: 0.3,
    Education: 0.3,
    Fashion: 0.2,
    Sport: 1.0,
    Music: 0.4,
    Health: 0.7,
    Business: 0.4,
    Entertainment: 0.5,
  },
  Music: {
    Travel: 0.4,
    Food: 0.4,
    Technology: 0.4,
    Education: 0.3,
    Fashion: 0.5,
    Sport: 0.4,
    Music: 1.0,
    Health: 0.3,
    Business: 0.4,
    Entertainment: 0.8,
  },
  Health: {
    Travel: 0.4,
    Food: 0.6,
    Technology: 0.3,
    Education: 0.5,
    Fashion: 0.3,
    Sport: 0.7,
    Music: 0.3,
    Health: 1.0,
    Business: 0.4,
    Entertainment: 0.3,
  },
  Business: {
    Travel: 0.5,
    Food: 0.4,
    Technology: 0.7,
    Education: 0.5,
    Fashion: 0.4,
    Sport: 0.4,
    Music: 0.4,
    Health: 0.4,
    Business: 1.0,
    Entertainment: 0.5,
  },
  Entertainment: {
    Travel: 0.6,
    Food: 0.5,
    Technology: 0.5,
    Education: 0.3,
    Fashion: 0.6,
    Sport: 0.5,
    Music: 0.8,
    Health: 0.3,
    Business: 0.5,
    Entertainment: 1.0,
  },
};
function weightedRandomChoice(map, excludeKeys = []) {
  const entries = Object.entries(map).filter(([k]) => !excludeKeys.includes(k));
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [key, weight] of entries) {
    if (r < weight) return key;
    r -= weight;
  }
  return null;
}

function pickRelatedTopics(primaryKey, count) {
  const relatedMap = topicCorrelationMatrix[primaryKey];
  if (!relatedMap) return [];

  const selected = new Set();
  while (selected.size < count) {
    const pick = weightedRandomChoice(relatedMap, [primaryKey, ...selected]);
    if (!pick) break;
    selected.add(pick);
  }
  
  return Array.from(selected);
}
async function seedPosts() {
  const uri =
    "mongodb+srv://phantruc438:9942994@cluster0.ccy43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected correctly to server");

    const db = client.db("FaceBookDB");
    const usersCollection = db.collection("users");
    const postsCollection = db.collection("posts");

    let postsData = [];
    for (let i = 0; i < 50; i++) {
      // Tạo 20 bài viết
      const topic = topics[randomIntFromInterval(0, topics.length - 1)];
      const relateTopics = pickRelatedTopics(
        topic.theme,
        randomIntFromInterval(1, 4)
      );

      const users = await usersCollection.find().toArray(); // Lấy danh sách người dùng
      const authorId = users[randomIntFromInterval(0, users.length - 1)]._id; // Lấy ngẫu nhiên authorId từ users
      const likesCount = randomIntFromInterval(0, 8); // Số lượt thích ngẫu nhiên từ 0 đến 80
      let post = {
        user_id: authorId,
        hashtags: topic.hashtags,
        content: topic.content, // Nội dung bài viết
        image: await topic.image(), // Hình ảnh (có thể là null hoặc rỗng nếu không cần)
        liked_by: await generateLikes(likesCount, usersCollection), // Danh sách người đã thích
        created_at: faker.date.past(), // Thời gian tạo bài viết
      };
      postsData.push(post);
    }

    await postsCollection.insertMany(postsData);
    console.log("Database seeded with synthetic posts data! :)");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

seedPosts();
