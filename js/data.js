// بيانات العقارات — الصور حقيقية من Unsplash
const IMG = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// رقم التواصل الرئيسي — كل طلبات الموقع تُرسل إلى هذا الواتساب
const CONTACT = { phone: "+963 994 684 873", whatsapp: "963994684873" };

const PROPERTIES = [
  {
    id: 1, title: "فيلا فاخرة مع مسبح خاص", type: "villa", purpose: "sale",
    city: "كوباني", area: "حي الشهداء", price: 285000, size: 420, beds: 5, baths: 4, garage: 2, year: 2022,
    featured: true,
    images: ["photo-1613490493576-7fde63acd811", "photo-1600607687939-ce8a6c25118c", "photo-1600566753190-17f0baa2a6c3", "photo-1484154218962-a197022b5858"],
    desc: "فيلا حديثة بتصميم معماري عصري على أرض واسعة، تضم مسبحاً خاصاً وحديقة منسقة، صالة استقبال مزدوجة الارتفاع، مطبخ مجهز بالكامل، وجناح نوم رئيسي مع غرفة ملابس.",
    features: ["مسبح خاص", "حديقة", "تكييف مركزي", "طاقة شمسية", "كاميرات مراقبة", "غرفة خادمة"],
    agent: 0
  },
  {
    id: 2, title: "شقة عصرية بإطلالة مفتوحة", type: "apartment", purpose: "sale",
    city: "كوباني", area: "شارع الجامع الكبير", price: 68000, size: 145, beds: 3, baths: 2, garage: 1, year: 2023,
    featured: true,
    images: ["photo-1522708323590-d24dbb6b0267", "photo-1502672260266-1c1ef2d93688", "photo-1505691938895-1758d7feb511", "photo-1556909114-f6e7ad7d3136"],
    desc: "شقة في الطابق الرابع ضمن بناء حديث مع مصعد، إكساء ديلوكس، واجهة شمالية مشمسة وإطلالة مفتوحة على المدينة. قريبة من الأسواق والمدارس.",
    features: ["مصعد", "إكساء ديلوكس", "شرفة واسعة", "مولدة احتياطية", "خزان مياه"],
    agent: 1
  },
  {
    id: 3, title: "منزل عائلي مع حديقة", type: "house", purpose: "sale",
    city: "القامشلي", area: "حي الوسطى", price: 112000, size: 260, beds: 4, baths: 3, garage: 1, year: 2019,
    featured: false,
    images: ["photo-1570129477492-45c003edd2be", "photo-1600210492486-724fe5c67fb0", "photo-1493809842364-78817add7ffb"],
    desc: "منزل مستقل من طابقين مع حديقة أمامية وخلفية، مناسب للعائلات الكبيرة، في حي هادئ وقريب من الخدمات.",
    features: ["حديقة", "مدخل مستقل", "سطح خاص", "تدفئة مركزية"],
    agent: 2
  },
  {
    id: 4, title: "شقة مفروشة للإيجار الشهري", type: "apartment", purpose: "rent",
    city: "كوباني", area: "حي كاني عربان", price: 350, size: 110, beds: 2, baths: 1, garage: 0, year: 2021,
    featured: true,
    images: ["photo-1560448204-e02f11c3d0e2", "photo-1493809842364-78817add7ffb", "photo-1505691938895-1758d7feb511"],
    desc: "شقة مفروشة بالكامل وجاهزة للسكن الفوري، تشمل الأجهزة الكهربائية والإنترنت. مثالية للموظفين والعائلات الصغيرة.",
    features: ["مفروشة", "إنترنت", "أجهزة كهربائية", "مولدة"],
    agent: 1
  },
  {
    id: 5, title: "مكتب إداري في برج تجاري", type: "office", purpose: "rent",
    city: "الحسكة", area: "شارع فلسطين", price: 600, size: 180, beds: 0, baths: 2, garage: 2, year: 2020,
    featured: false,
    images: ["photo-1497366216548-37526070297c", "photo-1486406146926-c627a92ad1ab", "photo-1497366811353-6870744d04b2"],
    desc: "مكتب بمساحة مفتوحة قابلة للتقسيم، مع قاعة اجتماعات ومطبخ صغير، ضمن برج تجاري مخدّم بالكامل.",
    features: ["قاعة اجتماعات", "مصعد", "حراسة 24 ساعة", "مواقف سيارات"],
    agent: 0
  },
  {
    id: 6, title: "محل تجاري على شارع رئيسي", type: "shop", purpose: "sale",
    city: "كوباني", area: "السوق المركزي", price: 54000, size: 75, beds: 0, baths: 1, garage: 0, year: 2018,
    featured: false,
    images: ["photo-1441986300917-64674bd600d8", "photo-1555529669-e69e7aa0ba9a"],
    desc: "محل بواجهة زجاجية عريضة في أكثر شوارع السوق حركة، مناسب لجميع الأنشطة التجارية مع مستودع خلفي.",
    features: ["واجهة زجاجية", "مستودع", "موقع حيوي"],
    agent: 2
  },
  {
    id: 7, title: "أرض سكنية مفرزة", type: "land", purpose: "sale",
    city: "كوباني", area: "التوسع الجنوبي", price: 38000, size: 500, beds: 0, baths: 0, garage: 0, year: null,
    featured: false,
    images: ["photo-1500382017468-9049fed747ef", "photo-1500076656116-558758c991c1"],
    desc: "أرض مفرزة بسند أخضر ضمن المخطط التنظيمي، على شارعين، صالحة لبناء فيلا أو بناء طابقي.",
    features: ["سند أخضر", "على شارعين", "ضمن المخطط التنظيمي", "خدمات قريبة"],
    agent: 0
  },
  {
    id: 8, title: "فيلا حديثة بتصميم مفتوح", type: "villa", purpose: "rent",
    city: "أربيل", area: "دريم سيتي", price: 2200, size: 380, beds: 4, baths: 4, garage: 2, year: 2021,
    featured: true,
    images: ["photo-1600596542815-ffad4c1539a9", "photo-1600585154340-be6161a56a0c", "photo-1600607687939-ce8a6c25118c"],
    desc: "فيلا ضمن مجمع سكني مسوّر بخدمات متكاملة، تصميم مفتوح وإضاءة طبيعية وافرة، حديقة ومسبح.",
    features: ["مجمع مسوّر", "مسبح", "نادي رياضي", "حراسة", "حديقة"],
    agent: 1
  },
  {
    id: 9, title: "شقة فاخرة في مجمع سكني", type: "apartment", purpose: "sale",
    city: "حلب", area: "الفرقان", price: 95000, size: 175, beds: 3, baths: 2, garage: 1, year: 2024,
    featured: false,
    images: ["photo-1545324418-cc1a3fa10c00", "photo-1502672260266-1c1ef2d93688", "photo-1484154218962-a197022b5858"],
    desc: "شقة حديثة البناء ضمن مجمع سكني متكامل الخدمات، تشطيب فاخر وغرف واسعة ومطبخ أمريكي.",
    features: ["مطبخ أمريكي", "مصعد", "موقف خاص", "تدفئة أرضية"],
    agent: 2
  },
  {
    id: 10, title: "منزل ريفي هادئ", type: "house", purpose: "rent",
    city: "كوباني", area: "طريق صرين", price: 250, size: 200, beds: 3, baths: 2, garage: 1, year: 2016,
    featured: false,
    images: ["photo-1564013799919-ab600027ffc6", "photo-1600210492486-724fe5c67fb0"],
    desc: "منزل أرضي مع فناء واسع وأشجار مثمرة، بعيد عن الضوضاء وقريب من الطريق العام.",
    features: ["فناء واسع", "أشجار مثمرة", "بئر مياه"],
    agent: 0
  },
  {
    id: 11, title: "فيلا كلاسيكية فخمة", type: "villa", purpose: "sale",
    city: "القامشلي", area: "الحي الغربي", price: 240000, size: 450, beds: 6, baths: 5, garage: 3, year: 2017,
    featured: false,
    images: ["photo-1580587771525-78b9dba3b914", "photo-1600566753190-17f0baa2a6c3", "photo-1600607687939-ce8a6c25118c"],
    desc: "فيلا بطراز كلاسيكي على مساحة كبيرة، حدائق واسعة، صالات متعددة، وملحق للضيوف.",
    features: ["ملحق ضيوف", "حدائق واسعة", "نافورة", "تكييف مركزي"],
    agent: 1
  },
  {
    id: 12, title: "بناء تجاري سكني كامل", type: "building", purpose: "sale",
    city: "كوباني", area: "الشارع العام", price: 420000, size: 900, beds: 12, baths: 10, garage: 4, year: 2020,
    featured: false,
    images: ["photo-1460317442991-0ec209397118", "photo-1574362848149-11496d93a7c7"],
    desc: "بناء من خمسة طوابق: محلات في الطابق الأرضي وأربع طوابق سكنية، فرصة استثمارية بعائد إيجاري ممتاز.",
    features: ["عائد استثماري", "محلات أرضية", "مصعد", "مولدة مركزية"],
    agent: 2
  }
];

const AGENTS = [
  { name: "آزاد محمد", role: "مستشار عقاري أول", phone: CONTACT.phone, img: "photo-1507003211169-0a1dd7228f2d", deals: 148 },
  { name: "روجين حسن", role: "مختصة بالشقق السكنية", phone: CONTACT.phone, img: "photo-1494790108377-be9c29b29330", deals: 112 },
  { name: "شيار علي", role: "مختص بالعقارات التجارية", phone: CONTACT.phone, img: "photo-1500648767791-00dcc994a43e", deals: 97 }
];

const TYPES = {
  villa: "فيلا", apartment: "شقة", house: "منزل", office: "مكتب",
  shop: "محل تجاري", land: "أرض", building: "بناء كامل"
};
