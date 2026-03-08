import type { Species } from "../types/species";

export const plants: Species[] = [
  {
    id: "teak",
    type: "plant",
    name_th: "ต้นสักทอง",
    name_en: "Teak",
    scientific_name: "Tectona grandis",
    short_description: "ไม้เศรษฐกิจสำคัญ เนื้อไม้ทนทาน",
    description:
      "สักเป็นไม้เนื้อแข็งที่นิยมใช้ในงานเฟอร์นิเจอร์และก่อสร้าง เนื้อไม้คงทน มีคุณสมบัติทนต่อสภาพอากาศ",
    image: "/images/plants/teak.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Teak", url: "https://en.wikipedia.org/wiki/Teak" }
    ]
  },
  {
    id: "burmese-rosewood",
    type: "plant",
    name_th: "ต้นประดู่ป่า",
    name_en: "Burmese Rosewood",
    scientific_name: "Pterocarpus macrocarpus",
    short_description: "ไม้เนื้อแข็ง ใช้ทำงานไม้และเฟอร์นิเจอร์",
    description:
      "ประดู่ป่าเป็นไม้เนื้อแข็ง มีค่าทางเศรษฐกิจ นิยมใช้ในงานไม้และเฟอร์นิเจอร์",
    image: "/images/plants/burmese-rosewood.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Pterocarpus macrocarpus", url: "https://en.wikipedia.org/wiki/Pterocarpus_macrocarpus" }
    ]
  },
  {
    id: "siamese-rosewood",
    type: "plant",
    name_th: "ต้นพะยูง",
    name_en: "Siamese Rosewood",
    scientific_name: "Dalbergia cochinchinensis",
    short_description: "ไม้หวงห้าม/มีค่ามาก นิยมงานไม้หรู",
    description:
      "พะยูงเป็นไม้เนื้อแข็งในสกุล Dalbergia มีค่าทางเศรษฐกิจสูงและได้รับการคุ้มครองในหลายพื้นที่",
    image: "/images/plants/siamese-rosewood.jpg",
    tags: ["Protected", "Hardwood"],
    references: [
      { title: "Wikipedia - Dalbergia cochinchinensis", url: "https://en.wikipedia.org/wiki/Dalbergia_cochinchinensis" }
    ]
  },
  {
    id: "payom",
    type: "plant",
    name_th: "ต้นพยอม",
    name_en: "White Meranti (Payom)",
    scientific_name: "Shorea roxburghii",
    short_description: "ไม้ในวงศ์ยาง (Dipterocarpaceae) พบในเอเชียตะวันออกเฉียงใต้",
    description:
      "พยอมเป็นไม้ในสกุล Shorea พบในเอเชียตะวันออกเฉียงใต้ มีคุณค่าในด้านเนื้อไม้และระบบนิเวศ",
    image: "/images/plants/payom.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Shorea roxburghii", url: "https://en.wikipedia.org/wiki/Shorea_roxburghii" }
    ]
  },
  {
    id: "takhian-thong",
    type: "plant",
    name_th: "ต้นตะเคียนทอง",
    name_en: "Takhian (Hopea)",
    scientific_name: "Hopea odorata",
    short_description: "ไม้ยืนต้นในวงศ์ยาง มีความสำคัญเชิงป่าไม้",
    description:
      "ตะเคียนทองเป็นไม้ยืนต้นในวงศ์ Dipterocarpaceae พบในเอเชียตะวันออกเฉียงใต้ มีเนื้อไม้แข็งแรง",
    image: "/images/plants/takhian-thong.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Hopea odorata", url: "https://en.wikipedia.org/wiki/Hopea_odorata" }
    ]
  },
  {
    id: "chingchan",
    type: "plant",
    name_th: "ต้นชิงชัน",
    name_en: "Dalbergia (Chingchan)",
    scientific_name: "Dalbergia oliveri",
    short_description: "ไม้สกุล Dalbergia ใช้ทำงานไม้",
    description:
      "ชิงชันเป็นไม้ในสกุล Dalbergia ที่มีความสำคัญทางเศรษฐกิจ นิยมใช้เป็นไม้เนื้อแข็งสำหรับงานไม้",
    image: "/images/plants/chingchan.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Dalbergia oliveri", url: "https://en.wikipedia.org/wiki/Dalbergia_oliveri" }
    ]
  },
  {
    id: "yang-na",
    type: "plant",
    name_th: "ต้นยางนา",
    name_en: "Yang Na",
    scientific_name: "Dipterocarpus alatus",
    short_description: "ไม้ยืนต้นใหญ่ในวงศ์ยาง มีเรซิน",
    description:
      "ยางนาเป็นไม้ยืนต้นขนาดใหญ่ พบในเอเชียตะวันออกเฉียงใต้ มีเรซินและมีบทบาทต่อระบบนิเวศป่า",
    image: "/images/plants/yang-na.jpg",
    tags: ["Large tree", "Resin"],
    references: [
      { title: "Wikipedia - Dipterocarpus alatus", url: "https://en.wikipedia.org/wiki/Dipterocarpus_alatus" }
    ]
  },
  {
    id: "bamboo",
    type: "plant",
    name_th: "ต้นไผ่",
    name_en: "Bamboo",
    scientific_name: "Bambusoideae",
    short_description: "พืชวงศ์หญ้า ใช้ประโยชน์ได้หลากหลาย",
    description:
      "ไผ่เป็นพืชในอนุวงศ์ Bambusoideae อยู่ในวงศ์หญ้า ใช้ทำงานก่อสร้าง งานจักสาน และอาหาร",
    image: "/images/plants/bamboo.jpg",
    tags: ["Grass"],
    references: [
      { title: "Wikipedia - Bamboo", url: "https://en.wikipedia.org/wiki/Bamboo" }
    ]
  },
  {
    id: "salao",
    type: "plant",
    name_th: "ต้นเสลา",
    name_en: "Lagerstroemia (Salao)",
    scientific_name: "Lagerstroemia loudonii",
    short_description: "ไม้ดอกสวย นิยมปลูกประดับ",
    description:
      "เสลาเป็นไม้ดอกในสกุล Lagerstroemia ออกดอกสวยงาม นิยมปลูกเป็นไม้ประดับตามถนนและสวน",
    image: "/images/plants/salao.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Lagerstroemia loudonii", url: "https://en.wikipedia.org/wiki/Lagerstroemia_loudonii" }
    ]
  },
  {
    id: "red-padau",
    type: "plant",
    name_th: "ต้นประดู่แดง",
    name_en: "Narra (Red Paduak)",
    scientific_name: "Pterocarpus indicus",
    short_description: "ไม้เนื้อแข็ง ใช้ทำงานไม้/ร่มเงา",
    description:
      "ประดู่แดง (Narra) เป็นไม้ยืนต้นในสกุล Pterocarpus มีการปลูกเป็นไม้ให้ร่มเงาและใช้เนื้อไม้",
    image: "/images/plants/red-padau.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Pterocarpus indicus", url: "https://en.wikipedia.org/wiki/Pterocarpus_indicus" }
    ]
  },
  {
    id: "pak-wan-pa",
    type: "plant",
    name_th: "ต้นผักหวาน",
    name_en: "Pak Wan Pa",
    scientific_name: "Melientha suavis",
    short_description: "พืชกินใบยอดอ่อน นิยมในอาหารไทย",
    description:
      "ผักหวานป่าเป็นพืชที่ยอดอ่อนนิยมใช้ทำอาหาร มีการปลูกและดูแลในสวน/ฟาร์มหลายพื้นที่",
    image: "/images/plants/pak-wan-pa.jpg",
    tags: ["Edible"],
    references: [
      { title: "Wikipedia - Melientha suavis", url: "https://en.wikipedia.org/wiki/Melientha_suavis" }
    ]
  },
  {
    id: "pomelo",
    type: "plant",
    name_th: "ต้นส้มโอ",
    name_en: "Pomelo",
    scientific_name: "Citrus maxima",
    short_description: "ไม้ผลตระกูลส้ม ผลใหญ่ กลิ่นหอม",
    description:
      "ส้มโอเป็นไม้ผลตระกูล Citrus มีผลขนาดใหญ่ นิยมปลูกเพื่อบริโภคและทำผลิตภัณฑ์ต่าง ๆ",
    image: "/images/plants/pomelo.jpg",
    tags: ["Fruit tree"],
    references: [
      { title: "Wikipedia - Pomelo", url: "https://en.wikipedia.org/wiki/Pomelo" }
    ]
  },
  {
    id: "guava",
    type: "plant",
    name_th: "ต้นฝรั่ง",
    name_en: "Guava",
    scientific_name: "Psidium guajava",
    short_description: "ไม้ผลยอดนิยม ปลูกง่าย",
    description:
      "ฝรั่งเป็นไม้ผลเขตร้อน ปลูกง่าย ให้ผลผลิตเร็ว นิยมบริโภคสดหรือแปรรูป",
    image: "/images/plants/guava.jpg",
    tags: ["Fruit tree"],
    references: [
      { title: "Wikipedia - Guava", url: "https://en.wikipedia.org/wiki/Guava" }
    ]
  },
  {
    id: "lime",
    type: "plant",
    name_th: "ต้นมะนาว",
    name_en: "Key Lime",
    scientific_name: "Citrus aurantiifolia",
    short_description: "ไม้ผลตระกูลส้ม ใช้ในอาหารและเครื่องดื่ม",
    description:
      "มะนาวเป็นพืชสกุล Citrus นิยมใช้ปรุงอาหารและเครื่องดื่ม มีรสเปรี้ยวและกลิ่นหอม",
    image: "/images/plants/lime.jpg",
    tags: ["Fruit tree"],
    references: [
      { title: "Wikipedia - Key lime", url: "https://en.wikipedia.org/wiki/Key_lime" }
    ]
  },
  {
    id: "golden-shower",
    type: "plant",
    name_th: "ต้นคูน",
    name_en: "Golden Shower Tree",
    scientific_name: "Cassia fistula",
    short_description: "ไม้ดอกสีเหลือง เป็นไม้ประจำชาติไทย",
    description:
      "คูนหรือราชพฤกษ์ออกดอกสีเหลืองเป็นช่อสวยงาม นิยมปลูกเป็นไม้ประดับ",
    image: "/images/plants/golden-shower.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Cassia fistula", url: "https://en.wikipedia.org/wiki/Cassia_fistula" }
    ]
  },
  {
    id: "croton",
    type: "plant",
    name_th: "ต้นโกศล",
    name_en: "Croton",
    scientific_name: "Codiaeum variegatum",
    short_description: "ไม้ประดับใบสีสันหลากหลาย",
    description:
      "โกศลเป็นไม้ประดับ ใบมีสีและลวดลายหลากหลาย นิยมปลูกตกแต่งสวนและอาคาร",
    image: "/images/plants/croton.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Codiaeum variegatum", url: "https://en.wikipedia.org/wiki/Codiaeum_variegatum" }
    ]
  },
  {
    id: "makok",
    type: "plant",
    name_th: "ต้นมะกอก",
    name_en: "Indian Hog Plum",
    scientific_name: "Spondias pinnata",
    short_description: "ไม้ผลพื้นถิ่นเอเชีย ผลกินได้",
    description:
      "มะกอกไทยมักหมายถึง Spondias pinnata ผลกินได้ มีรสเปรี้ยว-ฝาด นำไปทำอาหาร/แปรรูปได้",
    image: "/images/plants/makok.jpg",
    tags: ["Fruit tree"],
    references: [
      { title: "Wikipedia - Spondias pinnata", url: "https://en.wikipedia.org/wiki/Spondias_pinnata" }
    ]
  },
  {
    id: "daeng-xylia",
    type: "plant",
    name_th: "ต้นแดง",
    name_en: "Xylia",
    scientific_name: "Xylia xylocarpa",
    short_description: "ไม้เนื้อแข็ง แข็งแรงทนทาน",
    description:
      "ต้นแดงเป็นไม้เนื้อแข็ง มีความทนทาน นิยมใช้เป็นไม้ก่อสร้างหรือทำเครื่องมือบางชนิด",
    image: "/images/plants/daeng.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Xylia xylocarpa", url: "https://en.wikipedia.org/wiki/Xylia_xylocarpa" }
    ]
  },
  {
    id: "kratom",
    type: "plant",
    name_th: "ต้นกะท่อม",
    name_en: "Kratom",
    scientific_name: "Mitragyna speciosa",
    short_description: "พืชพื้นถิ่นเอเชียตะวันออกเฉียงใต้ (มีข้อกำกับทางกฎหมาย/การใช้)",
    description:
      "กะท่อมเป็นพืชในวงศ์กาแฟ (Rubiaceae) พบในเอเชียตะวันออกเฉียงใต้ มีการใช้งานหลากหลายและอาจมีข้อกำกับตามกฎหมายในแต่ละพื้นที่",
    image: "/images/plants/kratom.jpg",
    tags: ["Botanical"],
    references: [
      { title: "Wikipedia - Mitragyna speciosa", url: "https://en.wikipedia.org/wiki/Mitragyna_speciosa" }
    ]
  },
  {
    id: "flame-tree",
    type: "plant",
    name_th: "ต้นทองกวาว",
    name_en: "Flame-of-the-forest",
    scientific_name: "Butea monosperma",
    short_description: "ไม้ดอกสีส้ม-แดงเด่น นิยมปลูกประดับ",
    description:
      "ทองกวาวเป็นไม้ดอกที่มีสีส้ม-แดงสดโดดเด่น ออกดอกเป็นช่อ นิยมปลูกเป็นไม้ประดับ",
    image: "/images/plants/thongkwao.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Butea monosperma", url: "https://en.wikipedia.org/wiki/Butea_monosperma" }
    ]
  }
];