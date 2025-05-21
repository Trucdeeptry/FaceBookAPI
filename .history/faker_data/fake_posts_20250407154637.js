const { faker } = require("@faker-js/faker");
const MongoClient = require("mongodb").MongoClient;
faker.locale = "vi";
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Tạo danh sách người đã thích bài viết
async function generateLikes(count, usersCollection) {
  const likedBy = [];
  const users = await usersCollection.find().toArray(); // Lấy tất cả người dùng từ bảng users
  const randomUsers = [];

  // Chọn ngẫu nhiên những người dùng chưa có trong likedBy
  while (likedBy.length < count) {
    const randomUser = users[randomIntFromInterval(0, users.length - 1)]._id;
    if (!likedBy.includes(randomUser)) {
      likedBy.push(randomUser);
    }
  }

  // Trả về danh sách id người thích bài viết
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
    "Ẩm thực là sáng tạo đỉnh cao, không ngừng nghỉ!"
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
    "Công nghệ không chỉ giúp mình mà còn giúp cả thế giới!"
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
    "Tương lai đất nước nhờ giáo dục mà lên luôn!"
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
    "Thời trang là đổi mới liên tục, ngầu vãi!"
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
    "Thể thao không chỉ khỏe người mà còn khỏe tinh thần!"
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
    "Nhạc là nghệ thuật đỉnh cao của cảm xúc!"
  ],
  Health: [
    "Sức khỏe là tài sản quý giá nhất của con người.",
    "Chăm sóc sức khỏe từ sớm giúp cuộc sống thêm ý nghĩa.",
    "Ăn uống lành mạnh là chìa khóa của sức khỏe.",
    "Tập thể dục thường xuyên giúp cơ thể luôn khỏe mạnh.",
    "Sức khỏe tốt giúp bạn làm việc hiệu quả hơn.",
    "Giấc ngủ đủ giấc là yếu tố quan trọng của sức khỏe.",
    "Sức khỏe tâm thần cũng quan trọng không kém sức khỏe thể chất.",
    "Chăm sóc sức khỏe giúp bạn sống vui vẻ và tràn đầy năng lượng.",
    "Sức khỏe là nền tảng của một cuộc sống hạnh phúc.",
    "Thói quen lành mạnh giúp duy trì sức khỏe lâu dài.",
    "Sức khỏe là yếu tố quan trọng để đạt được thành công.",
    "Hãy luôn lắng nghe cơ thể và chăm sóc bản thân.",
    "Sức khỏe tốt giúp bạn vượt qua những thử thách của cuộc sống.",
    "Giữ gìn sức khỏe không chỉ vì bản thân mà còn vì gia đình.",
    "Sự cân bằng giữa công việc và nghỉ ngơi là chìa khóa của sức khỏe.",
    "Sức khỏe không phải là đích đến mà là hành trình.",
    "Chăm sóc sức khỏe là đầu tư cho tương lai.",
    "Sức khỏe tốt giúp bạn tự tin đối mặt với mọi thử thách.",
    "Hãy duy trì lối sống lành mạnh để có sức khỏe tốt.",
    "Sức khỏe là nền tảng của một cuộc sống trọn vẹn.",
  ],
  Business: [
    "Kinh doanh đòi hỏi sự sáng tạo và quyết tâm.",
    "Khởi nghiệp là hành trình đầy thử thách và cơ hội.",
    "Kinh doanh thành công dựa trên sự hiểu biết thị trường.",
    "Một chiến lược kinh doanh tốt là nền tảng của sự phát triển.",
    "Sự linh hoạt và đổi mới là chìa khóa của kinh doanh.",
    "Kinh doanh không chỉ là về lợi nhuận mà còn là về tầm nhìn.",
    "Tinh thần doanh nhân giúp vượt qua khó khăn.",
    "Kinh doanh là nghệ thuật quản lý và sáng tạo.",
    "Thị trường luôn mở ra những cơ hội mới cho những người dám thử sức.",
    "Kinh doanh đòi hỏi sự kiên trì và nỗ lực không ngừng.",
    "Một doanh nghiệp thành công cần sự đoàn kết và đồng lòng.",
    "Đầu tư đúng hướng là yếu tố then chốt trong kinh doanh.",
    "Kinh doanh hiệu quả cần biết lắng nghe khách hàng.",
    "Sự đổi mới liên tục giúp doanh nghiệp luôn phát triển.",
    "Kinh doanh là hành trình học hỏi không ngừng.",
    "Tầm nhìn chiến lược sẽ dẫn dắt doanh nghiệp đến thành công.",
    "Kinh doanh đòi hỏi sự kết hợp giữa trí tuệ và cảm xúc.",
    "Sự bền bỉ và quyết tâm là chìa khóa của sự thành công trong kinh doanh.",
    "Mỗi thất bại trong kinh doanh là một bài học quý giá.",
    "Kinh doanh không ngừng nghỉ nhằm tạo ra giá trị cho xã hội.",
  ],
  Entertainment: [
    "Giải trí là cách để giải tỏa căng thẳng hàng ngày.",
    "Một buổi tối giải trí cùng bạn bè luôn đáng nhớ.",
    "Giải trí giúp tái tạo năng lượng cho cuộc sống.",
    "Âm nhạc và phim ảnh là những hình thức giải trí phổ biến.",
    "Giải trí mang lại niềm vui và sự thư giãn.",
    "Thế giới giải trí luôn đầy sắc màu và sự sáng tạo.",
    "Giải trí là nghệ thuật của sự tận hưởng cuộc sống.",
    "Mỗi chương trình giải trí đều có một câu chuyện thú vị.",
    "Giải trí giúp bạn quên đi những lo toan hàng ngày.",
    "Nghệ sĩ luôn biết cách mang lại tiếng cười và niềm vui.",
    "Giải trí là liều thuốc tinh thần cho tâm hồn.",
    "Mỗi sự kiện giải trí đều tạo nên những kỷ niệm khó quên.",
    "Giải trí không chỉ là về xem mà còn là về cảm nhận.",
    "Những màn trình diễn giải trí luôn làm say lòng khán giả.",
    "Giải trí giúp thổi bay những áp lực của cuộc sống.",
    "Sự sáng tạo trong giải trí luôn đem đến những trải nghiệm mới.",
    "Giải trí là nguồn cảm hứng cho nghệ sĩ và khán giả.",
    "Thế giới giải trí mở ra cánh cửa của niềm vui.",
    "Giải trí là niềm đam mê của biết bao người.",
    "Giải trí không chỉ làm phong phú cuộc sống mà còn gắn kết cộng đồng.",
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
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${topic}&per_page=1`,
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
  const img = data.photos[0].src.original;
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

const topics = [
  {
    theme: "Travel",
    image: () => getRandomImg("Travel"), // ảnh thiên nhiên phù hợp với chủ đề Travel
    content: meaningfulSentences["Travel"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Travel"),
  },
  {
    theme: "Food",
    image: () => getRandomImg("Food"), // ảnh Food
    content: meaningfulSentences["Food"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Food"),
  },
  {
    theme: "Technology",
    image: () => getRandomImg("Technology"), // ảnh kỹ thuật, Technology
    content: meaningfulSentences["Technology"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Technology"),
  },
  {
    theme: "Education",
    image: () => getRandomImg("Education"), // ảnh trừu tượng có thể dùng cho Education
    content: meaningfulSentences["Education"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Education"),
  },
  {
    theme: "Fashion",
    image: () => getRandomImg("Fashion"), // ảnh thời trang
    content: meaningfulSentences["Fashion"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Fashion"),
  },
  {
    theme: "Sport",
    image: () => getRandomImg("Sport"), // ảnh Sport
    content: meaningfulSentences["Sport"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Sport"),
  },
  {
    theme: "Music",
    image: () => getRandomImg("Music"), // sử dụng ảnh trừu tượng làm đại diện cho Music
    content: meaningfulSentences["Music"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Music"),
  },
  {
    theme: "Health",
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
];

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
    for (let i = 0; i < 5; i++) {
      // Tạo 20 bài viết
      const topic = topics[randomIntFromInterval(0, topics.length - 1)];

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
