export interface QrStory {
  title: string;
  folkArt: string;
  region: string;
  audioTitle: string;
  audioDuration: string;
  storyContent: string;
  folkQuote: string;
  funFact: string;
}

export interface Product {
  id: string;
  name: string;
  category: "keychain" | "combo" | "postcard" | "bookmark" | "totebag" | "sticker";
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  storySnippet: string;
  heritageOrigin: string;
  material: string;
  dimensions: string;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  qrStory: QrStory;
}

export interface CultureStory {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  region: string;
  soundName: string;
  soundType: "dantranh" | "dongho" | "danbau" | "cheo" | "quanho";
  image: string;
  summary: string;
  fullStory: string;
  modernConnection: string;
  quote: string;
  highlights: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: 'sp-dankim',
    name: 'Móc Khóa Đàn Kìm – Vết 01 (Đờn Ca Tài Tử Tâm Hồn Việt)',
    category: 'keychain',
    categoryLabel: 'Móc Khóa',
    price: 22000,
    originalPrice: 30000,
    image: '/assets/product_dankim_keychain.jpg',
    description: 'Móc khóa lưu niệm Đàn Kìm (Nguyệt Cầm) – Vết 01 lấy cảm hứng từ linh hồn Đờn Ca Tài Tử Nam Bộ. Thiết kế tinh xảo kèm charm hoa sen đỏ thắm và thẻ gỗ khắc chữ “Đàn kìm”, mặt sau in mã QR khám phá thanh âm hòa tấu.',
    storySnippet: 'Đờn ca tài tử tâm hồn Việt – Tiếng nguyệt cầm réo rắt bên dòng Cửu Long.',
    heritageOrigin: 'Đờn Ca Tài Tử Nam Bộ (Di sản UNESCO)',
    material: 'Gỗ mộc khắc laser & Acrylic cao cấp, charm hoa sen tráng men đỏ, khuyên xâu kim loại chịu lực',
    dimensions: 'Kích thước đàn 65mm × 32mm, charm sen 18mm, thẻ tên 30mm',
    inStock: true,
    featured: true,
    tags: ['Vết 01', 'Đàn Kìm', 'Đờn Ca Tài Tử', '22k/cái', 'Bán chạy'],
    qrStory: {
      title: 'Đàn Kìm – Vị Chỉ Huy Thầm Lặng Của Đờn Ca Tài Tử',
      folkArt: 'Nghệ Thuật Đờn Ca Tài Tử Nam Bộ',
      region: 'Miền Tây Nam Bộ',
      audioTitle: 'Khúc hòa tấu Đàn Kìm bản Dạ Cổ Hoài Lang',
      audioDuration: '02:45',
      storyContent: 'Cây Đàn Kìm với thùng tròn như vầng trăng rằm, cần dài thanh thoát cùng hai dây tơ réo rắt. Trong dàn nhạc tài tử Nam Bộ, Đàn Kìm giữ vai trò nhạc trưởng dẫn dắt toàn bộ cung bậc cảm xúc, tạo nên chất tự sự trữ tình mênh mang sông nước.',
      folkQuote: '“Từ là từ phu tướng / Báu kiếm sắc phán lên đàng...”',
      funFact: 'Đàn Kìm còn được gọi là Nguyệt Cầm bởi thùng đàn tròn trịa tựa ánh trăng rằm soi bóng dòng kênh.'
    }
  },
  {
    id: 'sp-danco',
    name: 'Móc Khóa Đàn Cò – Vết 01 (Đờn Ca Tài Tử Tâm Hồn Việt)',
    category: 'keychain',
    categoryLabel: 'Móc Khóa',
    price: 22000,
    originalPrice: 30000,
    image: '/assets/product_danco_keychain.jpg',
    description: 'Móc khóa lưu niệm Đàn Cò (Đàn Nhị) – Vết 01 thanh âm da diết gắn liền với ký ức đồng quê. Thiết kế kèm charm nón lá truyền thống và thẻ gỗ khắc chữ “Đàn cò”, gắn kèm tag QR Story lắng nghe khúc ca dân tộc.',
    storySnippet: 'Đờn ca tài tử tâm hồn Việt – Nốt trầm xao xuyến như cánh cò bay lả.',
    heritageOrigin: 'Âm Nhạc Truyền Thống & Đờn Ca Tài Tử',
    material: 'Gỗ khắc laser & Acrylic bền nhẹ, cần đàn uốn nét tinh tế kèm cung vĩ, charm nón lá đan mộc',
    dimensions: 'Kích thước đàn 70mm × 25mm, charm nón lá 22mm, thẻ tên 30mm',
    inStock: true,
    featured: true,
    tags: ['Vết 01', 'Đàn Cò', 'Nón Lá', '22k/cái', 'Mới nhất'],
    qrStory: {
      title: 'Đàn Cò – Tiếng Lòng Tha Thiết Của Đất Phương Nam',
      folkArt: 'Nhạc Cụ Cổ Truyền Việt Nam',
      region: 'Nam Bộ & Châu Thổ Sông Hồng',
      audioTitle: 'Tiếng Đàn Cò hòa âm điệu Oan điệu Nam da diết',
      audioDuration: '02:30',
      storyContent: 'Đàn Cò (Đàn Nhị) chỉ với hai dây nhưng nhờ cung vĩ cọ sát điêu luyện có thể uốn lượn như giọng ngâm của người mẹ ru con. Tiếng đàn mô phỏng tiếng người than thở, vui buồn chan chứa tình quê hương mộc mạc.',
      folkQuote: '“Gió đưa cây cải về trời / Rau răm ở lại chịu lời đắng cay...”',
      funFact: 'Dây đàn cò xưa thường được se bằng tơ tằm nguyên chất hoặc lông đuôi ngựa bạch để có âm thanh ấm và vang xa nhất.'
    }
  },
  {
    id: 'sp-combo-cap',
    name: 'Combo Cặp Móc Khóa Đờn Ca Tài Tử (Đàn Kìm + Đàn Cò)',
    category: 'combo',
    categoryLabel: 'Combo Cặp Đôi',
    price: 40000,
    originalPrice: 44000,
    image: '/assets/product_combo_keychains.jpg',
    description: 'Bộ đôi trọn vẹn 2 móc khóa văn hóa Vết 01: 01 Móc khóa Đàn Kìm (kèm charm hoa sen) + 01 Móc khóa Đàn Cò (kèm charm nón lá). Mức giá ưu đãi chỉ 40.000₫/cặp (tiết kiệm hơn so với mua lẻ 22k/cái). Đóng gói hộp giấy bảo vệ môi trường, món quà lưu niệm ý nghĩa cho cặp đôi, bạn thân và du khách.',
    storySnippet: 'Cặp đôi hoàn hảo Đàn Kìm & Đàn Cò – Đờn ca tài tử hòa quyện tâm hồn Việt.',
    heritageOrigin: 'Bộ Sưu Tập Di Sản Âm Nhạc Dân Tộc Vết 01',
    material: 'Set 2 móc khóa hoàn chỉnh: Gỗ khắc mộc mạc, charm hoa sen & charm nón lá, thẻ tên riêng biệt, đóng hộp quà Vết Việt',
    dimensions: 'Set 2 chiếc, hộp quà tặng 12cm × 12cm × 2.5cm',
    inStock: true,
    featured: true,
    tags: ['Combo 40k/cặp', 'Tiết kiệm', 'Cặp đôi', 'Đặc biệt', 'Hot'],
    qrStory: {
      title: 'Hòa Khúc Đàn Kìm & Đàn Cò – Trọn Vẹn Hồn Nam Bộ',
      folkArt: 'Dàn Nhạc Tài Tử Đồng Bằng Sông Cửu Long',
      region: 'Nam Bộ',
      audioTitle: 'Song tấu Đàn Kìm & Đàn Cò ngẫu hứng',
      audioDuration: '03:15',
      storyContent: 'Khi Đàn Kìm vững chãi giữ nhịp và điệu, Đàn Cò luyến láy bổng trầm quấn quýt bên nhau như đôi tri kỷ sông nước. Cặp đôi nhạc khí này chính là biểu tượng của tình bạn keo sơn, tình yêu gắn kết và tình nghĩa mộc mạc của người Việt.',
      folkQuote: '“Ngón đàn tri kỷ ngân vang / Trăm năm ghi nhớ tấc gang ân tình.”',
      funFact: 'Mua combo cặp đôi tiết kiệm 4.000₫ và được tặng kèm hộp quà giấy mỹ thuật dán tem niêm phong Vết Việt sang trọng.'
    }
  }
];

