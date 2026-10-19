/**
 * Initial content of the public website, transcribed from the approved
 * Illustrator artboards (9 September 2026). Every figure and sentence here is
 * content the business supplied through its designer; nothing is invented.
 * Items the design did not provide (full bodies for five articles, exact plot
 * coordinates, the profile PDF) are left absent and recorded in ASSUMPTIONS.md.
 */
import type { ContentBlock } from "@/lib/content-blocks";

export const siteSettings = {
  id: "default",
  companyNameAr: "شركة رُصافة العقارية",
  companyNameEn: "RUSAFAH Real Estate",
  taglineAr: "تجربــة تِفهمك",
  taglineEn: "Designed Around Your Life",
  unifiedNumber: "920032809",
  internationalNumber: "+966920032809",
  whatsappNumber: "+966920032809",
  email: "Rusafa@gmail.com",
  googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("شركة رصافة العقارية الرياض")}`,
  socialLinks: {
    x: "https://x.com/rusafahre",
    instagram: "https://www.instagram.com/rusafahre/",
  },
  profileDocumentPath: null as string | null,
};

const STATS_SOURCE =
  "أرقام واردة في التصميم المعتمد للموقع الإلكتروني (٩ سبتمبر ٢٠٢٦) — بانتظار تأكيد الإدارة";

export const companyStats = [
  {
    key: "built_area_sqm",
    value: "72787",
    prefixAr: "+",
    labelAr: "إجمالي مسطحات البناء.",
    unitAr: "م²",
    sort: 1,
  },
  {
    key: "units_total",
    value: "230",
    prefixAr: "+",
    labelAr: "إجمالي الوحدات السكنية.",
    unitAr: null,
    sort: 2,
  },
  {
    key: "projects_total",
    value: "18",
    prefixAr: "أكثر من",
    labelAr: "مشروعاً سكنياً في مدينة الرياض.",
    unitAr: null,
    sort: 3,
  },
  {
    key: "portfolio_value_million_sar",
    value: "558",
    prefixAr: "نحو",
    labelAr: "القيمة الإجمالية للمحفظة العقارية المطوّرة",
    unitAr: "مليون ريال",
    sort: 4,
  },
].map((s) => ({ ...s, asOf: "2026-09-09", sourceAr: STATS_SOURCE }));

export const partners = [
  { nameAr: "روشن", nameEn: "ROSHN", logoPath: "/images/partners/roshn.png", sort: 1 },
  {
    nameAr: "وافي — البيع والتأجير على الخارطة",
    nameEn: "Wafi",
    logoPath: "/vectors/partner-wafi.svg",
    sort: 2,
  },
  {
    nameAr: "وزارة الشؤون البلدية والقروية والإسكان",
    nameEn: "Ministry of Municipal Rural Affairs & Housing",
    logoPath: "/vectors/partner-ministry.svg",
    sort: 3,
  },
  {
    nameAr: "فرز الوحدات العقارية",
    nameEn: "Subdivision",
    logoPath: "/vectors/partner-subdivision.svg",
    sort: 4,
  },
];

export const certificates = [
  {
    titleAr: "شهادة تأهيل مطور عقـاري",
    issuerAr: "الهيئة العامة للعقار — البيع والتأجير على الخارطة",
    logoPath: "/vectors/cert-rega-sale.svg",
    sort: 1,
  },
  {
    titleAr: "شهادة تأهيل مطور عقـاري",
    issuerAr: "الهيئة العامة للعقار — المساهمات العقارية",
    logoPath: "/vectors/cert-rega-contrib.svg",
    sort: 2,
  },
  {
    titleAr: "رخصة نشـاط تجـاري",
    issuerAr: "خدمات بلدي — أمانة منطقة الرياض",
    logoPath: "/images/certificates/balady-amanah.png",
    sort: 3,
  },
  {
    titleAr: "شهادة تأهيل مطور عقـاري",
    issuerAr: "وزارة الشؤون البلدية والقروية والإسكان",
    logoPath: "/vectors/cert-ministry.svg",
    sort: 4,
  },
  {
    titleAr: "رخصـة ممارسة النشاط التجاري",
    issuerAr: "الهيئة العامة للعقار — فال",
    logoPath: "/images/certificates/rega-fal.png",
    sort: 5,
  },
];

/** Neighbourhood centres in Riyadh. Pins are marked district-level until exact plot coordinates are supplied. */
const DISTRICTS: Record<string, { lat: string; lng: string }> = {
  الريان: { lat: "24.699000", lng: "46.772000" },
  المروج: { lat: "24.758000", lng: "46.662000" },
  العقيق: { lat: "24.769000", lng: "46.628000" },
  الروابي: { lat: "24.679000", lng: "46.776000" },
  النرجس: { lat: "24.863000", lng: "46.658000" },
  الملقا: { lat: "24.806000", lng: "46.607000" },
};

type SeedImage = { path: string; altAr: string; kind: "card" | "hero" | "gallery" };

export type SeedProject = {
  code: string;
  district: string;
  propertyTypes: ("apartments" | "floors" | "villas")[];
  status: "available" | "coming_soon" | "sold";
  visitAvailable?: boolean;
  isFeatured?: boolean;
  brandNameAr?: string;
  brandLogoPath?: string;
  descriptionAr?: string;
  priceMin?: string;
  priceMax?: string;
  landAreaSqm?: string;
  modelsCount?: number;
  unitsCount?: number;
  unitsRemaining?: number;
  floorsCount?: number;
  salesProgressPercent?: string;
  constructionDate?: string;
  images: SeedImage[];
  features?: string[];
  warranties?: { years: number; itemsAr: string[] }[];
  units?: {
    code: string;
    modelCode: string;
    floorLabelAr: string;
    areaSqm: string;
    bedrooms: number;
    bathrooms: number;
    price: string;
    floorPlanPath: string;
    specsAr: string;
  }[];
};

const img = (code: string, file: string, altAr: string, kind: SeedImage["kind"]): SeedImage => ({
  path: `/images/projects/rusafah-${code}/${file}`,
  altAr,
  kind,
});

export const projects: SeedProject[] = [
  {
    code: "16",
    district: "الروابي",
    propertyTypes: ["villas", "floors"],
    status: "coming_soon",
    images: [img("16", "card.jpg", "واجهات مشروع رصافة 16 في حي الروابي عند الغروب", "card")],
  },
  {
    code: "15",
    district: "الروابي",
    propertyTypes: ["villas", "floors"],
    status: "coming_soon",
    images: [img("15", "card.jpg", "واجهة مشروع رصافة 15 بمشربيات حجرية ومداخل مقوّسة", "card")],
  },
  {
    code: "14",
    district: "الريان",
    propertyTypes: ["villas", "floors"],
    status: "available",
    visitAvailable: true,
    isFeatured: true,
    brandNameAr: "سَجِيّ",
    brandLogoPath: "/images/masks/subbrand.png",
    descriptionAr:
      "مشروع الفلل السكنية بالرياض - حي الريان المتكاملة بالخدمات التي يبحث عنها كل فرد ينوي التملّك في بيت المستقبل، بتصميمه المميز، وموقعه الاستراتيجي الفريد وخدمات متعددة تحقق طموحك في السكن في منزل العمر. الفلل السكنية تتكون من ١٥ وحدة مصممة بعناية لتلبية احتياجات العائلات العصرية وتجربة سكنية فريدة.",
    priceMin: "1359660",
    priceMax: "2073139",
    landAreaSqm: "2740",
    modelsCount: 5,
    unitsCount: 15,
    unitsRemaining: 15,
    floorsCount: 3,
    salesProgressPercent: "10",
    constructionDate: "2026-06-07",
    images: [
      img("14", "card.jpg", "فلل مشروع رصافة 14 (سَجِيّ) في حي الريان ليلاً مع النخيل", "card"),
      img("14", "hero.jpg", "واجهة فلل رصافة 14 عند الغروب ومظلة السيارات المشبكة", "hero"),
      img("14", "gallery-1.jpg", "فلل رصافة 14 بالنهار مع النخيل والسيارات", "gallery"),
      img("14", "gallery-2.jpg", "فلل رصافة 14 مساءً مع الإضاءة الخارجية", "gallery"),
    ],
    features: [
      "منزل ذكي",
      "تكييف مخفي",
      "احواش / اسطح خاصة",
      "مداخل خاصة",
      "مكنسة مركزية",
      "تيراس",
    ],
    warranties: [
      { years: 1, itemsAr: ["الأبواب", "المناطق المشتركة"] },
      { years: 2, itemsAr: ["النوافذ", "المصاعد", "الإضاءة", "سمارت هوم"] },
      { years: 5, itemsAr: ["تمديدات التكييف", "الأدوات الصحية", "المكانس المركزية"] },
      { years: 10, itemsAr: ["الهيكل الإنشائي", "أعمال العزل"] },
      { years: 15, itemsAr: ["التمديدات الحرارية"] },
      { years: 25, itemsAr: ["طبلون الكهرباء", "الأفياش"] },
    ],
    units: [
      {
        code: "A-1",
        modelCode: "A",
        floorLabelAr: "الأرضي",
        areaSqm: "252.27",
        bedrooms: 3,
        bathrooms: 5,
        price: "1693135",
        floorPlanPath: "/images/units/rusafah-14-a1-plan.jpg",
        specsAr:
          "مجلس مستقل - صالة عائلية - مطبخ - صالة طعام - غرفة خادمة - 3 غرف نوم ماستر - 5 دورات مياه",
      },
    ],
  },
  {
    code: "11",
    district: "العقيق",
    propertyTypes: ["floors"],
    status: "available",
    visitAvailable: true,
    isFeatured: true,
    images: [
      img("11", "card.jpg", "أدوار مشروع رصافة 11 في حي العقيق مع النخيل عند الغروب", "card"),
      img("11", "hero.jpg", "واجهة مشروع رصافة 11 بالكتل البيضاء والزجاج", "hero"),
      img("11", "gallery-1.jpg", "زاوية من مشروع رصافة 11 مع النخيل", "gallery"),
    ],
  },
  {
    code: "09",
    district: "المروج",
    propertyTypes: ["floors"],
    status: "available",
    visitAvailable: true,
    isFeatured: true,
    images: [
      img("09", "card.jpg", "أدوار مشروع رصافة 09 في حي المروج بالنهار", "card"),
      img("09", "hero.jpg", "واجهة مشروع رصافة 09 مساءً بالخشب والزجاج", "hero"),
    ],
  },
  {
    code: "08",
    district: "الريان",
    propertyTypes: ["apartments"],
    status: "available",
    visitAvailable: true,
    isFeatured: true,
    images: [
      img("08", "card.jpg", "شقق مشروع رصافة 08 في حي الريان مضاءة عند المغيب", "card"),
      img("08", "gallery-1.jpg", "مبنى رصافة 08 بالنهار", "gallery"),
    ],
  },
  {
    code: "06",
    district: "الريان",
    propertyTypes: ["apartments", "floors"],
    status: "sold",
    images: [img("06", "card.jpg", "مشروع رصافة 06 في حي الريان بواجهات مثقّبة", "card")],
  },
  {
    code: "05",
    district: "الريان",
    propertyTypes: ["apartments"],
    status: "sold",
    images: [img("05", "card.jpg", "شقق مشروع رصافة 05 في حي الريان", "card")],
  },
  {
    code: "04",
    district: "النرجس",
    propertyTypes: ["villas"],
    status: "sold",
    images: [img("04", "card.jpg", "فلل مشروع رصافة 04 في حي النرجس ليلاً", "card")],
  },
  {
    code: "03",
    district: "الملقا",
    propertyTypes: ["villas"],
    status: "sold",
    images: [img("03", "card.jpg", "فلل مشروع رصافة 03 في حي الملقا", "card")],
  },
  {
    code: "02",
    district: "النرجس",
    propertyTypes: ["villas"],
    status: "sold",
    images: [img("02", "card.jpg", "فلل مشروع رصافة 02 في حي النرجس", "card")],
  },
  {
    code: "01",
    district: "النرجس",
    propertyTypes: ["apartments"],
    status: "sold",
    images: [img("01", "card.jpg", "شقق مشروع رصافة 01 في حي النرجس", "card")],
  },
];

export function projectLocation(district: string) {
  return DISTRICTS[district] ?? null;
}

export const RUSAFAH_14_ARTICLE: ContentBlock[] = [
  {
    type: "paragraph",
    text: "يبحث كثير من العائلات عن أدوار للبيع في حي الريان تجمع بين الموقع المميز، والتصميم العصري، والمساحات التي تلبي احتياجات الحياة اليومية. ومع تنوع الخيارات السكنية في الحي، يصبح اختيار المشروع المناسب مرتبطًا بجودة التخطيط، وتوزيع المساحات، ومستوى الخصوصية والخدمات التي يوفرها.",
  },
  {
    type: "paragraph",
    text: "ويأتي رصافة ١٤ كأحد الخيارات السكنية التي تستهدف احتياجات العائلات، من خلال وحدات مصممة بأسلوب عصري ومساحات عملية توفر بيئة مناسبة للسكن والاستقرار. ومع تنوع الخيارات العقارية بين أدوار للبيع في الريان والفلل السكنية والوحدات العائلية، أصبح من المهم التعرف على تفاصيل المشروع وما يقدمه من مزايا قبل اتخاذ قرار الشراء، خاصة لمن يبحث عن منزل يجمع بين الراحة والتصميم الحديث ومفهوم المنزل الذكي.",
  },
  { type: "heading", text: "موقع حي الريان في الرياض ومميزاته السكنية" },
  {
    type: "paragraph",
    text: "يُعد حي الريان في الرياض من الأحياء السكنية المعروفة في شرق العاصمة، ويتميز بموقعه القريب من عدد من الطرق والمحاور الرئيسية، إلى جانب توفر الخدمات والمرافق التي يحتاجها السكان في حياتهم اليومية، مما يجعله خيارًا مناسبًا للعائلات الباحثة عن الاستقرار في موقع حيوي.",
  },
  { type: "heading", text: "أبرز مميزات موقع حي الريان:" },
  {
    type: "list",
    items: [
      "سهولة الوصول والتنقل: يرتبط الحي بعدد من الطرق الرئيسية، ومنها طريق خريص والطريق الدائري الشرقي، مما يسهل التنقل إلى أجزاء مختلفة من الرياض.",
      "القرب من الأحياء الحيوية: يجاور حي الريان عددًا من الأحياء السكنية مثل الروضة والمنار والروابي والربوة.",
      "توفر الخدمات اليومية: تنتشر بالقرب من الحي المدارس والمراكز الصحية والمحلات التجارية والمطاعم والخدمات التي تلبي احتياجات العائلات.",
      "مناسب للعائلات: طبيعة الحي السكنية وتنوع العقارات فيه تجعله خيارًا مناسبًا لمن يبحث عن وحدات سكنية عملية ومستقرة.",
      "تنوع الخيارات العقارية: تتوفر في المنطقة أدوار وفلل سكنية بمساحات وتصاميم مختلفة، مما يمنح المشترين خيارات متعددة وفق احتياجاتهم.",
      "قرب المشروع من الخدمات: يمثل الموقع عاملًا مهمًا عند اختيار أدوار للبيع في حي الريان، خصوصًا للعائلات التي تبحث عن منزل قريب من احتياجاتها اليومية.",
    ],
  },
  {
    type: "paragraph",
    text: "وبفضل موقعه وخدماته وتنوع خياراته السكنية، يمثل حي الريان بيئة مناسبة للعائلات، ويجعل اختيار مشروع مثل رصافة ١٤ فرصة للتعرف على وحدات سكنية تجمع بين الموقع والتصميم العصري.",
  },
  { type: "heading", text: "ما هي مساحات وأسعار رصافة ١٤ في حي الريان؟" },
  {
    type: "paragraph",
    text: "يوفر رصافة ١٤ وحدات سكنية بتصاميم عصرية ومساحات متنوعة تناسب احتياجات العائلات، مع اختلاف السعر وفق مساحة الوحدة ومواصفاتها. وتبدأ أسعار الوحدات المتاحة في المشروع من حوالي ١٫٣٦ مليون ريال وتصل إلى نحو ٢٫٠٧ مليون ريال، بينما تتنوع المساحات لتتراوح من ٢٠٦٫٨٥ إلى ٢٩٤٫٣٥ م² لتمنح المشترين خيارات أكثر مرونة عند اختيار منزلهم.",
  },
  {
    type: "list",
    items: [
      "مساحات مناسبة للعائلات: صُممت الوحدات بمساحات عملية تساعد على توفير غرف ومعيشة ومساحات خدمية تلائم الاستخدام اليومي.",
      "تنوع الخيارات: اختلاف المساحات والأسعار يتيح للمشتري اختيار الوحدة الأقرب إلى احتياجاته وميزانيته.",
      "تصميم عصري: تجمع الوحدات بين الواجهات الحديثة والتخطيط الداخلي العملي.",
      "تجهيزات حديثة: تشمل مواصفات المشروع عناصر مثل المنزل الذكي، والتكييف المخفي، والمكنسة المركزية، إلى جانب مساحات خارجية خاصة.",
      "موقع سكني مميز: وجود المشروع في حي الريان يضيف ميزة للقرب من الطرق والخدمات الرئيسية في المنطقة.",
    ],
  },
  {
    type: "paragraph",
    text: "وبفضل تنوع المساحات والأسعار، يمكن للراغبين في امتلاك منزل عائلي في شرق الرياض مقارنة خيارات رصافة ١٤ واختيار الوحدة التي تتناسب مع احتياجاتهم، مع ضرورة التأكد من السعر والتوفر الحالي قبل الشراء.",
  },
  { type: "heading", text: "ما الضمانات التي يقدمها مشروع رصافة ١٤؟" },
  {
    type: "paragraph",
    text: "لا تقتصر جودة المشروع السكني على التصميم والمواصفات الحديثة، بل تمتد إلى ما بعد الاستلام من خلال الضمانات التي تمنح المشتري قدرًا أكبر من الاطمئنان تجاه عناصر المنزل الأساسية. وفي رصافة ١٤، تتنوع مدد الضمان بحسب العنصر المشمول، لتغطي جوانب مختلفة من الوحدة والمرافق، وهو ما يعكس الاهتمام بجودة التنفيذ واستمرارية كفاءة المنزل.",
  },
  {
    type: "list",
    items: [
      "ضمان سنة: يشمل الأبواب وضمان المناطق المشتركة، بما يوفر تغطية للعناصر المرتبطة بالاستخدام اليومي والمساحات المشتركة.",
      "ضمان سنتين: يشمل المصاعد وأعمال العزل، وهي من العناصر المهمة للحفاظ على راحة السكان وجودة المبنى.",
      "ضمان ١٠ سنوات: للهيكل الإنشائي، وهي مدة طويلة تعكس أهمية هذا العنصر في سلامة واستقرار المبنى على المدى البعيد.",
      "ضمان ١٥ سنة: للتمديدات الحرارية، مما يوفر تغطية ممتدة لأحد الأنظمة الأساسية في الوحدة.",
      "ضمان ٢٥ سنة: لطبلون الكهرباء والأفياش، وهي أطول مدة ضمان مذكورة ضمن مواصفات المشروع.",
    ],
  },
  {
    type: "callout",
    title: "هل تبحث عن وحدتك في رصافة ١٤؟",
    text: "تواصل مع فريق رصافة العقارية للتعرف على الوحدات المتاحة في المشروع، ومعرفة المساحات والأسعار والتفاصيل الخاصة بكل وحدة، واتخذ خطوتك نحو امتلاك منزل عصري يناسب احتياجات عائلتك.",
  },
];

export type SeedPost = {
  slug: string;
  category: "article" | "blog" | "news";
  titleAr: string;
  excerptAr: string;
  coverPath: string;
  coverAltAr: string;
  body: ContentBlock[];
  authorNameAr?: string;
  authorOrgAr?: string;
  relatedProjectCode?: string;
  status: "draft" | "published";
  publishedAt: string;
};

export const posts: SeedPost[] = [
  {
    slug: "floors-for-sale-al-rayyan-rusafah-14",
    category: "article",
    titleAr: "أدوار للبيع في حي الريان: رصافة ١٤ بتصميم عصري للعائلات",
    excerptAr: "أدوار للبيع في حي الريان: رصافة ١٤ بتصميم عصري للعائلات...",
    coverPath: "/images/blog/floors-al-rayyan.jpg",
    coverAltAr: "فلل رصافة 14 في حي الريان مع النخيل ومظلة السيارات",
    body: RUSAFAH_14_ARTICLE,
    authorNameAr: "أحمد",
    authorOrgAr: "شركة كودا",
    relatedProjectCode: "14",
    status: "published",
    publishedAt: "2026-09-06T09:00:00+03:00",
  },
  {
    slug: "apartments-for-sale-al-rayyan-guide",
    category: "article",
    titleAr: "شقق للبيع في حي الريان: دليلك لاختيار شقة مناسبة",
    excerptAr: "شقق للبيع في حي الريان: دليلك لاختيار شقة مناسبة..",
    coverPath: "/images/blog/apartments-al-rayyan.jpg",
    coverAltAr: "مبنى سكني في حي الريان مع لافتات بدء البيع",
    body: [],
    status: "draft",
    publishedAt: "2026-08-06T09:00:00+03:00",
  },
  {
    slug: "residential-floor-warranties-riyadh",
    category: "article",
    titleAr: "ضمانات الأدوار السكنية في الرياض: ما الذي يجب أن تعرفه قبل الشراء؟",
    excerptAr: "ضمانات الأدوار السكنية في الرياض: ما الذي يجب أن تعرفه قبل الشراء؟..",
    coverPath: "/images/blog/warranties-riyadh.jpg",
    coverAltAr: "مبنى سكني بواجهة بيضاء ونوافذ عمودية في الرياض",
    body: [],
    status: "draft",
    publishedAt: "2026-09-08T09:00:00+03:00",
  },
  {
    slug: "how-to-choose-a-residential-floor-riyadh",
    category: "article",
    titleAr: "كيف تختار دورًا سكنيًا مناسبًا لعائلتك في الرياض؟",
    excerptAr: "كيف تختار دورًا سكنيًا مناسبًا لعائلتك في الرياض؟",
    coverPath: "/images/blog/choose-floor.jpg",
    coverAltAr: "مبنى سكني بواجهات حجرية مثقّبة",
    body: [],
    status: "draft",
    publishedAt: "2026-09-08T09:00:00+03:00",
  },
  {
    slug: "floors-for-sale-al-aqiq-rusafah-11",
    category: "article",
    titleAr: "أدوار للبيع في حي العقيق: رصافة ١١ خيار سكني في شمال الرياض",
    excerptAr: "أدوار للبيع في حي العقيق: رصافة ١١ خيار سكني في شمال الرياض..",
    coverPath: "/images/blog/floors-al-aqiq.jpg",
    coverAltAr: "واجهة سكنية بكتل بيضاء وقاعدة خشبية",
    body: [],
    relatedProjectCode: "11",
    status: "draft",
    publishedAt: "2026-09-08T09:00:00+03:00",
  },
  {
    slug: "how-to-choose-an-apartment-riyadh",
    category: "article",
    titleAr: "كيف تختار شقة تمليك في الرياض؟",
    excerptAr: "كيف تختار شقة تمليك في الرياض؟..",
    coverPath: "/images/blog/choose-apartment.jpg",
    coverAltAr: "فيلا بواجهات معدنية مثقّبة في الرياض",
    body: [],
    status: "draft",
    publishedAt: "2026-09-08T09:00:00+03:00",
  },
];

export const legalDocuments: { slug: string; titleAr: string; body: ContentBlock[] }[] = [
  {
    slug: "privacy",
    titleAr: "سياسة الخصوصية",
    body: [
      {
        type: "paragraph",
        text: "تُقدّر **شركة رُصافة العقارية** خصوصية زوّار موقعها الإلكتروني، وتلتزم بحماية البيانات الشخصية التي يتم جمعها ومعالجتها من خلال هذا الموقع. توضح هذه السياسة كيفية جمع المعلومات واستخدامها وحمايتها بما يتوافق مع القوانين والأنظمة المعمول بها في المملكة العربية السعودية.",
      },
      { type: "heading", text: "قبول الشروط" },
      {
        type: "paragraph",
        text: "باستخدامك لموقع **رُصافة العقارية** أو أي من خدماته الإلكترونية، فإنك تقرّ بقبول سياسة الخصوصية هذه وتوافق على بنودها. في حال عدم موافقتك على أي جزء منها، يرجى التوقف عن استخدام الموقع.",
      },
      { type: "heading", text: "المعلومات التي نقوم بجمعها" },
      {
        type: "paragraph",
        text: "قد نقوم بجمع أنواع مختلفة من المعلومات عند استخدامك لموقعنا، وتشمل:",
      },
      {
        type: "list",
        items: [
          "المعلومات الشخصية: مثل الاسم، رقم الهاتف، البريد الإلكتروني، والعنوان، عند تعبئة النماذج.",
          "المعلومات التقنية: مثل عنوان الـ IP، نوع المتصفح، نظام التشغيل، الصفحات التي تمت زيارتها، ومدة التصفح.",
          "المعلومات السلوكية: مثل تفضيلات المستخدم وطريقة التفاعل مع المحتوى لتحسين التجربة وتطوير الخدمات.",
        ],
      },
      { type: "heading", text: "كيفية استخدام المعلومات" },
      {
        type: "paragraph",
        text: "تستخدم **رُصافة العقارية** المعلومات التي تجمعها للأغراض التالية:",
      },
      {
        type: "list",
        items: [
          "تحسين تجربة الزائر وتخصيص المحتوى بما يتناسب مع اهتماماته.",
          "التواصل مع العملاء بشأن العروض أو المشاريع أو التحديثات ذات الصلة.",
          "الامتثال للمتطلبات القانونية والتنظيمية داخل المملكة العربية السعودية.",
          "تحليل أداء الموقع وتطوير جودة الخدمات الإلكترونية.",
        ],
      },
      { type: "heading", text: "حماية المعلومات" },
      {
        type: "paragraph",
        text: "تتخذ **رُصافة العقارية** الإجراءات الإدارية والفنية والتنظيمية اللازمة لحماية البيانات الشخصية من الوصول غير المصرح به، أو الاستخدام غير القانوني، أو الفقد، أو التعديل، أو الإفصاح.",
      },
      { type: "heading", text: "مشاركة المعلومات" },
      {
        type: "paragraph",
        text: "لا تقوم **رُصافة العقارية** ببيع أو تأجير أو مشاركة معلوماتك الشخصية مع أي طرف ثالث إلا في الحالات التالية:",
      },
      {
        type: "list",
        items: [
          "إذا طُلب ذلك بموجب الأنظمة أو بأمر من جهة حكومية أو قضائية مختصة.",
          "في حال تم الحصول على موافقة صريحة من المستخدم بالمشاركة.",
          "في جميع الحالات، تضمن الشركة أن يتم التعامل مع البيانات بسرية تامة وفق معايير الخصوصية المعتمدة.",
        ],
      },
      { type: "heading", text: "ملفات تعريف الارتباط (Cookies)" },
      {
        type: "paragraph",
        text: "يستخدم موقعنا ملفات تعريف الارتباط لتحسين تجربة المستخدم وتحليل أداء الموقع. يمكنك التحكم في إعدادات المتصفح لتعطيل هذه الملفات، ولكن قد يؤثر ذلك على بعض وظائف الموقع.",
      },
      { type: "heading", text: "حقوق المستخدم" },
      { type: "paragraph", text: "**يحق للمستخدم:**" },
      {
        type: "list",
        items: [
          "طلب تعديل بياناته الشخصية أو تحديثها.",
          "طلب حذف بياناته من أنظمة الشركة متى لم تعد هناك حاجة قانونية للاحتفاظ بها.",
          "سحب الموافقة على استخدام البيانات لأغراض تسويقية في أي وقت.",
        ],
      },
      {
        type: "paragraph",
        text: "يمكن تقديم هذه الطلبات من خلال قنوات التواصل الرسمية الموضحة أدناه.",
      },
      { type: "heading", text: "التعديلات على السياسة" },
      {
        type: "paragraph",
        text: "تحتفظ **رُصافة العقارية** بحقها في تحديث أو تعديل سياسة الخصوصية هذه من وقت لآخر بما يتناسب مع التطورات التقنية أو القانونية.",
      },
      { type: "heading", text: "تواصل معنا" },
      {
        type: "paragraph",
        text: "في حال وجود أي استفسار أو ملاحظة تتعلق بسياسة الخصوصية، يمكنكم التواصل معنا عبر القنوات الرسمية الموضحة أدناه.",
      },
    ],
  },
  {
    slug: "terms",
    titleAr: "الشروط والأحكام",
    body: [
      { type: "paragraph", text: "**مرحبًا بكم في موقع رُصافة العقارية**" },
      {
        type: "paragraph",
        text: "يُعد دخولك إلى هذا الموقع واستخدامك لخدماته موافقة صريحة منك على الالتزام بالشروط والأحكام الموضحة أدناه. يرجى قراءتها بعناية قبل استخدام الموقع.",
      },
      { type: "heading", text: "القبول بالشروط" },
      {
        type: "paragraph",
        text: "باستخدامك **لموقع رُصافة العقارية**، فإنك توافق على هذه الشروط والأحكام وجميع القوانين والأنظمة ذات الصلة المعمول بها في المملكة العربية السعودية. إذا لم توافق على أي من هذه الشروط، يُرجى الامتناع عن استخدام الموقع.",
      },
      { type: "heading", text: "استخدام الموقع" },
      {
        type: "paragraph",
        text: "يهدف هذا الموقع إلى توفير معلومات عن الشركة ومشاريعها وخدماتها في **مجال التطوير العقاري**. يجب على المستخدم استخدام الموقع لأغراض قانونية ومشروعة فقط، وعدم القيام بأي تصرف يؤدي إلى الإضرار بالموقع أو أنظمته أو بياناته أو سمعته. يُمنع استخدام الموقع بأي شكل يتعارض مع الأنظمة أو حقوق الملكية الفكرية أو القوانين المعمول بها.",
      },
      { type: "heading", text: "الملكية الفكرية" },
      {
        type: "paragraph",
        text: "جميع المحتويات المنشورة على الموقع، بما في ذلك النصوص، الصور، التصاميم، الشعارات، العلامات التجارية، البيانات، والملفات، هي ملكية حصرية **لـ رُصافة العقارية** أو للجهات المرخّصة لها، ومحفوظة بموجب قوانين حقوق النشر والعلامات التجارية. لا يجوز نسخ أو إعادة استخدام أي من هذه المواد لأي غرض تجاري أو عام دون الحصول على إذن خطي مسبق من الشركة.",
      },
      { type: "heading", text: "دقة المعلومات" },
      {
        type: "paragraph",
        text: "لا تتحمل **رُصافة العقارية** أي مسؤولية عن أي خسائر أو أضرار مباشرة أو غير مباشرة قد تنتج عن استخدام الموقع أو الاعتماد على محتواه. لا تضمن الشركة أن يكون الموقع خاليًا من الأخطاء التقنية أو انقطاع الخدمة، رغم اتخاذها للإجراءات الأمنية اللازمة. يتحمل المستخدم كامل المسؤولية عند استخدام الموقع وأي بيانات يتم إدخالها أو تحميلها من خلاله.",
      },
      { type: "heading", text: "التسجيل والبيانات" },
      {
        type: "paragraph",
        text: "عند استخدام بعض الخدمات عبر الموقع، قد يُطلب من المستخدم إدخال بيانات شخصية أو معلومات تواصل. يلتزم المستخدم بتقديم معلومات صحيحة ومحدّثة، وتُطبّق سياسة الخصوصية الخاصة **بـ رُصافة العقارية** على جميع البيانات المقدمة.",
      },
      { type: "heading", text: "التعديلات على الشروط" },
      {
        type: "paragraph",
        text: "تحتفظ **رُصافة العقارية** بحقها في تعديل أو تحديث هذه الشروط والأحكام في أي وقت دون إشعار مسبق. وتصبح التعديلات نافذة فور نشرها على الموقع، ويُعتبر استمرارك في استخدام الموقع موافقة على تلك التعديلات.",
      },
      { type: "heading", text: "القوانين المعمول بها" },
      {
        type: "paragraph",
        text: "تخضع هذه الشروط والأحكام وتُفسّر وفقًا لأنظمة المملكة العربية السعودية، وتكون الجهات القضائية فيها هي المختصة بالنظر في أي نزاع ينشأ عنها.",
      },
      { type: "heading", text: "تواصل معنا" },
      {
        type: "paragraph",
        text: "في حال وجود أي استفسار أو ملاحظة تتعلق بالشروط والأحكام، يمكنكم التواصل معنا عبر القنوات الرسمية الموضحة أدناه.",
      },
    ],
  },
];
