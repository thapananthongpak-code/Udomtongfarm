import type { Species } from "../types/species";

export const animals: Species[] = [
  {
    id: "black-swan",
    type: "animal",
    name_th: "หงส์ดำ",
    name_en: "Black Swan",
    scientific_name: "Cygnus atratus",
    short_description: "หงส์สีดำเด่น นกน้ำขนาดใหญ่จากออสเตรเลีย",
    short_description_en: "Striking black waterbird native to Australia",
    description:
      "หงส์ดำเป็นนกน้ำขนาดใหญ่มีถิ่นกำเนิดในออสเตรเลีย ขนสีดำสนิทตลอดลำตัว จะงอยปากสีแดงสดพร้อมปลายสีขาว ลำคอยาวโค้งงดงาม มีความยาวลำตัว 110–142 ซม. น้ำหนัก 3.7–9 กก. ชอบอาศัยในแหล่งน้ำจืด ทะเลสาบ และพื้นที่ชุ่มน้ำ กินพืชน้ำและสาหร่ายเป็นอาหารหลัก มีพฤติกรรมผูกคู่แบบคู่เดียวตลอดชีวิต ทำรังขนาดใหญ่บริเวณริมน้ำ วางไข่ 5–6 ฟองต่อครั้ง ทั้งตัวผู้และตัวเมียช่วยกันฟักไข่และเลี้ยงลูก ในออสเตรเลียถือเป็นสัญลักษณ์ประจำรัฐเวสเทิร์นออสเตรเลีย อายุขัยในธรรมชาติ 10–15 ปี ในกรงเลี้ยงสูงถึง 40 ปี ปัจจุบันนิยมนำมาเลี้ยงในฟาร์มและสวนสาธารณะทั่วโลกเนื่องจากความงดงามโดดเด่น สถานะการอนุรักษ์: Least Concern (IUCN)",
    description_en:
      "The Black Swan is a large waterbird native to Australia, instantly recognizable by its entirely black plumage and vivid red bill with a white tip. Body length 110–142 cm, weight 3.7–9 kg. Inhabits freshwater lakes, lagoons, and wetlands, feeding mainly on aquatic plants and algae. Monogamous; both parents build large nests near the waterline and share incubation of 5–6 eggs. State emblem of Western Australia. Lifespan 10–15 years wild, up to 40 years in captivity. Widely kept ornamentally in parks and farms worldwide. IUCN status: Least Concern.",
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
    short_description_en: "Elegant white swan native to Europe and Asia",
    description:
      "หงส์ขาวเป็นหนึ่งในนกที่บินได้ซึ่งมีขนาดหนักที่สุดในโลก และเป็นหงส์ที่ใหญ่ที่สุดในยุโรป ขนสีขาวบริสุทธิ์ มีโหนกสีดำที่โคนจะงอยปากสีส้ม ลำคอยาวโค้งงดงาม มีความยาวลำตัว 125–170 ซม. น้ำหนัก 10–12 กก. Wingspan 200–240 ซม. อาศัยในแหล่งน้ำจืดและชายฝั่ง กินพืชน้ำ หญ้า และสัตว์น้ำขนาดเล็ก ใช้ปีกอันกว้างในการป้องกันอาณาเขตอย่างก้าวร้าว ผสมพันธุ์แบบคู่เดียวตลอดชีวิต วางไข่ 5–8 ฟองต่อครั้ง ลูกหงส์ (Cygnet) สีเทาและจะเปลี่ยนเป็นสีขาวเมื่ออายุ 1 ปี ในอังกฤษถือเป็นสัตว์หลวงที่ได้รับการคุ้มครองมาตั้งแต่ศตวรรษที่ 12 สถานะการอนุรักษ์: Least Concern (IUCN)",
    description_en:
      "The Mute Swan is one of the heaviest flying birds and Europe's largest swan. Entirely white plumage; orange-red bill with a distinctive black knob; gracefully curved neck. Body length 125–170 cm, weight 10–12 kg, wingspan 200–240 cm. Inhabits freshwater and coastal areas, feeding on aquatic plants, grasses, and small aquatic animals. Highly territorial, using wings to defend nests aggressively. Monogamous, laying 5–8 eggs; cygnets are gray, turning white at ~1 year. A Royal bird in England protected since the 12th century. IUCN status: Least Concern.",
    image: "/images/animals/mute-swan.jpg",
    tags: ["Avian", "Waterfowl"],
    references: [
      { title: "Wikipedia - Mute Swan", url: "https://en.wikipedia.org/wiki/Mute_swan" }
    ]
  },
  {
    id: "egyptian-goose",
    type: "animal",
    name_th: "ห่านอียิปต์",
    name_en: "Egyptian Goose",
    scientific_name: "Alopochen aegyptiaca",
    short_description: "ห่านน้ำจากแอฟริกา ลวดลายเด่น แต้มรอบตาสีน้ำตาล",
    short_description_en: "African waterbird with distinctive eye-patches and colorful plumage",
    description:
      "ห่านอียิปต์เป็นสมาชิกวงศ์เป็ด-ห่าน (Anatidae) มีถิ่นกำเนิดในทวีปแอฟริกา โดยเฉพาะบริเวณลุ่มแม่น้ำไนล์ ลำตัวสีน้ำตาล-ครีม มีแต้มวงรอบตาสีน้ำตาลเข้มและจุดบนหน้าอกสีน้ำตาลเด่น ขนปีกส่วน Coverts สีขาวตัดกับสีเขียวเมทัลลิก ความยาวลำตัว 63–73 ซม. น้ำหนัก 1.5–2.3 กก. อาศัยในที่ราบชุ่มน้ำ ทุ่งหญ้า และริมฝั่งแม่น้ำ กินหญ้า เมล็ดพืช ใบไม้ และพืชน้ำ มีพฤติกรรมครอบครองอาณาเขตและเสียงร้องดังมาก ทำรังในโพรงไม้ โขดหิน และแม้แต่บนหลังคาอาคาร วางไข่ 5–12 ฟอง ปัจจุบันพบเป็นชนิดพันธุ์ต่างถิ่นที่แพร่กระจายในยุโรป โดยเฉพาะอังกฤษและเนเธอร์แลนด์ สถานะ IUCN: Least Concern",
    description_en:
      "The Egyptian Goose is a member of the Anatidae family, native to Africa — particularly the Nile Valley. Brownish-cream plumage with distinctive dark eye-patches and a dark breast spot; white wing coverts contrast with metallic green. Body length 63–73 cm, weight 1.5–2.3 kg. Inhabits wetlands, grasslands, and riverbanks, feeding on grass, seeds, leaves, and aquatic plants. Highly territorial with loud calls. Nests in tree hollows, rock ledges, or even rooftops; lays 5–12 eggs. Now established as an invasive species in Europe, notably England and the Netherlands. IUCN: Least Concern.",
    image: "/images/animals/egyptian-goose.jpg",
    tags: ["Avian", "Waterfowl"],
    references: [
      { title: "Wikipedia - Egyptian Goose", url: "https://en.wikipedia.org/wiki/Egyptian_goose" }
    ]
  },
  {
    id: "call-duck",
    type: "animal",
    name_th: "เป็ดคอลดักส์",
    name_en: "Call Duck",
    scientific_name: "Anas platyrhynchos domesticus",
    short_description: "เป็ดบ้านสายพันธุ์เล็กที่สุด เสียงดัง นิสัยเป็นมิตร",
    short_description_en: "World's smallest domestic duck breed, known for loud calls and friendly nature",
    description:
      "Call Duck เป็นสายพันธุ์เป็ดบ้านที่มีขนาดเล็กที่สุดในบรรดาเป็ดทุกสายพันธุ์ พัฒนาขึ้นมาในเนเธอร์แลนด์เพื่อใช้เป็น \"นกล่อ\" (Decoy duck) ดึงดูดเป็ดป่าในการล่า เนื่องจากมีเสียงร้องดังและถี่มาก น้ำหนักตัวเพียง 500–700 กรัม มีหัวกลมใหญ่ จะงอยปากสั้น ใบหน้าแบน และลำตัวกลมเตี้ย มีสีหลายแบบ ได้แก่ ขาว เทา น้ำตาล และลายหลากสี ออกไข่ 9–13 ฟองต่อครั้ง อายุขัย 9–12 ปี เป็นที่นิยมในการประกวดสัตว์ปีก (Poultry Show) และเลี้ยงเป็นสัตว์เลี้ยงเนื่องจากขนาดเล็กน่ารักและนิสัยเป็นมิตร ต้องการพื้นที่และน้ำไม่มาก เหมาะสำหรับเลี้ยงในฟาร์มขนาดเล็ก",
    description_en:
      "The Call Duck is the world's smallest domestic duck breed, originally developed in the Netherlands as a 'decoy duck' to lure wild ducks during hunting, owing to its exceptionally loud and frequent quacking. Weight only 500–700 g; characterized by a large round head, very short bill, flat face, and compact round body. Available in many color varieties: white, gray, brown, and pied. Lays 9–13 eggs per clutch; lifespan 9–12 years. Popular at poultry shows and as a pet due to its small size, friendly temperament, and low space requirements — ideal for small farms.",
    image: "/images/animals/call-duck.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Call Duck", url: "https://en.wikipedia.org/wiki/Call_duck" }
    ]
  },
  {
    id: "indian-peafowl",
    type: "animal",
    name_th: "นกยูง",
    name_en: "Indian Peafowl",
    scientific_name: "Pavo cristatus",
    short_description: "นกยูงอินเดีย หางยาวสวยงาม เป็นนกประจำชาติอินเดีย",
    short_description_en: "India's national bird, famed for the male's spectacular iridescent tail display",
    description:
      "นกยูงอินเดียเป็นนกประจำชาติอินเดีย และหนึ่งในนกที่สวยงามที่สุดในโลก ตัวผู้ (Peacock) มีขนหางชุดที่สอง (Covert train) ยาวงดงาม ประกอบด้วยขน 100–150 เส้น แต่ละเส้นมีลวดลายคล้ายดวงตาสีน้ำเงิน-เขียว-ทอง ลำตัวตัวผู้มีสีน้ำเงินโคบอลต์บริเวณหัวและอก ความยาวรวมหาง 195–225 ซม. ตัวเมีย (Peahen) สีน้ำตาล-เขียว ไม่มีหางยาว ยาวเพียง 95 ซม. อาศัยในป่าผลัดใบและพื้นที่เปิดโล่งในอนุทวีปอินเดีย กินแมลง ผล เมล็ด ซากสัตว์เล็ก และงู ตัวผู้แสดงหางในฤดูผสมพันธุ์ (มีนาคม-ตุลาคม) เพื่อดึงดูดตัวเมีย วางไข่ 3–8 ฟอง อายุขัย 20–25 ปี ในวัดและฟาร์มทั่วเอเชียนิยมเลี้ยงเพื่อความสวยงาม สถานะ IUCN: Least Concern",
    description_en:
      "The Indian Peafowl is India's national bird and one of the world's most spectacular birds. Males (peacocks) display elaborate trains of 100–150 iridescent covert feathers with eye-like ocelli in blue, green, and gold. Body is cobalt blue on head and breast; total length including train 195–225 cm. Females (peahens) are cryptic brown-green, only 95 cm long. Inhabit deciduous forests and open areas across the Indian subcontinent, feeding on insects, fruits, seeds, small reptiles, and snakes. Males display trains during breeding season (March–October). Lay 3–8 eggs; lifespan 20–25 years. Widely kept in temples, parks, and farms across Asia. IUCN: Least Concern.",
    image: "/images/animals/indian-peafowl.jpg",
    tags: ["Avian"],
    references: [
      { title: "Wikipedia - Indian Peafowl", url: "https://en.wikipedia.org/wiki/Indian_peafowl" }
    ]
  },
  {
    id: "white-eared-pheasant",
    type: "animal",
    name_th: "ไก่ฟ้าหูขาว",
    name_en: "White-eared Pheasant",
    scientific_name: "Crossoptilon crossoptilon",
    short_description: "ไก่ฟ้าหูขาวยาว จากเทือกเขาสูงของจีน-ทิเบต",
    short_description_en: "Large pheasant with striking white ear-tufts from high-altitude China and Tibet",
    description:
      "ไก่ฟ้าหูขาวเป็นนกในสกุล Crossoptilon วงศ์ไก่ฟ้า (Phasianidae) มีถิ่นกำเนิดในเทือกเขาสูงของจีนตะวันตก ทิเบต และพื้นที่ต่อเนื่อง เป็นนกขนาดใหญ่ ความยาวลำตัว 86–96 ซม. น้ำหนัก 1.7–2.5 กก. ขนส่วนใหญ่สีขาว-เทา มีขนหูสีขาวยาวโดดเด่นบริเวณแก้มและคอ หางสีเทา-ดำ ผิวหนังรอบตาสีแดงเด่น ทั้งสองเพศมีลักษณะคล้ายกัน (Sexual dimorphism น้อยมาก) อาศัยในป่าสน ป่าโอ๊ค และทุ่งหญ้าแอลไพน์บนพื้นที่สูงระดับ 3,000–5,000 เมตร กินหัวพืช รากไม้ ลูกไม้ แมลง และผลไม้ป่า อยู่รวมฝูงเล็ก 5–15 ตัว วางไข่ 5–8 ฟองต่อครั้ง อายุขัย 12–15 ปีในกรง สถานะ IUCN: Least Concern นิยมเลี้ยงในสวนสัตว์และฟาร์มเนื่องจากรูปลักษณ์โดดเด่น",
    description_en:
      "The White-eared Pheasant belongs to the genus Crossoptilon (Phasianidae), native to high mountains of western China and Tibet. A large pheasant, 86–96 cm long, 1.7–2.5 kg. Predominantly white-gray plumage with distinctive long white ear-tufts on cheeks and neck; gray-black tail; bare red facial skin. Both sexes are very similar (low sexual dimorphism). Inhabits conifer forests, oak woodlands, and alpine meadows at 3,000–5,000 m elevation, feeding on tubers, roots, berries, insects, and wild fruits. Lives in small flocks of 5–15; lays 5–8 eggs; lifespan 12–15 years in captivity. IUCN: Least Concern. Popular in zoos and farms for its striking appearance.",
    image: "/images/animals/white-eared-pheasant.jpg",
    tags: ["Avian", "Pheasant"],
    references: [
      { title: "Wikipedia - White-eared Pheasant", url: "https://en.wikipedia.org/wiki/White-eared_pheasant" }
    ]
  },
  {
    id: "domestic-goose",
    type: "animal",
    name_th: "ห่าน",
    name_en: "Domestic Goose",
    scientific_name: "Anser anser domesticus",
    short_description: "ห่านเลี้ยง อยู่ร่วมกับมนุษย์มากกว่า 3,000 ปี",
    short_description_en: "Domesticated goose kept for over 3,000 years for eggs, meat, and guarding",
    description:
      "ห่านบ้านเป็นนกเลี้ยงที่มีประวัติศาสตร์ยาวนานกว่า 3,000 ปี สืบเชื้อสายจากห่านป่า Greylag Goose (Anser anser) มีสายพันธุ์หลากหลาย เช่น Embden (ขาว ตัวใหญ่) Toulouse (เทา ลำตัวใหญ่อ้วน) Chinese Goose (คอยาว จมูกนูน) และ African Goose ความยาวลำตัว 60–90 ซม. น้ำหนัก 4–10 กก. มีพฤติกรรมรวมฝูง สังคมสูง ร้องดัง ตื่นตัวเฝ้าระวังสูงกว่าสุนัข นิยมใช้แทนสุนัขเฝ้าบ้านในหลายประเทศ กินหญ้า ผัก และธัญพืช ออกไข่ 20–50 ฟองต่อปี อายุขัย 20–30 ปีหากดูแลดี มีบทบาทสำคัญในวัฒนธรรม อาหาร และเศรษฐกิจหลายประเทศ เนื้อห่าน ไข่ และขนนกมีคุณค่าทางการค้า",
    description_en:
      "The Domestic Goose has been kept for over 3,000 years, descended from the wild Greylag Goose. Major breeds include Embden (large white), Toulouse (large gray), Chinese (long-necked with prominent knob), and African. Body length 60–90 cm, weight 4–10 kg. Highly social and vocal; their alertness makes them better guard animals than dogs in many settings. Feed on grass, vegetables, and grain. Produce 20–50 eggs per year; lifespan 20–30 years with good care. Commercially important for meat, eggs, and down feathers. Culturally significant across many countries.",
    image: "/images/animals/domestic-goose.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Domestic Goose", url: "https://en.wikipedia.org/wiki/Domestic_goose" }
    ]
  },
  {
    id: "scarlet-macaw",
    type: "animal",
    name_th: "นกแก้วมาคอว์",
    name_en: "Scarlet Macaw",
    scientific_name: "Ara macao",
    short_description: "มาคอว์สีแดงสด ขนาดใหญ่จากอเมริกากลาง-ใต้ อายุยืน",
    short_description_en: "Brilliant red-yellow-blue macaw from Central and South American rainforests",
    description:
      "Scarlet Macaw เป็นนกแก้วขนาดใหญ่ที่สุดชนิดหนึ่ง มีถิ่นกำเนิดในป่าฝนเขตร้อนตั้งแต่เม็กซิโกไปจนถึงบราซิลและโบลิเวีย ลำตัวสีแดงสด ปีกสีเหลือง-น้ำเงิน-แดง หางยาวสีน้ำเงิน-แดง ความยาวรวมหาง 81–96 ซม. น้ำหนัก 1–1.1 กก. Wingspan 102–107 ซม. จะงอยปากแข็งแรงสำหรับงัดเมล็ดแข็ง อยู่เป็นคู่และฝูงเล็กตามยอดไม้สูง กินผลไม้ เมล็ด ถั่ว และดินแร่ธาตุ (Clay Lick) เพื่อลดพิษ มีสติปัญญาสูง เรียนรู้เลียนเสียงและคำพูดมนุษย์ได้ อายุขัย 40–50 ปีในกรง มีอายุสูงสุดบันทึกได้ถึง 75 ปี สถานะ IUCN: Least Concern แต่ถูกคุกคามจากการค้าสัตว์ป่าผิดกฎหมายและการทำลายป่า",
    description_en:
      "The Scarlet Macaw is one of the world's largest parrots, native to tropical rainforests from Mexico to Brazil and Bolivia. Brilliant scarlet body; yellow-and-blue wings; long blue-red tail. Total length 81–96 cm, weight 1–1.1 kg, wingspan 102–107 cm. Powerful bill for cracking hard seeds. Lives in pairs and small flocks in forest canopy, feeding on fruits, seeds, nuts, and mineral-rich clay at 'clay licks' to detoxify food. Highly intelligent; capable of mimicking human speech. Lifespan 40–50 years in captivity, with a recorded maximum of 75 years. IUCN: Least Concern, but threatened by illegal wildlife trade and deforestation.",
    image: "/images/animals/scarlet-macaw.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Scarlet Macaw", url: "https://en.wikipedia.org/wiki/Scarlet_macaw" }
    ]
  },
  {
    id: "rose-ringed-parakeet",
    type: "animal",
    name_th: "นกแก้วริงเน็ก",
    name_en: "Rose-ringed Parakeet",
    scientific_name: "Psittacula krameri",
    short_description: "นกแก้วสีเขียว ตัวผู้มีวงแหวนชมพู-ดำรอบคอ ปรับตัวเก่งมาก",
    short_description_en: "Green parakeet; males have a rose-pink neck ring; highly adaptable worldwide",
    description:
      "Rose-ringed Parakeet หรือ Ring-necked Parakeet เป็นนกแก้วขนาดกลาง มีถิ่นกำเนิดในแอฟริกาใต้สะฮาราและเอเชียใต้-ตะวันออกเฉียงใต้ รวมถึงอนุทวีปอินเดียและศรีลังกา ความยาวรวมหาง 38–42 ซม. น้ำหนัก 95–140 กรัม ขนสีเขียวสด ตัวผู้มีวงแหวนสีชมพู-ดำรอบคอเมื่ออายุ 2–3 ปีขึ้นไป จะงอยปากสีแดง ตัวเมียและลูกนกไม่มีวงแหวนที่คอ อาศัยในป่าโปร่ง พื้นที่เกษตร และเขตเมือง กินผลไม้ ดอกไม้ เมล็ด และน้ำหวาน เป็นนกแก้วที่ปรับตัวกับสิ่งแวดล้อมใหม่ได้เก่งที่สุด ปัจจุบันกระจายพันธุ์ไปทั่วโลกในฐานะชนิดพันธุ์ต่างถิ่น รวมถึงยุโรป อเมริกาเหนือ และญี่ปุ่น มีความสามารถในการพูดเลียนเสียงมนุษย์ได้ดี สถานะ IUCN: Least Concern",
    description_en:
      "The Rose-ringed (Ring-necked) Parakeet is a medium-sized parrot native to sub-Saharan Africa and South-Southeast Asia, including India and Sri Lanka. Body length 38–42 cm, weight 95–140 g. Vivid green plumage; males develop a rose-pink and black neck ring after 2–3 years; females and juveniles lack the ring. Red bill. Inhabits open woodlands, farmland, and urban areas, feeding on fruits, flowers, seeds, and nectar. The world's most adaptable parrot — now established as an invasive species in Europe, North America, and Japan. Excellent mimic of human speech. IUCN: Least Concern.",
    image: "/images/animals/rose-ringed-parakeet.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Rose-ringed Parakeet", url: "https://en.wikipedia.org/wiki/Rose-ringed_parakeet" }
    ]
  },
  {
    id: "crimson-conure",
    type: "animal",
    name_th: "นกแก้วคริมสันเบลลี่",
    name_en: "Crimson-bellied Parakeet",
    scientific_name: "Pyrrhura perlata",
    short_description: "คอนัวร์ขนาดเล็ก ท้องแดงเด่น จากป่าฝนบราซิล นิสัยอ่อนโยน",
    short_description_en: "Small Pyrrhura conure with striking crimson belly from Brazilian rainforests",
    description:
      "Crimson-bellied Parakeet หรือ Pearly Parakeet เป็นนกแก้วในกลุ่ม Conure สกุล Pyrrhura มีถิ่นกำเนิดในป่าฝนเขตร้อนของบราซิลตอนกลาง ความยาวลำตัว 22–24 ซม. น้ำหนัก 60–70 กรัม ขนบริเวณหัวและบนลำตัวสีน้ำเงิน-น้ำตาล ท้องสีแดงเข้มโดดเด่น หางสีเขียว-แดง ปีกมีสีเขียวมรกต อยู่เป็นฝูงในป่า กินผลไม้ ดอกไม้ เมล็ด และน้ำหวาน มีพฤติกรรมกระฉับกระเฉง สังคมสูง ไม่ค่อยส่งเสียงดังรบกวนเมื่อเทียบกับนกแก้วชนิดอื่น ทำให้เหมาะเป็นสัตว์เลี้ยงในบ้าน วางไข่ 4–8 ฟองต่อครั้ง อายุขัย 15–20 ปีในกรง สถานะ IUCN: Vulnerable เนื่องจากการสูญเสียถิ่นที่อยู่อาศัย นิยมในหมู่นักสะสมนกแก้วเนื่องจากความสวยงามและนิสัยอ่อนโยน",
    description_en:
      "The Crimson-bellied Parakeet (Pearly Parakeet) is a small Pyrrhura conure from the tropical rainforests of central Brazil. Body length 22–24 cm, weight 60–70 g. Blue-brown head and upperparts; striking crimson-red belly; green-red tail; emerald green wings. Highly social, living in flocks in forest canopy, feeding on fruits, flowers, seeds, and nectar. Less noisy than many parrots, making them well-suited as indoor pets. Lays 4–8 eggs; lifespan 15–20 years in captivity. IUCN status: Vulnerable due to habitat loss. Prized by parrot enthusiasts for their beauty and gentle temperament.",
    image: "/images/animals/crimson-conure.jpg",
    tags: ["Avian", "Parrot"],
    references: [
      { title: "Wikipedia - Crimson-bellied Parakeet", url: "https://en.wikipedia.org/wiki/Crimson-bellied_parakeet" }
    ]
  },
  {
    id: "amazon-parrot",
    type: "animal",
    name_th: "นกแก้วอเมซอน",
    name_en: "Amazon Parrot",
    scientific_name: "Amazona spp.",
    short_description: "กลุ่มนกแก้วอเมซอน สติปัญญาสูง อายุยืน เลียนเสียงเก่ง",
    short_description_en: "Highly intelligent long-lived parrots of the genus Amazona from the Americas",
    description:
      "นกแก้วอเมซอนเป็นกลุ่มนกแก้วสกุล Amazona ประกอบด้วยมากกว่า 30 ชนิด มีถิ่นกำเนิดในอเมริกากลาง อเมริกาใต้ และหมู่เกาะแคริบเบียน ขนสีเขียวเป็นหลัก มีจุดสีสันต่างๆ บริเวณหัวตามชนิด เช่น เหลือง น้ำเงิน แดง ขนาดกลางถึงใหญ่ ความยาวลำตัว 26–45 ซม. น้ำหนัก 270–900 กรัม มีสติปัญญาสูงมาก เรียนรู้คำพูดและเสียงได้หลากหลาย บางชนิดมีคลังคำศัพท์ได้ถึงหลายร้อยคำ อายุขัย 50–80 ปีในกรง เป็นสัตว์สังคม กินผลไม้ เมล็ด ถั่ว และพืชต่างๆ ตามยอดไม้ในป่าเขตร้อน ผสมพันธุ์แบบคู่เดียว หลายชนิดถูกคุกคาม เช่น Puerto Rican Amazon (Amazona vittata) ซึ่ง IUCN จัดว่า Critically Endangered จำเป็นต้องนำเข้าอย่างถูกกฎหมายจาก CITES ที่ได้รับอนุญาต",
    description_en:
      "Amazon Parrots comprise over 30 species in the genus Amazona, native to Central America, South America, and the Caribbean. Predominantly green plumage with species-specific markings in yellow, blue, or red on the head. Medium to large, 26–45 cm long, 270–900 g. Exceptionally intelligent with large vocabularies — some species can learn hundreds of words. Lifespan 50–80 years in captivity. Highly social; feed on fruits, seeds, nuts, and plants in rainforest canopies. Monogamous breeders. Several species face serious conservation threats; the Puerto Rican Amazon is Critically Endangered. Legal acquisition requires CITES-authorized permits.",
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
    short_description: "ไก่ต๊อกลายจุดขาว ช่วยกำจัดแมลงในฟาร์ม เสียงดังเตือนภัย",
    short_description_en: "African bird with white-spotted plumage; excellent natural pest controller on farms",
    description:
      "Helmeted Guineafowl เป็นนกในวงศ์ Numididae มีถิ่นกำเนิดในทวีปแอฟริกาใต้สะฮารา ลำตัวกลม ขนาดกลาง ความยาว 53–58 ซม. น้ำหนัก 1.3–1.8 กก. ขนสีเทาเข้มประด้วยจุดสีขาวเด่นทั่วลำตัว หัวหัวโล้น สีน้ำเงิน-แดง มีหมวก (Helmet) เนื้อเขาสีน้ำตาลแดงบนกระหม่อม เสียงร้องดังและถี่ อยู่รวมฝูง 20–30 ตัว กินแมลง เห็บ ตะขาบ เมล็ดพืช ผัก และหนอน มีประโยชน์อย่างมากในการควบคุมแมลงศัตรูพืชและเห็บในฟาร์มและทุ่งหญ้าโดยไม่ต้องใช้สารเคมี นอกจากนี้ยังส่งเสียงเตือนเมื่อพบสัตว์ผู้ล่า วางไข่ 6–12 ฟองต่อครั้ง อายุขัย 10–15 ปี สถานะ IUCN: Least Concern",
    description_en:
      "The Helmeted Guineafowl belongs to the Numididae family, native to sub-Saharan Africa. Body length 53–58 cm, weight 1.3–1.8 kg. Dark gray plumage densely spotted with white; bare blue-red head with a reddish-brown bony casque (helmet). Loud, repetitive calls. Lives in flocks of 20–30, feeding on insects, ticks, centipedes, seeds, vegetables, and worms. Extremely valuable in farms and pastures for natural pest and tick control without chemicals. Also serves as an alarm bird when predators approach. Lays 6–12 eggs; lifespan 10–15 years. IUCN: Least Concern.",
    image: "/images/animals/guineafowl.jpg",
    tags: ["Avian", "Domestic"],
    references: [
      { title: "Wikipedia - Helmeted Guineafowl", url: "https://en.wikipedia.org/wiki/Helmeted_guineafowl" }
    ]
  },
  {
    id: "red-junglefowl",
    type: "animal",
    name_th: "ไก่ป่า",
    name_en: "Red Junglefowl",
    scientific_name: "Gallus gallus",
    short_description: "บรรพบุรุษของไก่บ้านทั่วโลก พบในป่าเอเชียใต้-ตะวันออกเฉียงใต้",
    short_description_en: "Wild ancestor of all domestic chickens, native to South and Southeast Asian forests",
    description:
      "Red Junglefowl เป็นต้นกำเนิดของไก่บ้านทั่วโลก (Gallus gallus domesticus) มีถิ่นกำเนิดในป่าเขตร้อนของเอเชียใต้และเอเชียตะวันออกเฉียงใต้ รวมถึงประเทศไทย ตัวผู้มีขนสีแดง-ส้ม-ดำสวยงาม มีแผงคอ (Hackle) สีทอง ขนหางยาวสีเขียวเหลือบ (Sickle feathers) และหงอนสีแดง ตัวเมียสีน้ำตาลเพื่อพรางตัว ความยาวตัวผู้ 65–78 ซม. ตัวเมีย 42–46 ซม. น้ำหนัก 0.5–1.5 กก. อาศัยในป่าโปร่ง ป่าไผ่ และพื้นที่เกษตรกรรม กินเมล็ดพืช แมลง ผลไม้ และสัตว์เล็กๆ ส่งเสียงขันแบบเดียวกับไก่บ้านแต่เสียงสั้นกว่า ถูกนำมาเลี้ยงครั้งแรกในเอเชียเมื่อ 5,000–10,000 ปีก่อน สถานะ IUCN: Least Concern",
    description_en:
      "The Red Junglefowl is the wild ancestor of all domestic chickens (Gallus gallus domesticus), native to tropical forests of South and Southeast Asia, including Thailand. Males are brilliantly colored with red-orange-black plumage, golden hackles, iridescent green sickle tail feathers, and a red comb. Females are cryptic brown. Male body length 65–78 cm, females 42–46 cm; weight 0.5–1.5 kg. Inhabits open forests, bamboo groves, and farmland edges, feeding on seeds, insects, fruits, and small animals. Their crow is similar to but shorter than domestic chickens. First domesticated in Asia 5,000–10,000 years ago. IUCN: Least Concern.",
    image: "/images/animals/red-junglefowl.jpg",
    tags: ["Avian", "Galliformes"],
    references: [
      { title: "Wikipedia - Red Junglefowl", url: "https://en.wikipedia.org/wiki/Red_junglefowl" }
    ]
  },
  {
    id: "golden-pheasant",
    type: "animal",
    name_th: "ไก่ฟ้าสีทอง",
    name_en: "Golden Pheasant",
    scientific_name: "Chrysolophus pictus",
    short_description: "ไก่ฟ้าสีสันสดจากจีน ตัวผู้มีหัวทองและแผงคอลายเกล็ดงดงาม",
    short_description_en: "Brilliantly colored Chinese pheasant with golden crest and scaled red-yellow cape",
    description:
      "Golden Pheasant หรือ Chinese Pheasant เป็นไก่ฟ้าที่มีสีสันสวยงามที่สุดชนิดหนึ่งในโลก มีถิ่นกำเนิดในป่าและพื้นที่สูงของจีนกลาง-ตะวันตก ตัวผู้มีหัวสีทองงดงาม แผงคอสีเหลือง-แดงลวดลายเกล็ด (Ruff) หน้าอกสีแดงสด ปีกสีน้ำเงิน หางยาวสีน้ำตาลลาย ความยาวรวมหาง 90–105 ซม. ตัวเมียสีน้ำตาลพรางตัว ยาว 60–80 ซม. น้ำหนักตัวผู้ 630–700 กรัม ตัวเมีย 525–675 กรัม อาศัยในป่าไม้ไผ่และป่าเขา กินหน่อไม้ ใบไม้ เมล็ดพืช และแมลง ตัวผู้แสดงแผงคอและการเต้นรำในฤดูผสมพันธุ์ อายุขัย 5–6 ปีในธรรมชาติ 15–25 ปีในกรง สถานะ IUCN: Least Concern มีการเลี้ยงในสวนสัตว์และฟาร์มทั่วโลกมากกว่า 200 ปีแล้ว",
    description_en:
      "The Golden (Chinese) Pheasant is one of the world's most brilliantly colored birds, native to forests and mountains of central-western China. Males display a golden crest, a scaled yellow-red cape (ruff), brilliant red breast, blue wings, and a long brown barred tail; total length 90–105 cm. Females are cryptic brown, 60–80 cm long. Male weight 630–700 g, female 525–675 g. Inhabits bamboo forests and mountain woodlands, feeding on bamboo shoots, leaves, seeds, and insects. Males perform elaborate ruff-spreading displays during breeding season. Lifespan 5–6 years wild, 15–25 years in captivity. IUCN: Least Concern. Kept worldwide in zoos and farms for over 200 years.",
    image: "/images/animals/golden-pheasant.jpg",
    tags: ["Avian", "Pheasant"],
    references: [
      { title: "Wikipedia - Golden Pheasant", url: "https://en.wikipedia.org/wiki/Golden_pheasant" }
    ]
  }
];