export const CULTURE_STORIES: CultureStory[] = [{id:`culture-don-ca`,title:`Đờn Ca Tài Tử`,subtitle:`Hơi Thở Sông Nước & Tình Nghĩa Phương Nam`,category:`don-ca`,region:`Miền Tây Nam Bộ`,soundName:`Đàn Kìm & Bản Dạ Cổ Hoài Lang`,soundType:`dantranh`,image: "/assets/culture_folk_arts.jpg",summary:`Di sản phi vật thể nhân loại được sinh ra từ nếp sống phóng khoáng, tình nghĩa của người phương Nam bên dòng sông Tiền, sông Hậu.`,fullStory:`Đờn ca tài tử là loại hình nghệ thuật dân gian đặc trưng của vùng đồng bằng sông Cửu Long hình thành từ cuối thế kỷ 19. Chữ "tài tử" hàm nghĩa người có tài năng âm nhạc nhưng chơi nhạc vì lòng say mê và tri âm tri kỷ chứ không xem đó là nghề mưu sinh kiếm sống. Trong không gian trăng thanh gió mát bên bờ kênh rạch hay dưới bóng vườn cây ăn trái, tiếng đờn kìm, đờn tranh, đờn bầu hòa cùng giọng ca ngọt ngào mở ra cả một chân trời cảm xúc mênh mang.`,modernConnection:`VẾT VIỆT chắt lọc hình bóng thanh mảnh của cây Đờn Kìm và nốt nhạc ngũ cung vào những chiếc bookmark kim loại, postcard lụa để tiếng tơ đồng tiếp tục đọng lại trên bàn làm việc của người trẻ.`,quote:`“Ngón đờn tài tử buông lơi / Nghe câu vọng cổ thấy đời nhẹ tênh.”`,highlights:[`UNESCO công nhận là Di sản văn hóa phi vật thể của nhân loại năm 2013.`,`Sử dụng hệ thống hơi điệu phong phú: Điệu Bắc vui tươi, điệu Nam thanh thản, điệu Oan bi thương.`,`Dàn nhạc ngũ tuyệt cổ điển gồm: Đàn kìm, đàn tranh, đàn cò, đàn tỳ bà và đàn tam (sau này có thêm guitar phím lõm).`]},{id:`culture-tuong`,title:`Nghệ Thuật Tuồng (Hát Bội)`,subtitle:`Ngôn Ngữ Của Khí Phách & Mặt Nạ Kịch Nghệ`,category:`tuong`,region:`Bình Định, Cố đô Huế & Nam Bộ`,soundName:`Trống Chiến & Kèn Bóp Hát Bội`,soundType:`cheo`,image: "/assets/product_keychain_tuong.jpg",summary:`Nghệ thuật biểu diễn kinh điển đầy tính tượng trưng và ước lệ với những khuôn mặt hóa trang lộng lẫy phản ánh nội tâm nhân vật.`,fullStory:`Tuồng (hay Hát Bội) là sân khấu cổ truyền bác học bậc nhất của dân tộc, từng được vinh danh là quốc kịch dưới triều Nguyễn. Đặc trưng nổi bật nhất của Tuồng là tính ước lệ cao: một cái roi ngựa hóa thành con tuấn mã xông pha dặm trường, một chiếc mái chèo diễn tả cảnh vượt thác ghềnh cuồn cuộn. Hóa trang mặt Tuồng là một kỳ công mỹ thuật dân gian, nơi màu sắc chỉ rõ tính cách: mặt đỏ là trung thần, mặt trắng là kẻ nịnh hót hiểm độc, mặt đen là người chất phác cương trực.`,modernConnection:`VẾT VIỆT cách điệu các đường nét kẻ mắt, vẽ trán đặc trưng của mặt nạ Tuồng thành móc khóa đồng đúc enamel và sticker vinyl hiện đại mang năng lượng bản lĩnh cho thế hệ mới.`,quote:`“Mặt son nét bút kiêu hùng / Gìn lòng trung nghĩa giữa vòng phong ba.”`,highlights:[`Đỉnh cao của nghệ thuật ước lệ và biểu trưng trong sân khấu truyền thống Á Đông.`,`Mỗi nhân vật có một mẫu vẽ mặt riêng biệt được truyền thừa qua nhiều đời nghệ nhân.`,`Sự kết hợp hoàn hảo giữa vũ đạo, võ thuật truyền thống và âm nhạc bộ gõ rộn rã.`]},{id:`culture-cheo`,title:`Hát Chèo Bắc Bộ`,subtitle:`Tiếng Trống Sân Đình & Nụ Cười Lạc Quan Xóm Làng`,category:`cheo`,region:`Đồng Bằng Sông Hồng`,soundName:`Trống Chèo & Khúc Hát Sân Đình`,soundType:`cheo`,image: "/assets/culture_folk_arts.jpg",summary:`Linh hồn của đời sống làng quê châu thổ Bắc Bộ, nơi tiếng hát, điệu múa hòa quyện cùng sự thông minh trào lộng của người nông dân.`,fullStory:`Khởi nguồn từ những hội hè sau mùa gặt lúa vàng, Chèo là hình thức sân khấu kịch hát dân gian của cư dân nông nghiệp Bắc Bộ. Dưới bóng đa mái đình xưa, chiếu chèo trải ra là sân khấu rực rỡ. Tiếng đế của khán giả hòa vào lời ca của đào kép tạo nên một không khí dân chủ, cởi mở kỳ lạ. Nhân vật Hề Chèo vừa thông minh vừa hóm hỉnh, dùng tiếng cười để châm biếm áp bức, tôn vinh tình yêu lứa đôi và lòng nhân hậu bình dị.`,modernConnection:`Hình tượng chú Tễu, Hề mồi và những chiếc quạt gấp nan tre mộc mạc được VẾT VIỆT biến tấu trên các sản phẩm phụ kiện vải thêu và thẻ kẹp sách thanh nhã.`,quote:`“Hỡi cô thắt dải lưng xanh / Có về xem hội với anh thì về...”`,highlights:[`Gắn liền với không gian diễn xướng sân đình và lễ hội mùa xuân đồng bằng châu thổ.`,`Lối đối thoại mở độc đáo: Diễn viên và người xem có thể giao lưu trực tiếp ngay trong vở diễn.`,`Tích trữ kho tàng làn điệu phong phú bậc nhất với hơn 200 điệu hát đặc sắc.`]},{id:`culture-quan-ho`,title:`Dân Ca Quan Họ`,subtitle:`Nón Quai Thao, Dải Yếm Đào & Lời Ca Dùng Dằng`,category:`quan-ho`,region:`Kinh Bắc (Bắc Ninh - Bắc Giang)`,soundName:`Làn Điệu “Người Ơi Người Ở Đừng Về”`,soundType:`quanho`,image: "/assets/hero_vet_viet_souvenirs.jpg",summary:`Nét văn hóa đối đáp tao nhã, trọng tình trọng nghĩa, kết tinh phẩm chất hiếu khách và thanh lịch của người xứ Kinh Bắc ngàn năm văn hiến.`,fullStory:`Quan họ không chỉ là ca hát, mà là cả một hệ thống lề lối ứng xử, giao tiếp và phong cách sống lịch lãm. Các liền anh áo the khăn xếp, các liền chị nón quai thao thắt lưng hoa lý gặp nhau trong canh hát thâu đêm suốt sáng. Những lời ca "la đà", "í a", "người ơi người ở" chan chứa nỗi niềm lưu luyến khôn nguôi khi tàn hội chia tay. Miếng trầu têm cánh phượng thơm cay mở đầu câu chuyện, kết nối những tấm lòng tri kỷ trọn đời.`,modernConnection:`Họa tiết nón ba tầm, quai thao đan lụa và miếng trầu cánh phượng trở thành cảm hứng cho các mẫu móc khóa da veg-tan và bộ thiệp viết tay đong đầy yêu thương của VẾT VIỆT.`,quote:`“Người về em dặn câu này / Yêu nhau xé lụa may quần / Ghét nhau đào đất chôn chân cho rồi.”`,highlights:[`Được UNESCO vinh danh là Di sản văn hóa phi vật thể đại diện của nhân loại năm 2009.`,`Nghệ thuật hát không cần nhạc đệm (hát chay) đòi hỏi kỹ thuật nảy hạt, luyến láy điêu luyện.`,`Văn hóa têm trầu cánh phượng – biểu tượng của sự khéo léo, tao nhã trong giao đãi.`]},{id:`culture-dong-ho`,title:`Tranh Dân Gian Đông Hồ`,subtitle:`Hồn Đất, Hồn Cây & Sắc Điệp Sáng Bừng`,category:`dong-ho`,region:`Làng Đông Hồ, Huyện Thuận Thành, Bắc Ninh`,soundName:`Thanh Âm Bản Làng & Khắc Gỗ Dân Gian`,soundType:`dongho`,image: "/assets/product_dongho_postcard.jpg",summary:`Dòng tranh mộc mạc in bằng ván khắc gỗ trên giấy Dó quét điệp, mang ước nguyện thái bình, sung túc và hạnh phúc giản dị cho mọi nếp nhà Việt.`,fullStory:`Mỗi độ Tết đến xuân về, phiên chợ tranh Đông Hồ rực rỡ đón bà con thập phương về mua tranh dán lên vách đất đón năm mới. Tranh Đông Hồ nổi tiếng bởi chất liệu hoàn toàn từ thiên nhiên: màu đen từ than rơm nếp hoặc lá tre già, màu đỏ son từ sỏi son non, màu vàng từ hoa hòe nở rộ, màu xanh từ gỉ đồng hay lá chàm, và đặc biệt là lớp điệp óng ánh chế từ vỏ sò biển quét lên mặt giấy Dó dẻo dai.`,modernConnection:`VẾT VIỆT phục dựng lại các bố cục tranh kinh điển như “Bé ôm gà”, “Đám cưới chuột”, “Vinh hoa phú quý” trên nền giấy Dó xơ mịn và túi vải Canvas mộc mạc, giữ trọn sắc điệp dân tộc.`,quote:`“Tranh Đông Hồ gà lợn nét tươi trong / Màu dân tộc sáng bừng trên giấy điệp.” (Hoàng Cầm)`,highlights:[`100% màu sắc và chất liệu được khai thác từ hoa cỏ, vỏ ốc biển và sỏi đá tự nhiên.`,`Bản khắc bằng gỗ thị dẻo dai giúp từng đường nét in mộc mạc nhưng giàu sức sống biểu cảm.`,`Đang được lập hồ sơ đề nghị UNESCO công nhận là Di sản cần được bảo vệ khẩn cấp.`]},{id:`culture-dan-ca`,title:`Dân Ca & Nhạc Cụ Dân Tộc`,subtitle:`Độc Huyền Cầm, Sáo Trúc & Cồng Chiêng Núi Rừng`,category:`dan-ca`,region:`Khắp Ba Miền Đất Nước`,soundName:`Tiếng Đàn Bầu & Sáo Trúc Thanh Thoát`,soundType:`danbau`,image: "/assets/culture_folk_arts.jpg",summary:`Thanh âm tự sự sâu lắng của dân tộc Việt Nam qua cây Đàn Bầu một dây nhiệm màu, tiếng sáo trúc du dương và nhịp cồng chiêng vang dội.`,fullStory:`Âm nhạc truyền thống Việt Nam là sự cộng hưởng tuyệt vời giữa con người và thiên nhiên nhiệt đới. Cây Đàn Bầu với một dây duy nhất mà mô phỏng được tiếng nói và thanh điệu tiếng Việt giàu nhạc tính; tiếng sáo trúc vút lên trên cánh đồng bát ngát như tiếng gió lướt qua rặng tre; và không gian cồng chiêng Tây Nguyên linh thiêng kết nối đất trời. Tất cả tạo nên một tấm bản đồ âm thanh kỳ vĩ.`,modernConnection:`Bộ sưu tập bookmark và quà tặng của VẾT VIỆT ghi lại hình thể điêu khắc của từng nhạc khí, kết hợp cùng mã QR phát thanh âm chuẩn studio để người dùng có thể thưởng thức ở bất kỳ đâu.`,quote:`“Tiếng đồng cất tiếng ngàn năm / Ngân nga khúc hát nước non thanh bình.”`,highlights:[`Đàn Bầu – Sáng tạo âm học độc nhất vô nhị trên thế giới chỉ sử dụng âm bồi rung cần.`,`Không gian văn hóa Cồng chiêng Tây Nguyên – Kiệt tác truyền khẩu và phi vật thể của nhân loại.`,`Hệ thống thang âm ngũ cung phong phú biến hóa theo từng vùng miền địa lý.`]}];
