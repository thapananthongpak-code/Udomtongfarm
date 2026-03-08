import type { Species } from "../types/species";

export const animals: Species[] = [
  {
    id: "black-swan",
    type: "animal",
    name_th: "หงส์ดำ",
    name_en: "Black Swan",
    scientific_name: "Cygnus atratus",
    short_description: "หงส์สีดำเด่น เป็นนกน้ำขนาดใหญ่",
    description:
      "หงส์ดำเป็นนกน้ำขนาดใหญ่ ลำคอยาว สีดำเด่น และจะงอยปากสีแดง เป็นชนิดที่รู้จักกันมากในออสเตรเลียและถูกนำไปเลี้ยงในหลายประเทศ",
    image: "/images/animals/black-swan.jpg",
    tags: ["Avian", "Waterfowl"],
    references: [
      { title: "Wikipedia - Black Swan", url: "https://en.wikipedia.org/wiki/Black_swan" }
    ]
  },
  {
    id: "mute-swan",
    type: "animal",
    name_th: "หงส์ขาว",
    name_en: "Mute Swan",
    scientific_name: "Cygnus olor",
    short_description: "หงส์สีขาวสง่างาม พบได้ในยุโรปและเอเชีย",
    description:
      "หงส์ขาวเป็นหงส์ขนาดใหญ่ สีขาวล้วน มีโหนกดำที่โคนจะงอยปาก มักพบในแหล่งน้ำจืดและนิยมเลี้ยงเพื่อความสวยงาม",
    image: "/images/animals/mute-swan.jpg",
    tags: ["Avian", "Waterfowl"],
    references: [
      { title: "Wikipedia - Mute swan", url: "https://en.wikipedia.org/wiki/Mute_swan" }
    ]
  },
  {
    id: "egyptian-goose",
    type: "animal",
    name_th: "ห่านอียิปต์",
    name_en: "Egyptian Goose",
    scientific_name: "Alopochen aegyptiaca",
    short_description: "ห่าน/เป็ดน้ำจากแอฟริกา ลวดลายเด่น",
    description:
      "ห่านอียิปต์เป็นนกน้ำพื้นถิ่นของแอฟริกา มีลวดลายสีน้ำตาล-ครีมและแต้มรอบตาเด่น พบตามแหล่งน้ำและทุ่งหญ้า",
    image: "/images/animals/egyptian-goose.jpg",
    tags: ["Avian", "Waterfowl"],
    references: [
      { title: "Wikipedia - Egyptian goose", url: "https://en.wikipedia.org/wiki/Egyptian_goose" }
    ]
  },
  {
    id: "call-duck",
    type: "animal",
    name_th: "เป็ดคอลดักส์",
    name_en: "Call Duck",
    scientific_name: "Anas platyrhynchos domesticus",
    short_description: "เป็ดบ้านสายพันธุ์เล็ก ใช้เลี้ยง/สวยงาม",
    description:
      "Call Duck เป็นสายพันธุ์เป็ดบ้านที่มีขนาดเล็ก นิยมเลี้ยงเพื่อความสวยงาม (เป็นสายพันธุ์ของเป็ดบ้านจากกลุ่ม mallard domesticated)",
    image: "/images/animals/call-duck.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Call duck", url: "https://en.wikipedia.org/wiki/Call_duck" }
    ]
  },
  {
    id: "indian-peafowl",
    type: "animal",
    name_th: "นกยูง",
    name_en: "Indian Peafowl",
    scientific_name: "Pavo cristatus",
    short_description: "นกยูงอินเดีย หางสวยงามเป็นเอกลักษณ์",
    description:
      "นกยูงอินเดียเป็นนกที่มีชื่อเสียงด้านหางยาวลวดลายสวยงาม ตัวผู้มักแสดงแพนหางเพื่อดึงดูดตัวเมีย พบได้ในอนุทวีปอินเดียและถูกเลี้ยงแพร่หลาย",
    image: "/images/animals/indian-peafowl.jpg",
    tags: ["Avian"],
    references: [
      { title: "Wikipedia - Indian peafowl", url: "https://en.wikipedia.org/wiki/Indian_peafowl" }
    ]
  },
  {
    id: "white-eared-pheasant",
    type: "animal",
    name_th: "ไก่ป่าหูขาว",
    name_en: "White-eared Pheasant",
    scientific_name: "Crossoptilon crossoptilon",
    short_description: "ไก่ฟ้ากลุ่มหูขาว พบแถบจีน/เทือกเขา",
    description:
      "White-eared pheasant เป็นนกตระกูลไก่ฟ้า มีลักษณะเด่นคือขนสีขาวบริเวณแก้ม/หู พบตามพื้นที่สูงและทุ่งหญ้าในบางภูมิภาคของจีน",
    image: "/images/animals/white-eared-pheasant.jpg",
    tags: ["Avian", "Pheasant"],
    references: [
      { title: "Wikipedia - White-eared pheasant", url: "https://en.wikipedia.org/wiki/White-eared_pheasant" }
    ]
  },
  {
    id: "domestic-goose",
    type: "animal",
    name_th: "ห่าน",
    name_en: "Domestic Goose",
    scientific_name: "Anser anser domesticus",
    short_description: "ห่านเลี้ยงในบ้าน ใช้เลี้ยงดูแลพื้นที่/สวยงาม",
    description:
      "ห่านบ้านเป็นสัตว์ปีกเลี้ยง มีพฤติกรรมรวมฝูงและร้องดัง บางพื้นที่นิยมเลี้ยงเพื่อเฝ้าบ้าน/สวน หรือเพื่อเนื้อและไข่",
    image: "/images/animals/domestic-goose.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Domestic goose", url: "https://en.wikipedia.org/wiki/Domestic_goose" }
    ]
  },
  {
    id: "scarlet-macaw",
    type: "animal",
    name_th: "นกแก้วมาคอว์",
    name_en: "Scarlet Macaw",
    scientific_name: "Ara macao",
    short_description: "มาคอว์สีแดงสด ขนาดใหญ่จากอเมริกากลาง-ใต้",
    description:
      "Scarlet macaw เป็นนกแก้วขนาดใหญ่ สีแดง-เหลือง-น้ำเงินเด่น พบในป่าฝนเขตร้อนของอเมริกากลางและอเมริกาใต้ นิยมเลี้ยงในกรงนกขนาดใหญ่",
    image: "/images/animals/scarlet-macaw.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Scarlet macaw", url: "https://en.wikipedia.org/wiki/Scarlet_macaw" }
    ]
  },
  {
    id: "rose-ringed-parakeet",
    type: "animal",
    name_th: "นกแก้วริงเน็ต",
    name_en: "Rose-ringed Parakeet",
    scientific_name: "Psittacula krameri",
    short_description: "นกแก้วขนาดกลาง มีวงแหวนรอบคอในตัวผู้",
    description:
      "Rose-ringed parakeet เป็นนกแก้วที่พบตามธรรมชาติในแอฟริกาและเอเชียใต้-ตะวันตก และถูกนำไปอยู่หลายพื้นที่ ตัวผู้มักมีวงแหวนรอบคอเด่น",
    image: "/images/animals/rose-ringed-parakeet.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Rose-ringed parakeet", url: "https://en.wikipedia.org/wiki/Rose-ringed_parakeet" }
    ]
  },
  {
    id: "crimson-conure",
    type: "animal",
    name_th: "นกแก้วคริมสันคอนัวร์",
    name_en: "Crimson-bellied Parakeet (Conure)",
    scientific_name: "Pyrrhura perlata",
    short_description: "คอนัวร์ขนาดเล็ก สีท้องแดง (ชื่อสามัญอาจเรียกต่างกัน)",
    description:
      "กลุ่ม conure มีหลายชนิด ชื่อเรียกอาจต่างกันตามแหล่งเลี้ยง/ตลาด สำหรับรายการนี้ใช้ชนิดที่รู้จักกันในชื่อ Crimson-bellied parakeet (Pyrrhura perlata) เป็นตัวแทน",
    image: "/images/animals/crimson-conure.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Crimson-bellied parakeet", url: "https://en.wikipedia.org/wiki/Crimson-bellied_parakeet" }
    ]
  },
  {
    id: "amazon-parrot",
    type: "animal",
    name_th: "นกแก้วอเมซอน",
    name_en: "Amazon Parrot",
    scientific_name: "Amazona spp.",
    short_description: "กลุ่มนกแก้วอเมซอน หลายชนิด มีชื่อเสียงเรื่องเลียนเสียง",
    description:
      "Amazon parrots เป็นกลุ่มนกแก้วสกุล Amazona มีหลายชนิด มักมีสีเขียวเป็นหลักและมีความสามารถในการเรียนรู้เสียง/คำพูดที่ดี (ชนิดจริงในฟาร์มสามารถระบุเพิ่มภายหลังได้)",
    image: "/images/animals/amazon-parrot.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Amazona", url: "https://en.wikipedia.org/wiki/Amazona" }
    ]
  },
  {
    id: "guineafowl",
    type: "animal",
    name_th: "ไก่ต๊อก",
    name_en: "Helmeted Guineafowl",
    scientific_name: "Numida meleagris",
    short_description: "ไก่ต๊อกลายจุด พบในแอฟริกา นิยมเลี้ยง",
    description:
      "Helmeted guineafowl เป็นนกในแอฟริกา มีลายจุดบนลำตัว เสียงร้องดังและมีพฤติกรรมรวมฝูง บางพื้นที่นิยมเลี้ยงในฟาร์ม",
    image: "/images/animals/guineafowl.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Helmeted guineafowl", url: "https://en.wikipedia.org/wiki/Helmeted_guineafowl" }
    ]
  },
  {
    id: "red-junglefowl",
    type: "animal",
    name_th: "ไก่ป่าอินเดีย",
    name_en: "Red Junglefowl",
    scientific_name: "Gallus gallus",
    short_description: "บรรพบุรุษของไก่บ้าน พบในเอเชียใต้-ตะวันออกเฉียงใต้",
    description:
      "Red junglefowl เป็นไก่ป่าที่ถือว่าเป็นบรรพบุรุษของไก่บ้าน พบในป่าและพื้นที่รอยต่อป่าหลายประเทศในเอเชีย",
    image: "/images/animals/red-junglefowl.jpg",
    tags: ["Avian", "Galliformes"],
    references: [
      { title: "Wikipedia - Red junglefowl", url: "https://en.wikipedia.org/wiki/Red_junglefowl" }
    ]
  },
  {
    id: "golden-pheasant",
    type: "animal",
    name_th: "ไก่ฟ้าสีทอง",
    name_en: "Golden Pheasant",
    scientific_name: "Chrysolophus pictus",
    short_description: "ไก่ฟ้าสีสันสดจากจีน นิยมเลี้ยงเพื่อความสวยงาม",
    description:
      "Golden pheasant เป็นไก่ฟ้าที่มีสีสันโดดเด่น โดยเฉพาะบริเวณหัวและลำตัว นิยมเลี้ยงในสวนสัตว์/ฟาร์มเพื่อความสวยงาม",
    image: "/images/animals/golden-pheasant.jpg",
    tags: ["Avian", "Pheasant"],
    references: [
      { title: "Wikipedia - Golden pheasant", url: "https://en.wikipedia.org/wiki/Golden_pheasant" }
    ]
  }
];