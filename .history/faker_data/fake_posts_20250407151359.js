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
  "Travel": [
    "Chuyến đi du lịch đến Đà Nẵng mang lại cảm giác sảng khoái.",
    "Hòa mình vào thiên nhiên tươi đẹp của Hội An.",
    "Thám hiểm những danh lam thắng cảnh ở Sa Pa.",
    "Trải nghiệm văn hóa độc đáo tại Huế.",
    "Khám phá những bãi biển tuyệt vời ở Nha Trang.",
    "Du lịch Việt Nam giúp bạn hiểu rõ hơn về văn hóa.",
    "Thưởng thức ẩm thực đường phố tại Sài Gòn.",
    "Dạo bước qua những con phố cổ kính.",
    "Cảm nhận sự bình yên của vùng quê miền Bắc.",
    "Du ngoạn các khu di tích lịch sử ở Hà Nội.",
    "Tận hưởng không khí trong lành của vùng núi.",
    "Khám phá nét đẹp của cảnh quan thiên nhiên.",
    "Trải nghiệm cuộc sống địa phương qua những câu chuyện đời thường.",
    "Du lịch là cách tuyệt vời để mở rộng tầm nhìn.",
    "Hòa mình vào làn gió mát của biển cả.",
    "Chạm tay vào lịch sử qua các di tích cổ.",
    "Du lịch giúp bạn tìm lại chính mình.",
    "Tìm hiểu văn hóa qua các lễ hội truyền thống.",
    "Du lịch không chỉ là nghỉ ngơi mà còn là học hỏi.",
    "Mỗi chuyến đi là một kỷ niệm đáng nhớ.",
  ],
  "Food": [
    "Ẩm thực Việt Nam nổi tiếng với hương vị độc đáo.",
    "Phở là món ăn biểu tượng của đất nước.",
    "Bún chả mang đến trải nghiệm ẩm thực khó quên.",
    "Hương vị tươi ngon của rau sống tạo nên sự cân bằng.",
    "Ẩm thực đường phố luôn chứa đựng những bất ngờ.",
    "Mỗi món ăn đều kể một câu chuyện riêng.",
    "Nếm thử những món ăn truyền thống là trải nghiệm tuyệt vời.",
    "Hòa quyện hương vị từ nhiều vùng miền khác nhau.",
    "Đặc sản vùng đất mang đậm dấu ấn văn hóa.",
    "Ẩm thực không chỉ là thức ăn mà còn là nghệ thuật.",
    "Món ăn đậm đà của miền Trung khiến người ta nhớ mãi.",
    "Sự kết hợp giữa truyền thống và hiện đại tạo nên hương vị mới.",
    "Ẩm thực là cầu nối giữa con người và văn hóa.",
    "Mỗi bữa ăn là một dịp sum vầy gia đình.",
    "Thưởng thức món ăn ngon giúp cải thiện tâm trạng.",
    "Ẩm thực luôn biết cách chạm đến trái tim thực khách.",
    "Sự tinh tế trong cách trình bày món ăn là nghệ thuật.",
    "Ẩm thực đường phố luôn mang đến những trải nghiệm mới lạ.",
    "Hương vị của món ăn làm say lòng người thưởng thức.",
    "Ẩm thực là sự sáng tạo không ngừng của con người.",
  ],
  "Technology": [
    "Công nghệ hiện đại đã thay đổi cách chúng ta sống.",
    "Các thiết bị thông minh ngày càng trở nên phổ biến.",
    "Internet đã kết nối mọi người trên toàn thế giới.",
    "Trí tuệ nhân tạo mở ra nhiều cơ hội mới.",
    "Công nghệ giúp tăng cường hiệu suất làm việc.",
    "Mỗi ngày đều có những phát minh đột phá.",
    "Sự tiến bộ của công nghệ tạo ra những tiện ích vượt trội.",
    "Thế giới số đang không ngừng phát triển.",
    "Công nghệ thay đổi cách chúng ta giao tiếp.",
    "Ứng dụng di động giúp cuộc sống trở nên dễ dàng hơn.",
    "Thực tế ảo mang lại trải nghiệm hoàn toàn mới.",
    "Blockchain được xem là tương lai của giao dịch kỹ thuật số.",
    "Công nghệ không ngừng cải tiến để phục vụ con người.",
    "Máy tính và điện thoại thông minh là minh chứng cho sự tiến bộ.",
    "Kỹ thuật số mở ra cánh cửa của tương lai.",
    "Internet vạn vật kết nối mọi thiết bị thông minh.",
    "Công nghệ số hóa đang thay đổi nền kinh tế.",
    "Từ robot đến drone, công nghệ đang phát triển vượt bậc.",
    "Sự sáng tạo trong công nghệ là động lực của tiến bộ.",
    "Công nghệ không chỉ giúp ích cho cá nhân mà còn cho cả cộng đồng.",
  ],
  "Education": [
    "Giáo dục là chìa khóa mở ra cánh cửa tương lai.",
    "Mỗi bài học đều giúp ta tiến gần hơn tới tri thức.",
    "Giáo dục không chỉ truyền đạt kiến thức mà còn rèn luyện nhân cách.",
    "Học tập suốt đời là xu hướng của thời đại mới.",
    "Sự sáng tạo trong giáo dục giúp trẻ phát triển toàn diện.",
    "Giáo viên là người truyền cảm hứng cho học sinh.",
    "Học tập không chỉ ở trường mà còn ở cuộc sống.",
    "Công nghệ đang làm thay đổi cách giảng dạy truyền thống.",
    "Thế hệ trẻ cần được trang bị kiến thức để tự tin bước vào tương lai.",
    "Giáo dục mở ra cơ hội cho mọi người.",
    "Học tập là hành trình không bao giờ kết thúc.",
    "Giáo dục là nền tảng của một xã hội phát triển.",
    "Sự kiên trì và nỗ lực là chìa khóa thành công trong học tập.",
    "Giáo dục giúp con người nhận ra giá trị bản thân.",
    "Các phương pháp giảng dạy hiện đại mang lại hiệu quả cao.",
    "Học tập thông qua trải nghiệm là cách tốt nhất để học.",
    "Giáo dục khơi gợi niềm đam mê và khát khao tri thức.",
    "Mỗi ngày đến trường là một hành trình khám phá.",
    "Giáo dục không chỉ dừng lại ở kiến thức sách vở.",
    "Tương lai của đất nước được xây dựng trên nền tảng giáo dục.",
  ],
  "Fashion": [
    "Thời trang là biểu hiện của phong cách cá nhân.",
    "Xu hướng thời trang luôn thay đổi theo mùa.",
    "Một bộ trang phục đẹp làm tăng sự tự tin của người mặc.",
    "Thời trang không chỉ là về quần áo mà còn là nghệ thuật.",
    "Mỗi bộ sưu tập mang đậm dấu ấn của nhà thiết kế.",
    "Phong cách thời trang thể hiện cá tính riêng biệt.",
    "Sự tinh tế trong cách phối đồ là chìa khóa của thời trang.",
    "Thời trang luôn biết cách tạo nên điểm nhấn.",
    "Nét đẹp của trang phục có thể làm thay đổi tâm trạng.",
    "Thời trang là sự sáng tạo không ngừng của con người.",
    "Mỗi xu hướng thời trang đều kể một câu chuyện riêng.",
    "Sự pha trộn giữa cổ điển và hiện đại tạo nên vẻ đẹp độc đáo.",
    "Thời trang là nghệ thuật thể hiện cái tôi cá nhân.",
    "Phong cách riêng biệt là điều làm nên thương hiệu thời trang.",
    "Mỗi bộ trang phục đều có thể truyền tải cảm hứng.",
    "Thời trang không chỉ đơn thuần là mặc đồ mà còn là sống.",
    "Các nhà thiết kế luôn tìm kiếm cảm hứng từ cuộc sống.",
    "Thời trang là cầu nối giữa nghệ thuật và cuộc sống.",
    "Một bộ trang phục đẹp giúp bạn nổi bật giữa đám đông.",
    "Thời trang thể hiện sự đổi mới và sáng tạo không ngừng.",
  ],
  "Sport": [
    "Thể thao là cách tuyệt vời để rèn luyện sức khỏe.",
    "Trận đấu thể thao luôn mang lại cảm giác hưng phấn.",
    "Thể thao giúp xây dựng tinh thần đồng đội.",
    "Mỗi trận đấu đều là cơ hội để thể hiện bản thân.",
    "Tinh thần chiến đấu là điều cốt lõi của thể thao.",
    "Thể thao giúp rèn luyện sự kiên nhẫn và quyết tâm.",
    "Sự nỗ lực và cố gắng trong thể thao luôn được đền đáp.",
    "Thể thao là nguồn cảm hứng cho nhiều người.",
    "Tập luyện thể thao giúp cải thiện sức khỏe thể chất.",
    "Thể thao không chỉ giúp bạn khỏe mạnh mà còn vui vẻ.",
    "Một trận đấu thể thao đầy kịch tính luôn làm say lòng khán giả.",
    "Tinh thần fair-play là giá trị cốt lõi trong thể thao.",
    "Thể thao là sân chơi của sự cạnh tranh lành mạnh.",
    "Sự phấn khích của thể thao mang lại niềm vui cho cuộc sống.",
    "Thể thao là cách để bạn vượt qua giới hạn bản thân.",
    "Tập luyện thường xuyên giúp nâng cao thể lực.",
    "Thể thao khơi dậy niềm đam mê và nhiệt huyết.",
    "Sự bền bỉ trong thể thao là minh chứng cho sự cố gắng.",
    "Thể thao là niềm vui và sự thử thách không ngừng.",
    "Thể thao không chỉ là hoạt động thể chất mà còn rèn luyện tinh thần.",
  ],
  "Music": [
    "Âm nhạc có khả năng chạm vào tâm hồn con người.",
    "Những giai điệu du dương mang lại cảm xúc khó tả.",
    "Âm nhạc là ngôn ngữ chung của mọi người.",
    "Mỗi bản nhạc đều kể một câu chuyện riêng.",
    "Những âm thanh hòa quyện tạo nên bản giao hưởng tuyệt vời.",
    "Âm nhạc có thể làm dịu đi những vết thương lòng.",
    "Giai điệu nhẹ nhàng của piano mang lại sự thanh thản.",
    "Nhạc cụ truyền thống luôn mang đậm dấu ấn văn hóa.",
    "Âm nhạc giúp kết nối tâm hồn và cảm xúc.",
    "Những ca khúc hay làm sống lại ký ức xưa cũ.",
    "Âm nhạc là nguồn cảm hứng cho sự sáng tạo.",
    "Giai điệu sôi động làm bùng nổ không khí bất kỳ nơi nào.",
    "Âm nhạc không chỉ giải trí mà còn chữa lành tâm hồn.",
    "Nhạc sĩ luôn tìm kiếm những giai điệu mới mẻ.",
    "Âm nhạc có sức mạnh vượt qua mọi rào cản.",
    "Âm nhạc mang lại niềm vui và cảm hứng cho cuộc sống.",
    "Những ca khúc hay luôn là liều thuốc tinh thần cho tâm hồn.",
    "Âm nhạc kết nối con người dù ở mọi nơi trên thế giới.",
    "Mỗi nốt nhạc đều chứa đựng cảm xúc chân thành.",
    "Âm nhạc là nghệ thuật của cảm xúc và trí tuệ.",
  ],
  "Health": [
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
  "Business": [
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
  "Entertainment": [
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
  "Travel": [
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
  "Food": [
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
  "Technology": [
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
  "Education": [
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
  "Fashion": [
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
  "Sport": [
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
  "Music": [
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
  "Health": [
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
  "Business": [
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
  "Entertainment": [
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
function getRandomImg(topic){
 const reponse fetch('https://your-api.com/endpoint', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer your_token_here',
      // Thêm các header khác nếu cần
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  
}
function getRandomHashtags(topic) {
  // Lấy danh sách hashtag cho chủ đề đó
  const hashtags = topicHashtags[topic];
  const count = randomIntFromInterval(1, hashtags.length);

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
    image: faker.image.nature(), // ảnh thiên nhiên phù hợp với chủ đề Travel
    content: meaningfulSentences["Travel"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Travel"),
  },
  {
    theme: "Food",
    image: faker.image.food(), // ảnh Food
    content: meaningfulSentences["Food"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Food"),
  },
  {
    theme: "Technology",
    image: faker.image.technics(), // ảnh kỹ thuật, Technology
    content: fameaningfulSentences["Technology"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Technology"),
  },
  {
    theme: "Education",
    image: faker.image.abstract(), // ảnh trừu tượng có thể dùng cho Education
    content: fmeaningfulSentences["Education"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Education"),
  },
  {
    theme: "Fashion",
    image: faker.image.fashion(), // ảnh thời trang
    content: fakmeaningfulSentences["Fashion"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Fashion"),
  },
  {
    theme: "Sport",
    image: faker.image.sports(), // ảnh Sport
    content: fmeaningfulSentences["Sport"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Sport"),
  },
  {
    theme: "Music",
    image: faker.image.abstract(), // sử dụng ảnh trừu tượng làm đại diện cho Music
    content: meaningfulSentences["Music"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Music"),
  },
  {
    theme: "Health",
    image: faker.image.people(), // ảnh con người có thể tượng trưng cho Health
    content: fmeaningfulSentences["Health"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Health"),
  },
  {
    theme: "Business",
    image: faker.image.business(), // ảnh Business
    content: fakmeaningfulSentences["Business"][randomIntFromInterval(0, 19)],
    hashtags: getRandomHashtags("Business"),
  },
  {
    theme: "Entertainment",
    image: faker.image.abstract(), // ảnh trừu tượng cho chủ đề Entertainment
    content: fmeaningfulSentences["Entertainment"][randomIntFromInterval(0, 19)],
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
    for (let i = 0; i < 20; i++) {
      // Tạo 20 bài viết
      const topic = topics[randomIntFromInterval(0, topics.length - 1)];

      const users = await usersCollection.find().toArray(); // Lấy danh sách người dùng
      const authorId = users[randomIntFromInterval(0, users.length - 1)]._id; // Lấy ngẫu nhiên authorId từ users
      const likesCount = randomIntFromInterval(0, 8); // Số lượt thích ngẫu nhiên từ 0 đến 80
      let post = {
        user_id: authorId,
        hashtags: topic.hashtags,
        content: topic.content, // Nội dung bài viết
        image: topic.image.url(), // Hình ảnh (có thể là null hoặc rỗng nếu không cần)
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
