window.GIFT_GAME_DATA = {
  events: [
    { year: "第一年", title: "聖誕節", icon: "🎄" },
    { year: "第一年", title: "情人節", icon: "💝" },
    { year: "第二年", title: "女友生日", icon: "🎂" },
    { year: "第二年", title: "東京出差土產", icon: "🗼", isTokyo: true },
    { year: "第二年", title: "交往滿一週年紀念日", icon: "🥂" },
    { year: "第三年", title: "情人節", icon: "💝" },
    { year: "第三年", title: "女友生日", icon: "🎂" },
    { year: "第三年", title: "交往滿二週年紀念日", icon: "🥂" },
    { year: "第四年", title: "女友生日", icon: "🎂" },
    { year: "第四年", title: "交往滿三週年紀念日", icon: "🥂" },
    { year: "第四年", title: "聖誕節", icon: "🎄" },
    { year: "第五年", title: "情人節", icon: "💝" },
    { year: "第五年", title: "女友生日", icon: "🎂" },
    { year: "第五年", title: "交往滿四週年紀念日", icon: "🥂" }
  ],

  generalGifts: [
    { id: "handwritten-card", label: "寫一張有著滿滿字的卡片，她一定很喜歡！", score: 5 },
    { id: "heated-mug", label: "插電之後可以10秒瞬間加熱的酷炫馬克杯，自己也好想要！", score: 0 },
    { id: "flowers", label: "一束大大的花，跟他說我愛你", score: 5 },
    { id: "chocolate", label: "好吃的巧克力，跟他說我愛你", score: -10 },
    { id: "chiikawa-red-envelope", label: "她最喜歡的角色吉伊卡哇的紅包袋，裡面包666元", score: -20 },
    { id: "couple-mugs", label: "情侶一對的馬克杯", score: 5 },
    { id: "short-trip", label: "兩天一夜的輕旅行，創造兩個人的回憶", score: 5 },
    { id: "first-date-place", label: "帶她重遊第一次約會的地方，回想當時的悸動", score: 10 },
    { id: "bank-transfer", label: "直接霸氣轉帳1314元給她，留言1314520", score: -10 },
    { id: "chiikawa-stickers", label: "他最喜歡的角色吉伊卡哇的LINE貼圖", score: -10 },
    { id: "preserved-flowers", label: "現在最流行的永生花，跟我們的愛一樣不滅", score: 5 },
    { id: "perfume", label: "她之前聊天的時候提過的香水", score: 5 },
    { id: "massage-coupon", label: "自製按摩券，可以幫她按摩666 分鐘", score: -10 },
    { id: "viral-lipstick", label: "threads上看到很紅的口紅", score: -10 },
    { id: "electric-fan", label: "最近剛同居，送電風扇很實用", score: -10 },
    { id: "let-her-choose", label: "帶她逛街，讓她自己挑", score: -20 },
    { id: "friends-party", label: "剛好有跟朋友的聚會，帶她一起去玩", score: -20 },
    { id: "custom-line-stickers", label: "自製屬於我們兩個的 LINE 貼圖", score: 10 },
    { id: "fitness-course", label: "幫她報名健身教練課程，把錢付掉", score: -20 },
    { id: "workplace-surprise", label: "給她小驚喜，出現在她的公司或學校，等她下班", score: -20 },
    { id: "jewelry", label: "她之前聊天的時候提過的飾品", score: 5 },
    { id: "fruit-box", label: "她很愛吃水果，送水果禮盒不會出錯", score: -20 },
    { id: "funny-photo-album", label: "她的醜照合集，但我都覺得好可愛", score: 0 },
    { id: "concert-tickets", label: "搶到她最喜歡的偶像的演唱會門票帶她去", score: 10 },
    { id: "beef-noodle-coupon", label: "無論何時都去她家煮牛肉麵券", score: 5 },
    { id: "parents-dinner", label: "帶她和我爸媽一起吃高級餐廳", score: -20 },
    { id: "couple-bracelet", label: "情侶手鏈", score: 10 },
    { id: "art-exhibition", label: "去看你們都有興趣的展覽", score: 10 },
    { id: "i-am-the-gift", label: "跟她說「我就是你最好的禮物」", score: -20 },
    { id: "credit-card", label: "辦了我的信用卡副卡給他，讓他想刷什麼就刷", score: -10 },
    { id: "split-dinner", label: "一起去吃大餐我多付一點", score: -20 },
    { id: "shoes", label: "送他一雙好看的鞋！", score: -20 },
    { id: "umbrella", label: "最近都在下雨，送他雨傘", score: -20 },
    { id: "acne-gel", label: "聽說最近某個牌子的痘痘藥很好用，就決定是它了", score: -20 },
    { id: "surprise-clothes", label: "沒看過他穿裙子買一件給她！", score: -20 }
  ],

  ringGift: { id: "proposal-ring", label: "跪下來拿出婚戒，跟她求婚", isRing: true },

  tokyoGifts: [
    { id: "airport-top-souvenir", label: "在機場排行榜第一的伴手禮", score: -20 },
    { id: "travel-photos", label: "出差太累沒買東西，但有美景照片", score: -20 },
    { id: "handwritten-postcard", label: "手寫明信片", score: 10 },
    { id: "character-gachapon", label: "女友喜歡的角色扭蛋", score: 5 }
  ],

  // Prototype 暫用反應，之後可替換成各禮物專屬台詞。
  reactions: [
    "她看了看禮物，笑著說：「你居然有想到這個！」",
    "她接過禮物，忍不住問：「你怎麼會選這個呀？」",
    "她愣了一下，接著露出一個意味深長的笑容。",
    "她把禮物拿在手上看了好久，似乎正在想該說什麼。",
    "她笑著收下禮物：「好吧，這次先算你有用心。」"
  ]
};
