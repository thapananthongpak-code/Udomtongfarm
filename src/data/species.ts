// The starting collection. The site shows this until Supabase is connected, and
// scripts/build-seed-sql.mjs turns it into supabase/seed.sql.
// Once Supabase is connected, species are edited in the admin dashboard instead.

import type { Species } from "../lib/species/types.js";

export const seedSpecies: Species[] = [
  {
    "id": "black-swan",
    "type": "animal",
    "name_th": "หงส์ดำ",
    "name_en": "Black Swan",
    "scientific_name": "Cygnus atratus",
    "status": "LC",
    "summary_th": "หงส์สีดำเด่น นกน้ำขนาดใหญ่จากออสเตรเลีย",
    "summary_en": "Striking black waterbird native to Australia",
    "body_th": "หงส์ดำเป็นนกน้ำขนาดใหญ่มีถิ่นกำเนิดในออสเตรเลีย ขนสีดำสนิทตลอดลำตัว จะงอยปากสีแดงสดพร้อมปลายสีขาว ลำคอยาวโค้งงดงาม มีความยาวลำตัว 110–142 ซม. น้ำหนัก 3.7–9 กก. ชอบอาศัยในแหล่งน้ำจืด ทะเลสาบ และพื้นที่ชุ่มน้ำ กินพืชน้ำและสาหร่ายเป็นอาหารหลัก มีพฤติกรรมผูกคู่แบบคู่เดียวตลอดชีวิต ทำรังขนาดใหญ่บริเวณริมน้ำ วางไข่ 5–6 ฟองต่อครั้ง ทั้งตัวผู้และตัวเมียช่วยกันฟักไข่และเลี้ยงลูก ในออสเตรเลียถือเป็นสัญลักษณ์ประจำรัฐเวสเทิร์นออสเตรเลีย อายุขัยในธรรมชาติ 10–15 ปี ในกรงเลี้ยงสูงถึง 40 ปี ปัจจุบันนิยมนำมาเลี้ยงในฟาร์มและสวนสาธารณะทั่วโลกเนื่องจากความงดงามโดดเด่น สถานะการอนุรักษ์: Least Concern (IUCN)",
    "body_en": "The Black Swan is a large waterbird native to Australia, instantly recognizable by its entirely black plumage and vivid red bill with a white tip. Body length 110–142 cm, weight 3.7–9 kg. Inhabits freshwater lakes, lagoons, and wetlands, feeding mainly on aquatic plants and algae. Monogamous; both parents build large nests near the waterline and share incubation of 5–6 eggs. State emblem of Western Australia. Lifespan 10–15 years wild, up to 40 years in captivity. Widely kept ornamentally in parks and farms worldwide. IUCN status: Least Concern.",
    "image": "/images/animals/black-swan.jpg",
    "tags": [
      "Avian",
      "Waterfowl"
    ],
    "sources": [
      {
        "title": "Wikipedia - Black Swan",
        "url": "https://en.wikipedia.org/wiki/Black_swan"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "mute-swan",
    "type": "animal",
    "name_th": "หงส์ขาว",
    "name_en": "Mute Swan",
    "scientific_name": "Cygnus olor",
    "status": "LC",
    "summary_th": "หงส์สีขาวสง่างาม พบได้ในยุโรปและเอเชีย",
    "summary_en": "Elegant white swan native to Europe and Asia",
    "body_th": "หงส์ขาวเป็นหนึ่งในนกที่บินได้ซึ่งมีขนาดหนักที่สุดในโลก และเป็นหงส์ที่ใหญ่ที่สุดในยุโรป ขนสีขาวบริสุทธิ์ มีโหนกสีดำที่โคนจะงอยปากสีส้ม ลำคอยาวโค้งงดงาม มีความยาวลำตัว 125–170 ซม. น้ำหนัก 10–12 กก. Wingspan 200–240 ซม. อาศัยในแหล่งน้ำจืดและชายฝั่ง กินพืชน้ำ หญ้า และสัตว์น้ำขนาดเล็ก ใช้ปีกอันกว้างในการป้องกันอาณาเขตอย่างก้าวร้าว ผสมพันธุ์แบบคู่เดียวตลอดชีวิต วางไข่ 5–8 ฟองต่อครั้ง ลูกหงส์ (Cygnet) สีเทาและจะเปลี่ยนเป็นสีขาวเมื่ออายุ 1 ปี ในอังกฤษถือเป็นสัตว์หลวงที่ได้รับการคุ้มครองมาตั้งแต่ศตวรรษที่ 12 สถานะการอนุรักษ์: Least Concern (IUCN)",
    "body_en": "The Mute Swan is one of the heaviest flying birds and Europe's largest swan. Entirely white plumage; orange-red bill with a distinctive black knob; gracefully curved neck. Body length 125–170 cm, weight 10–12 kg, wingspan 200–240 cm. Inhabits freshwater and coastal areas, feeding on aquatic plants, grasses, and small aquatic animals. Highly territorial, using wings to defend nests aggressively. Monogamous, laying 5–8 eggs; cygnets are gray, turning white at ~1 year. A Royal bird in England protected since the 12th century. IUCN status: Least Concern.",
    "image": "/images/animals/mute-swan.jpg",
    "tags": [
      "Avian",
      "Waterfowl"
    ],
    "sources": [
      {
        "title": "Wikipedia - Mute Swan",
        "url": "https://en.wikipedia.org/wiki/Mute_swan"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "egyptian-goose",
    "type": "animal",
    "name_th": "ห่านอียิปต์",
    "name_en": "Egyptian Goose",
    "scientific_name": "Alopochen aegyptiaca",
    "status": "LC",
    "summary_th": "ห่านน้ำจากแอฟริกา ลวดลายเด่น แต้มรอบตาสีน้ำตาล",
    "summary_en": "African waterbird with distinctive eye-patches and colorful plumage",
    "body_th": "ห่านอียิปต์เป็นสมาชิกวงศ์เป็ด-ห่าน (Anatidae) มีถิ่นกำเนิดในทวีปแอฟริกา โดยเฉพาะบริเวณลุ่มแม่น้ำไนล์ ลำตัวสีน้ำตาล-ครีม มีแต้มวงรอบตาสีน้ำตาลเข้มและจุดบนหน้าอกสีน้ำตาลเด่น ขนปีกส่วน Coverts สีขาวตัดกับสีเขียวเมทัลลิก ความยาวลำตัว 63–73 ซม. น้ำหนัก 1.5–2.3 กก. อาศัยในที่ราบชุ่มน้ำ ทุ่งหญ้า และริมฝั่งแม่น้ำ กินหญ้า เมล็ดพืช ใบไม้ และพืชน้ำ มีพฤติกรรมครอบครองอาณาเขตและเสียงร้องดังมาก ทำรังในโพรงไม้ โขดหิน และแม้แต่บนหลังคาอาคาร วางไข่ 5–12 ฟอง ปัจจุบันพบเป็นชนิดพันธุ์ต่างถิ่นที่แพร่กระจายในยุโรป โดยเฉพาะอังกฤษและเนเธอร์แลนด์ สถานะ IUCN: Least Concern",
    "body_en": "The Egyptian Goose is a member of the Anatidae family, native to Africa — particularly the Nile Valley. Brownish-cream plumage with distinctive dark eye-patches and a dark breast spot; white wing coverts contrast with metallic green. Body length 63–73 cm, weight 1.5–2.3 kg. Inhabits wetlands, grasslands, and riverbanks, feeding on grass, seeds, leaves, and aquatic plants. Highly territorial with loud calls. Nests in tree hollows, rock ledges, or even rooftops; lays 5–12 eggs. Now established as an invasive species in Europe, notably England and the Netherlands. IUCN: Least Concern.",
    "image": "/images/animals/egyptian-goose.jpg",
    "tags": [
      "Avian",
      "Waterfowl"
    ],
    "sources": [
      {
        "title": "Wikipedia - Egyptian Goose",
        "url": "https://en.wikipedia.org/wiki/Egyptian_goose"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "call-duck",
    "type": "animal",
    "name_th": "เป็ดคอลดักส์",
    "name_en": "Call Duck",
    "scientific_name": "Anas platyrhynchos domesticus",
    "status": null,
    "summary_th": "เป็ดบ้านสายพันธุ์เล็กที่สุด เสียงดัง นิสัยเป็นมิตร",
    "summary_en": "World's smallest domestic duck breed, known for loud calls and friendly nature",
    "body_th": "Call Duck เป็นสายพันธุ์เป็ดบ้านที่มีขนาดเล็กที่สุดในบรรดาเป็ดทุกสายพันธุ์ พัฒนาขึ้นมาในเนเธอร์แลนด์เพื่อใช้เป็น \"นกล่อ\" (Decoy duck) ดึงดูดเป็ดป่าในการล่า เนื่องจากมีเสียงร้องดังและถี่มาก น้ำหนักตัวเพียง 500–700 กรัม มีหัวกลมใหญ่ จะงอยปากสั้น ใบหน้าแบน และลำตัวกลมเตี้ย มีสีหลายแบบ ได้แก่ ขาว เทา น้ำตาล และลายหลากสี ออกไข่ 9–13 ฟองต่อครั้ง อายุขัย 9–12 ปี เป็นที่นิยมในการประกวดสัตว์ปีก (Poultry Show) และเลี้ยงเป็นสัตว์เลี้ยงเนื่องจากขนาดเล็กน่ารักและนิสัยเป็นมิตร ต้องการพื้นที่และน้ำไม่มาก เหมาะสำหรับเลี้ยงในฟาร์มขนาดเล็ก",
    "body_en": "The Call Duck is the world's smallest domestic duck breed, originally developed in the Netherlands as a 'decoy duck' to lure wild ducks during hunting, owing to its exceptionally loud and frequent quacking. Weight only 500–700 g; characterized by a large round head, very short bill, flat face, and compact round body. Available in many color varieties: white, gray, brown, and pied. Lays 9–13 eggs per clutch; lifespan 9–12 years. Popular at poultry shows and as a pet due to its small size, friendly temperament, and low space requirements — ideal for small farms.",
    "image": "/images/animals/call-duck.jpg",
    "tags": [
      "Avian",
      "Domestic"
    ],
    "sources": [
      {
        "title": "Wikipedia - Call Duck",
        "url": "https://en.wikipedia.org/wiki/Call_duck"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "indian-peafowl",
    "type": "animal",
    "name_th": "นกยูง",
    "name_en": "Indian Peafowl",
    "scientific_name": "Pavo cristatus",
    "status": "LC",
    "summary_th": "นกยูงอินเดีย หางยาวสวยงาม เป็นนกประจำชาติอินเดีย",
    "summary_en": "India's national bird, famed for the male's spectacular iridescent tail display",
    "body_th": "นกยูงอินเดียเป็นนกประจำชาติอินเดีย และหนึ่งในนกที่สวยงามที่สุดในโลก ตัวผู้ (Peacock) มีขนหางชุดที่สอง (Covert train) ยาวงดงาม ประกอบด้วยขน 100–150 เส้น แต่ละเส้นมีลวดลายคล้ายดวงตาสีน้ำเงิน-เขียว-ทอง ลำตัวตัวผู้มีสีน้ำเงินโคบอลต์บริเวณหัวและอก ความยาวรวมหาง 195–225 ซม. ตัวเมีย (Peahen) สีน้ำตาล-เขียว ไม่มีหางยาว ยาวเพียง 95 ซม. อาศัยในป่าผลัดใบและพื้นที่เปิดโล่งในอนุทวีปอินเดีย กินแมลง ผล เมล็ด ซากสัตว์เล็ก และงู ตัวผู้แสดงหางในฤดูผสมพันธุ์ (มีนาคม-ตุลาคม) เพื่อดึงดูดตัวเมีย วางไข่ 3–8 ฟอง อายุขัย 20–25 ปี ในวัดและฟาร์มทั่วเอเชียนิยมเลี้ยงเพื่อความสวยงาม สถานะ IUCN: Least Concern",
    "body_en": "The Indian Peafowl is India's national bird and one of the world's most spectacular birds. Males (peacocks) display elaborate trains of 100–150 iridescent covert feathers with eye-like ocelli in blue, green, and gold. Body is cobalt blue on head and breast; total length including train 195–225 cm. Females (peahens) are cryptic brown-green, only 95 cm long. Inhabit deciduous forests and open areas across the Indian subcontinent, feeding on insects, fruits, seeds, small reptiles, and snakes. Males display trains during breeding season (March–October). Lay 3–8 eggs; lifespan 20–25 years. Widely kept in temples, parks, and farms across Asia. IUCN: Least Concern.",
    "image": "/images/animals/indian-peafowl.jpg",
    "tags": [
      "Avian"
    ],
    "sources": [
      {
        "title": "Wikipedia - Indian Peafowl",
        "url": "https://en.wikipedia.org/wiki/Indian_peafowl"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "white-eared-pheasant",
    "type": "animal",
    "name_th": "ไก่ฟ้าหูขาว",
    "name_en": "White-eared Pheasant",
    "scientific_name": "Crossoptilon crossoptilon",
    "status": "LC",
    "summary_th": "ไก่ฟ้าหูขาวยาว จากเทือกเขาสูงของจีน-ทิเบต",
    "summary_en": "Large pheasant with striking white ear-tufts from high-altitude China and Tibet",
    "body_th": "ไก่ฟ้าหูขาวเป็นนกในสกุล Crossoptilon วงศ์ไก่ฟ้า (Phasianidae) มีถิ่นกำเนิดในเทือกเขาสูงของจีนตะวันตก ทิเบต และพื้นที่ต่อเนื่อง เป็นนกขนาดใหญ่ ความยาวลำตัว 86–96 ซม. น้ำหนัก 1.7–2.5 กก. ขนส่วนใหญ่สีขาว-เทา มีขนหูสีขาวยาวโดดเด่นบริเวณแก้มและคอ หางสีเทา-ดำ ผิวหนังรอบตาสีแดงเด่น ทั้งสองเพศมีลักษณะคล้ายกัน (Sexual dimorphism น้อยมาก) อาศัยในป่าสน ป่าโอ๊ค และทุ่งหญ้าแอลไพน์บนพื้นที่สูงระดับ 3,000–5,000 เมตร กินหัวพืช รากไม้ ลูกไม้ แมลง และผลไม้ป่า อยู่รวมฝูงเล็ก 5–15 ตัว วางไข่ 5–8 ฟองต่อครั้ง อายุขัย 12–15 ปีในกรง สถานะ IUCN: Least Concern นิยมเลี้ยงในสวนสัตว์และฟาร์มเนื่องจากรูปลักษณ์โดดเด่น",
    "body_en": "The White-eared Pheasant belongs to the genus Crossoptilon (Phasianidae), native to high mountains of western China and Tibet. A large pheasant, 86–96 cm long, 1.7–2.5 kg. Predominantly white-gray plumage with distinctive long white ear-tufts on cheeks and neck; gray-black tail; bare red facial skin. Both sexes are very similar (low sexual dimorphism). Inhabits conifer forests, oak woodlands, and alpine meadows at 3,000–5,000 m elevation, feeding on tubers, roots, berries, insects, and wild fruits. Lives in small flocks of 5–15; lays 5–8 eggs; lifespan 12–15 years in captivity. IUCN: Least Concern. Popular in zoos and farms for its striking appearance.",
    "image": "/images/animals/white-eared-pheasant.jpg",
    "tags": [
      "Avian",
      "Pheasant"
    ],
    "sources": [
      {
        "title": "Wikipedia - White-eared Pheasant",
        "url": "https://en.wikipedia.org/wiki/White-eared_pheasant"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "domestic-goose",
    "type": "animal",
    "name_th": "ห่าน",
    "name_en": "Domestic Goose",
    "scientific_name": "Anser anser domesticus",
    "status": null,
    "summary_th": "ห่านเลี้ยง อยู่ร่วมกับมนุษย์มากกว่า 3,000 ปี",
    "summary_en": "Domesticated goose kept for over 3,000 years for eggs, meat, and guarding",
    "body_th": "ห่านบ้านเป็นนกเลี้ยงที่มีประวัติศาสตร์ยาวนานกว่า 3,000 ปี สืบเชื้อสายจากห่านป่า Greylag Goose (Anser anser) มีสายพันธุ์หลากหลาย เช่น Embden (ขาว ตัวใหญ่) Toulouse (เทา ลำตัวใหญ่อ้วน) Chinese Goose (คอยาว จมูกนูน) และ African Goose ความยาวลำตัว 60–90 ซม. น้ำหนัก 4–10 กก. มีพฤติกรรมรวมฝูง สังคมสูง ร้องดัง ตื่นตัวเฝ้าระวังสูงกว่าสุนัข นิยมใช้แทนสุนัขเฝ้าบ้านในหลายประเทศ กินหญ้า ผัก และธัญพืช ออกไข่ 20–50 ฟองต่อปี อายุขัย 20–30 ปีหากดูแลดี มีบทบาทสำคัญในวัฒนธรรม อาหาร และเศรษฐกิจหลายประเทศ เนื้อห่าน ไข่ และขนนกมีคุณค่าทางการค้า",
    "body_en": "The Domestic Goose has been kept for over 3,000 years, descended from the wild Greylag Goose. Major breeds include Embden (large white), Toulouse (large gray), Chinese (long-necked with prominent knob), and African. Body length 60–90 cm, weight 4–10 kg. Highly social and vocal; their alertness makes them better guard animals than dogs in many settings. Feed on grass, vegetables, and grain. Produce 20–50 eggs per year; lifespan 20–30 years with good care. Commercially important for meat, eggs, and down feathers. Culturally significant across many countries.",
    "image": "/images/animals/domestic-goose.jpg",
    "tags": [
      "Avian",
      "Domestic"
    ],
    "sources": [
      {
        "title": "Wikipedia - Domestic Goose",
        "url": "https://en.wikipedia.org/wiki/Domestic_goose"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "scarlet-macaw",
    "type": "animal",
    "name_th": "นกแก้วมาคอว์",
    "name_en": "Scarlet Macaw",
    "scientific_name": "Ara macao",
    "status": "LC",
    "summary_th": "มาคอว์สีแดงสด ขนาดใหญ่จากอเมริกากลาง-ใต้ อายุยืน",
    "summary_en": "Brilliant red-yellow-blue macaw from Central and South American rainforests",
    "body_th": "Scarlet Macaw เป็นนกแก้วขนาดใหญ่ที่สุดชนิดหนึ่ง มีถิ่นกำเนิดในป่าฝนเขตร้อนตั้งแต่เม็กซิโกไปจนถึงบราซิลและโบลิเวีย ลำตัวสีแดงสด ปีกสีเหลือง-น้ำเงิน-แดง หางยาวสีน้ำเงิน-แดง ความยาวรวมหาง 81–96 ซม. น้ำหนัก 1–1.1 กก. Wingspan 102–107 ซม. จะงอยปากแข็งแรงสำหรับงัดเมล็ดแข็ง อยู่เป็นคู่และฝูงเล็กตามยอดไม้สูง กินผลไม้ เมล็ด ถั่ว และดินแร่ธาตุ (Clay Lick) เพื่อลดพิษ มีสติปัญญาสูง เรียนรู้เลียนเสียงและคำพูดมนุษย์ได้ อายุขัย 40–50 ปีในกรง มีอายุสูงสุดบันทึกได้ถึง 75 ปี สถานะ IUCN: Least Concern แต่ถูกคุกคามจากการค้าสัตว์ป่าผิดกฎหมายและการทำลายป่า",
    "body_en": "The Scarlet Macaw is one of the world's largest parrots, native to tropical rainforests from Mexico to Brazil and Bolivia. Brilliant scarlet body; yellow-and-blue wings; long blue-red tail. Total length 81–96 cm, weight 1–1.1 kg, wingspan 102–107 cm. Powerful bill for cracking hard seeds. Lives in pairs and small flocks in forest canopy, feeding on fruits, seeds, nuts, and mineral-rich clay at 'clay licks' to detoxify food. Highly intelligent; capable of mimicking human speech. Lifespan 40–50 years in captivity, with a recorded maximum of 75 years. IUCN: Least Concern, but threatened by illegal wildlife trade and deforestation.",
    "image": "/images/animals/scarlet-macaw.jpg",
    "tags": [
      "Avian",
      "Parrot"
    ],
    "sources": [
      {
        "title": "Wikipedia - Scarlet Macaw",
        "url": "https://en.wikipedia.org/wiki/Scarlet_macaw"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "rose-ringed-parakeet",
    "type": "animal",
    "name_th": "นกแก้วริงเน็ก",
    "name_en": "Rose-ringed Parakeet",
    "scientific_name": "Psittacula krameri",
    "status": "LC",
    "summary_th": "นกแก้วสีเขียว ตัวผู้มีวงแหวนชมพู-ดำรอบคอ ปรับตัวเก่งมาก",
    "summary_en": "Green parakeet; males have a rose-pink neck ring; highly adaptable worldwide",
    "body_th": "Rose-ringed Parakeet หรือ Ring-necked Parakeet เป็นนกแก้วขนาดกลาง มีถิ่นกำเนิดในแอฟริกาใต้สะฮาราและเอเชียใต้-ตะวันออกเฉียงใต้ รวมถึงอนุทวีปอินเดียและศรีลังกา ความยาวรวมหาง 38–42 ซม. น้ำหนัก 95–140 กรัม ขนสีเขียวสด ตัวผู้มีวงแหวนสีชมพู-ดำรอบคอเมื่ออายุ 2–3 ปีขึ้นไป จะงอยปากสีแดง ตัวเมียและลูกนกไม่มีวงแหวนที่คอ อาศัยในป่าโปร่ง พื้นที่เกษตร และเขตเมือง กินผลไม้ ดอกไม้ เมล็ด และน้ำหวาน เป็นนกแก้วที่ปรับตัวกับสิ่งแวดล้อมใหม่ได้เก่งที่สุด ปัจจุบันกระจายพันธุ์ไปทั่วโลกในฐานะชนิดพันธุ์ต่างถิ่น รวมถึงยุโรป อเมริกาเหนือ และญี่ปุ่น มีความสามารถในการพูดเลียนเสียงมนุษย์ได้ดี สถานะ IUCN: Least Concern",
    "body_en": "The Rose-ringed (Ring-necked) Parakeet is a medium-sized parrot native to sub-Saharan Africa and South-Southeast Asia, including India and Sri Lanka. Body length 38–42 cm, weight 95–140 g. Vivid green plumage; males develop a rose-pink and black neck ring after 2–3 years; females and juveniles lack the ring. Red bill. Inhabits open woodlands, farmland, and urban areas, feeding on fruits, flowers, seeds, and nectar. The world's most adaptable parrot — now established as an invasive species in Europe, North America, and Japan. Excellent mimic of human speech. IUCN: Least Concern.",
    "image": "/images/animals/rose-ringed-parakeet.jpg",
    "tags": [
      "Avian",
      "Parrot"
    ],
    "sources": [
      {
        "title": "Wikipedia - Rose-ringed Parakeet",
        "url": "https://en.wikipedia.org/wiki/Rose-ringed_parakeet"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "crimson-conure",
    "type": "animal",
    "name_th": "นกแก้วคริมสันเบลลี่",
    "name_en": "Crimson-bellied Parakeet",
    "scientific_name": "Pyrrhura perlata",
    "status": "VU",
    "summary_th": "คอนัวร์ขนาดเล็ก ท้องแดงเด่น จากป่าฝนบราซิล นิสัยอ่อนโยน",
    "summary_en": "Small Pyrrhura conure with striking crimson belly from Brazilian rainforests",
    "body_th": "Crimson-bellied Parakeet หรือ Pearly Parakeet เป็นนกแก้วในกลุ่ม Conure สกุล Pyrrhura มีถิ่นกำเนิดในป่าฝนเขตร้อนของบราซิลตอนกลาง ความยาวลำตัว 22–24 ซม. น้ำหนัก 60–70 กรัม ขนบริเวณหัวและบนลำตัวสีน้ำเงิน-น้ำตาล ท้องสีแดงเข้มโดดเด่น หางสีเขียว-แดง ปีกมีสีเขียวมรกต อยู่เป็นฝูงในป่า กินผลไม้ ดอกไม้ เมล็ด และน้ำหวาน มีพฤติกรรมกระฉับกระเฉง สังคมสูง ไม่ค่อยส่งเสียงดังรบกวนเมื่อเทียบกับนกแก้วชนิดอื่น ทำให้เหมาะเป็นสัตว์เลี้ยงในบ้าน วางไข่ 4–8 ฟองต่อครั้ง อายุขัย 15–20 ปีในกรง สถานะ IUCN: Vulnerable เนื่องจากการสูญเสียถิ่นที่อยู่อาศัย นิยมในหมู่นักสะสมนกแก้วเนื่องจากความสวยงามและนิสัยอ่อนโยน",
    "body_en": "The Crimson-bellied Parakeet (Pearly Parakeet) is a small Pyrrhura conure from the tropical rainforests of central Brazil. Body length 22–24 cm, weight 60–70 g. Blue-brown head and upperparts; striking crimson-red belly; green-red tail; emerald green wings. Highly social, living in flocks in forest canopy, feeding on fruits, flowers, seeds, and nectar. Less noisy than many parrots, making them well-suited as indoor pets. Lays 4–8 eggs; lifespan 15–20 years in captivity. IUCN status: Vulnerable due to habitat loss. Prized by parrot enthusiasts for their beauty and gentle temperament.",
    "image": "/images/animals/crimson-conure.jpg",
    "tags": [
      "Avian",
      "Parrot"
    ],
    "sources": [
      {
        "title": "Wikipedia - Crimson-bellied Parakeet",
        "url": "https://en.wikipedia.org/wiki/Crimson-bellied_parakeet"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "amazon-parrot",
    "type": "animal",
    "name_th": "นกแก้วอเมซอน",
    "name_en": "Amazon Parrot",
    "scientific_name": "Amazona spp.",
    "status": null,
    "summary_th": "กลุ่มนกแก้วอเมซอน สติปัญญาสูง อายุยืน เลียนเสียงเก่ง",
    "summary_en": "Highly intelligent long-lived parrots of the genus Amazona from the Americas",
    "body_th": "นกแก้วอเมซอนเป็นกลุ่มนกแก้วสกุล Amazona ประกอบด้วยมากกว่า 30 ชนิด มีถิ่นกำเนิดในอเมริกากลาง อเมริกาใต้ และหมู่เกาะแคริบเบียน ขนสีเขียวเป็นหลัก มีจุดสีสันต่างๆ บริเวณหัวตามชนิด เช่น เหลือง น้ำเงิน แดง ขนาดกลางถึงใหญ่ ความยาวลำตัว 26–45 ซม. น้ำหนัก 270–900 กรัม มีสติปัญญาสูงมาก เรียนรู้คำพูดและเสียงได้หลากหลาย บางชนิดมีคลังคำศัพท์ได้ถึงหลายร้อยคำ อายุขัย 50–80 ปีในกรง เป็นสัตว์สังคม กินผลไม้ เมล็ด ถั่ว และพืชต่างๆ ตามยอดไม้ในป่าเขตร้อน ผสมพันธุ์แบบคู่เดียว หลายชนิดถูกคุกคาม เช่น Puerto Rican Amazon (Amazona vittata) ซึ่ง IUCN จัดว่า Critically Endangered จำเป็นต้องนำเข้าอย่างถูกกฎหมายจาก CITES ที่ได้รับอนุญาต",
    "body_en": "Amazon Parrots comprise over 30 species in the genus Amazona, native to Central America, South America, and the Caribbean. Predominantly green plumage with species-specific markings in yellow, blue, or red on the head. Medium to large, 26–45 cm long, 270–900 g. Exceptionally intelligent with large vocabularies — some species can learn hundreds of words. Lifespan 50–80 years in captivity. Highly social; feed on fruits, seeds, nuts, and plants in rainforest canopies. Monogamous breeders. Several species face serious conservation threats; the Puerto Rican Amazon is Critically Endangered. Legal acquisition requires CITES-authorized permits.",
    "image": "/images/animals/amazon-parrot.jpg",
    "tags": [
      "Avian",
      "Parrot"
    ],
    "sources": [
      {
        "title": "Wikipedia - Amazona",
        "url": "https://en.wikipedia.org/wiki/Amazona"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "guineafowl",
    "type": "animal",
    "name_th": "ไก่ต๊อก",
    "name_en": "Helmeted Guineafowl",
    "scientific_name": "Numida meleagris",
    "status": "LC",
    "summary_th": "ไก่ต๊อกลายจุดขาว ช่วยกำจัดแมลงในฟาร์ม เสียงดังเตือนภัย",
    "summary_en": "African bird with white-spotted plumage; excellent natural pest controller on farms",
    "body_th": "Helmeted Guineafowl เป็นนกในวงศ์ Numididae มีถิ่นกำเนิดในทวีปแอฟริกาใต้สะฮารา ลำตัวกลม ขนาดกลาง ความยาว 53–58 ซม. น้ำหนัก 1.3–1.8 กก. ขนสีเทาเข้มประด้วยจุดสีขาวเด่นทั่วลำตัว หัวหัวโล้น สีน้ำเงิน-แดง มีหมวก (Helmet) เนื้อเขาสีน้ำตาลแดงบนกระหม่อม เสียงร้องดังและถี่ อยู่รวมฝูง 20–30 ตัว กินแมลง เห็บ ตะขาบ เมล็ดพืช ผัก และหนอน มีประโยชน์อย่างมากในการควบคุมแมลงศัตรูพืชและเห็บในฟาร์มและทุ่งหญ้าโดยไม่ต้องใช้สารเคมี นอกจากนี้ยังส่งเสียงเตือนเมื่อพบสัตว์ผู้ล่า วางไข่ 6–12 ฟองต่อครั้ง อายุขัย 10–15 ปี สถานะ IUCN: Least Concern",
    "body_en": "The Helmeted Guineafowl belongs to the Numididae family, native to sub-Saharan Africa. Body length 53–58 cm, weight 1.3–1.8 kg. Dark gray plumage densely spotted with white; bare blue-red head with a reddish-brown bony casque (helmet). Loud, repetitive calls. Lives in flocks of 20–30, feeding on insects, ticks, centipedes, seeds, vegetables, and worms. Extremely valuable in farms and pastures for natural pest and tick control without chemicals. Also serves as an alarm bird when predators approach. Lays 6–12 eggs; lifespan 10–15 years. IUCN: Least Concern.",
    "image": "/images/animals/guineafowl.jpg",
    "tags": [
      "Avian",
      "Domestic"
    ],
    "sources": [
      {
        "title": "Wikipedia - Helmeted Guineafowl",
        "url": "https://en.wikipedia.org/wiki/Helmeted_guineafowl"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "red-junglefowl",
    "type": "animal",
    "name_th": "ไก่ป่า",
    "name_en": "Red Junglefowl",
    "scientific_name": "Gallus gallus",
    "status": "LC",
    "summary_th": "บรรพบุรุษของไก่บ้านทั่วโลก พบในป่าเอเชียใต้-ตะวันออกเฉียงใต้",
    "summary_en": "Wild ancestor of all domestic chickens, native to South and Southeast Asian forests",
    "body_th": "Red Junglefowl เป็นต้นกำเนิดของไก่บ้านทั่วโลก (Gallus gallus domesticus) มีถิ่นกำเนิดในป่าเขตร้อนของเอเชียใต้และเอเชียตะวันออกเฉียงใต้ รวมถึงประเทศไทย ตัวผู้มีขนสีแดง-ส้ม-ดำสวยงาม มีแผงคอ (Hackle) สีทอง ขนหางยาวสีเขียวเหลือบ (Sickle feathers) และหงอนสีแดง ตัวเมียสีน้ำตาลเพื่อพรางตัว ความยาวตัวผู้ 65–78 ซม. ตัวเมีย 42–46 ซม. น้ำหนัก 0.5–1.5 กก. อาศัยในป่าโปร่ง ป่าไผ่ และพื้นที่เกษตรกรรม กินเมล็ดพืช แมลง ผลไม้ และสัตว์เล็กๆ ส่งเสียงขันแบบเดียวกับไก่บ้านแต่เสียงสั้นกว่า ถูกนำมาเลี้ยงครั้งแรกในเอเชียเมื่อ 5,000–10,000 ปีก่อน สถานะ IUCN: Least Concern",
    "body_en": "The Red Junglefowl is the wild ancestor of all domestic chickens (Gallus gallus domesticus), native to tropical forests of South and Southeast Asia, including Thailand. Males are brilliantly colored with red-orange-black plumage, golden hackles, iridescent green sickle tail feathers, and a red comb. Females are cryptic brown. Male body length 65–78 cm, females 42–46 cm; weight 0.5–1.5 kg. Inhabits open forests, bamboo groves, and farmland edges, feeding on seeds, insects, fruits, and small animals. Their crow is similar to but shorter than domestic chickens. First domesticated in Asia 5,000–10,000 years ago. IUCN: Least Concern.",
    "image": "/images/animals/red-junglefowl.jpg",
    "tags": [
      "Avian",
      "Galliformes"
    ],
    "sources": [
      {
        "title": "Wikipedia - Red Junglefowl",
        "url": "https://en.wikipedia.org/wiki/Red_junglefowl"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "golden-pheasant",
    "type": "animal",
    "name_th": "ไก่ฟ้าสีทอง",
    "name_en": "Golden Pheasant",
    "scientific_name": "Chrysolophus pictus",
    "status": "LC",
    "summary_th": "ไก่ฟ้าสีสันสดจากจีน ตัวผู้มีหัวทองและแผงคอลายเกล็ดงดงาม",
    "summary_en": "Brilliantly colored Chinese pheasant with golden crest and scaled red-yellow cape",
    "body_th": "Golden Pheasant หรือ Chinese Pheasant เป็นไก่ฟ้าที่มีสีสันสวยงามที่สุดชนิดหนึ่งในโลก มีถิ่นกำเนิดในป่าและพื้นที่สูงของจีนกลาง-ตะวันตก ตัวผู้มีหัวสีทองงดงาม แผงคอสีเหลือง-แดงลวดลายเกล็ด (Ruff) หน้าอกสีแดงสด ปีกสีน้ำเงิน หางยาวสีน้ำตาลลาย ความยาวรวมหาง 90–105 ซม. ตัวเมียสีน้ำตาลพรางตัว ยาว 60–80 ซม. น้ำหนักตัวผู้ 630–700 กรัม ตัวเมีย 525–675 กรัม อาศัยในป่าไม้ไผ่และป่าเขา กินหน่อไม้ ใบไม้ เมล็ดพืช และแมลง ตัวผู้แสดงแผงคอและการเต้นรำในฤดูผสมพันธุ์ อายุขัย 5–6 ปีในธรรมชาติ 15–25 ปีในกรง สถานะ IUCN: Least Concern มีการเลี้ยงในสวนสัตว์และฟาร์มทั่วโลกมากกว่า 200 ปีแล้ว",
    "body_en": "The Golden (Chinese) Pheasant is one of the world's most brilliantly colored birds, native to forests and mountains of central-western China. Males display a golden crest, a scaled yellow-red cape (ruff), brilliant red breast, blue wings, and a long brown barred tail; total length 90–105 cm. Females are cryptic brown, 60–80 cm long. Male weight 630–700 g, female 525–675 g. Inhabits bamboo forests and mountain woodlands, feeding on bamboo shoots, leaves, seeds, and insects. Males perform elaborate ruff-spreading displays during breeding season. Lifespan 5–6 years wild, 15–25 years in captivity. IUCN: Least Concern. Kept worldwide in zoos and farms for over 200 years.",
    "image": "/images/animals/golden-pheasant.jpg",
    "tags": [
      "Avian",
      "Pheasant"
    ],
    "sources": [
      {
        "title": "Wikipedia - Golden Pheasant",
        "url": "https://en.wikipedia.org/wiki/Golden_pheasant"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "teak",
    "type": "plant",
    "name_th": "ต้นสักทอง",
    "name_en": "Teak",
    "scientific_name": "Tectona grandis",
    "status": "LC",
    "summary_th": "ราชาแห่งไม้เนื้อแข็ง เนื้อทนทาน ต้านน้ำและแมลงได้ตามธรรมชาติ",
    "summary_en": "King of tropical hardwoods; naturally oil-rich, water and insect resistant",
    "body_th": "สักทองเป็นไม้เนื้อแข็งเขตร้อนในวงศ์ Lamiaceae มีถิ่นกำเนิดในเอเชียใต้และเอเชียตะวันออกเฉียงใต้ โดยเฉพาะอินเดีย เมียนมา ลาว และไทย เป็นต้นไม้ขนาดใหญ่ สูง 25–40 เมตร ลำต้นตรง เส้นผ่านศูนย์กลางถึง 150 ซม. ใบใหญ่รูปรีถึงรูปไข่ ขนาด 30–60 ซม. ร่วงใบในฤดูแล้ง ออกดอกสีขาวเป็นช่อช่วงมิถุนายน–ตุลาคม เนื้อไม้สีเหลือง-ทอง มีน้ำมันธรรมชาติทำให้ทนน้ำ แมลง และสภาพอากาศ อายุตัดฟัน 30–80 ปีขึ้นไป นิยมใช้ทำเรือ เฟอร์นิเจอร์หรู พื้น และงานสถาปัตยกรรม ราคาสูงในตลาดโลก ปัจจุบันรัฐบาลไทยควบคุมการตัดและการค้าไม้สักอย่างเข้มงวด สถานะ IUCN: Least Concern",
    "body_en": "Teak is a large tropical hardwood tree (Lamiaceae), native to South and Southeast Asia — particularly India, Myanmar, Laos, and Thailand. Trees grow 25–40 m tall with trunk diameters up to 150 cm. Large elliptic-ovate leaves 30–60 cm, deciduous in dry season. White flowers in clusters bloom June–October. The golden-yellow wood contains natural oils that resist water, insects, and weathering — making it one of the world's most prized timbers. Harvested after 30–80+ years; used in shipbuilding, luxury furniture, flooring, and architecture. Strictly regulated by Thai law. IUCN: Least Concern.",
    "image": "/images/plants/teak.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Teak",
        "url": "https://en.wikipedia.org/wiki/Teak"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "burmese-rosewood",
    "type": "plant",
    "name_th": "ต้นประดู่ป่า",
    "name_en": "Burmese Rosewood",
    "scientific_name": "Pterocarpus macrocarpus",
    "status": null,
    "summary_th": "ไม้เนื้อแข็งสีน้ำตาล-แดง ดอกเหลืองหอม ใช้ทำเฟอร์นิเจอร์หรู",
    "summary_en": "Fragrant-flowered hardwood valued for luxury furniture and musical instruments",
    "body_th": "ประดู่ป่าเป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–30 เมตร พบในป่าเบญจพรรณและป่าดิบแล้งทั่วเอเชียตะวันออกเฉียงใต้ รวมถึงไทย เมียนมา และลาว ใบประกอบแบบขนนก ออกดอกสีเหลืองหอมเป็นช่อ ฝักกลม-แผ่นมีปีก เนื้อไม้สีน้ำตาล-แดง เนื้อหยาบ มีลวดลายสวยงาม ความแข็งแรงสูง ทนทานต่อการผุพัง นิยมใช้ทำเฟอร์นิเจอร์หรู เครื่องดนตรี พื้น และงานแกะสลัก เนื้อไม้มีน้ำมันหอมระเหยมีสรรพคุณทางยา ใบและเปลือกใช้ในภูมิปัญญาพื้นบ้านเพื่อรักษาโรคผิวหนังและอักเสบ มีคุณค่าสูงในตลาดส่งออก บางพื้นที่ประชากรลดลงจากการตัดไม้เกินขนาด",
    "body_en": "Burmese Rosewood is a medium-to-large legume tree (Fabaceae), 15–30 m tall, found in mixed deciduous and dry evergreen forests across Southeast Asia including Thailand, Myanmar, and Laos. Pinnate leaves; fragrant yellow flowers in clusters; round winged pods. The brown-red wood is coarse-grained, beautifully figured, hard, and durable. Widely used for luxury furniture, musical instruments, flooring, and carving. The wood contains aromatic essential oils with medicinal properties; leaves and bark are used in folk medicine for skin conditions and inflammation. Highly valued for export; populations declining in some areas due to over-logging.",
    "image": "/images/plants/burmese-rosewood.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Pterocarpus macrocarpus",
        "url": "https://en.wikipedia.org/wiki/Pterocarpus_macrocarpus"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "siamese-rosewood",
    "type": "plant",
    "name_th": "ต้นพะยูง",
    "name_en": "Siamese Rosewood",
    "scientific_name": "Dalbergia cochinchinensis",
    "status": "EN",
    "summary_th": "ไม้หวงห้ามสูงสุด เนื้อสีม่วง-แดง ราคาสูงที่สุดในบรรดาไม้เนื้อแข็งเอเชีย",
    "summary_en": "Asia's most valuable rosewood; protected by CITES and Thai law due to illegal logging",
    "body_th": "พะยูงเป็นไม้ในสกุล Dalbergia วงศ์ถั่ว (Fabaceae) มีถิ่นกำเนิดในไทย กัมพูชา เวียดนาม และลาว สูง 10–25 เมตร เนื้อไม้สีม่วง-น้ำตาลแดง ลวดลายสวยงาม เนื้อละเอียด แข็งแกร่งและทนทานมาก ราคาสูงที่สุดในบรรดาไม้เนื้อแข็งของเอเชีย บางครั้งเรียก \"ไม้โรสวู้ดไทย\" หรือ \"พะยูงไทย\" นิยมใช้ทำเฟอร์นิเจอร์หรูส่งออกจีน เครื่องดนตรีชั้นดี (ลูกบิดกีต้าร์ วิโอลิน) และงานแกะสลักประณีต การลักลอบตัดและค้าเพื่อส่งออกทำให้ใกล้สูญพันธุ์ในธรรมชาติ อยู่ใน CITES Appendix II และจัดเป็นไม้หวงห้ามพิเศษตาม พ.ร.บ. ป่าไม้ของไทย สถานะ IUCN: Endangered",
    "body_en": "Siamese Rosewood is a Dalbergia species (Fabaceae) native to Thailand, Cambodia, Vietnam, and Laos, growing 10–25 m tall. Its purple-red to dark brown wood has beautiful fine grain, exceptional hardness, and outstanding durability — the most valuable hardwood in Asia, known as 'Thai Rosewood.' Prized for luxury furniture exported to China, fine musical instruments (guitar tuning pegs, violins), and intricate carving. Intense illegal logging and smuggling has driven it to near-extinction in the wild. Listed on CITES Appendix II and as a specially protected timber under Thai forestry law. IUCN: Endangered.",
    "image": "/images/plants/siamese-rosewood.jpg",
    "tags": [
      "Protected",
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Dalbergia cochinchinensis",
        "url": "https://en.wikipedia.org/wiki/Dalbergia_cochinchinensis"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "payom",
    "type": "plant",
    "name_th": "ต้นพยอม",
    "name_en": "White Meranti (Payom)",
    "scientific_name": "Shorea roxburghii",
    "status": "VU",
    "summary_th": "ไม้ในวงศ์ยาง ดอกหอม นิยมปลูกตามวัดและถนน",
    "summary_en": "Fragrant-flowered Dipterocarp tree planted at temples and roadsides across Southeast Asia",
    "body_th": "พยอมเป็นไม้ยืนต้นขนาดใหญ่ในวงศ์ยาง (Dipterocarpaceae) สูง 20–35 เมตร พบในป่าเบญจพรรณและป่าดิบแล้งของไทย อินเดีย และเอเชียตะวันออกเฉียงใต้ ใบรูปหอก-รูปไข่ ออกดอกสีขาวหรือครีมหอมหวานเป็นช่อ กลีบเลี้ยงขยายเป็นปีก 5 ปีกช่วยให้เมล็ดร่อนในอากาศ นิยมปลูกเป็นไม้ประดับในวัดและถนนทั่วไทย เนื้อไม้สีขาว-ครีม ใช้ก่อสร้าง กล่องไม้ และกระดาษ น้ำยางมีสรรพคุณทางยา ดอกมีกลิ่นหอมหวานใช้บูชาพระ มีบทบาทสำคัญในระบบนิเวศป่าเป็นอาหารของสัตว์ป่าหลากชนิด สถานะ IUCN: Vulnerable เนื่องจากการสูญเสียป่าอย่างต่อเนื่อง",
    "body_en": "Payom (White Meranti) is a large Dipterocarpaceae tree, 20–35 m tall, found in mixed deciduous and dry evergreen forests of Thailand, India, and Southeast Asia. Lance-ovate leaves; fragrant white or cream flower clusters; 5-winged sepals help seeds disperse by wind. Planted as an ornamental in temple grounds and along roadsides throughout Thailand. White-cream wood used in construction, crates, and paper. The resin has medicinal uses; fragrant flowers are offered in Buddhist ceremonies. Important ecologically as a food source for diverse wildlife. IUCN: Vulnerable due to ongoing forest loss.",
    "image": "/images/plants/payom.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Shorea roxburghii",
        "url": "https://en.wikipedia.org/wiki/Shorea_roxburghii"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "takhian-thong",
    "type": "plant",
    "name_th": "ต้นตะเคียนทอง",
    "name_en": "Takhian (Hopea)",
    "scientific_name": "Hopea odorata",
    "status": "VU",
    "summary_th": "ไม้ยืนต้นขนาดใหญ่ วงศ์ยาง เนื้อแข็งมาก มีตำนานสิ่งศักดิ์สิทธิ์",
    "summary_en": "Giant Dipterocarp with very hard water-resistant timber and rich Thai spiritual folklore",
    "body_th": "ตะเคียนทองเป็นไม้ยืนต้นขนาดใหญ่ในวงศ์ยาง (Dipterocarpaceae) สูง 30–45 เมตร เส้นผ่านศูนย์กลางลำต้นถึง 200 ซม. พบในป่าดิบชื้นและป่าดิบแล้งทั่วเอเชียตะวันออกเฉียงใต้ ใบเดี่ยวเรียงสลับ รูปรีถึงรูปไข่ ปลายแหลม ออกดอกสีขาว-เหลืองอ่อน เนื้อไม้สีน้ำตาล-แดง แข็งมาก ทนต่อแมลงและความชื้น เหมาะสร้างสะพาน เรือ รางน้ำ และงานก่อสร้างกลางแจ้ง น้ำมันยางใช้ทาไม้ป้องกันแมลง ในวัฒนธรรมไทยเชื่อว่ามีสิ่งศักดิ์สิทธิ์ (นางไม้) สิงอยู่ มักปรากฏในนิทานพื้นบ้านและละครไทย ห้ามตัดโดยไม่ขออนุญาตและไม่ทำพิธีกรรม สถานะ IUCN: Vulnerable",
    "body_en": "Takhian (Hopea odorata) is a massive Dipterocarpaceae tree, 30–45 m tall with trunk diameters up to 200 cm, found in tropical rainforests across Southeast Asia. Alternate elliptic-ovate leaves with pointed tips; white-pale yellow flowers. The brown-red wood is very hard, resistant to insects and moisture — ideal for bridges, boats, water troughs, and outdoor construction. Resin is used as a wood preservative. In Thai culture, the tree is believed to be home to spirits (Nang Mai) and features prominently in folk tales and classical Thai drama; cutting requires formal permission and ritual. IUCN: Vulnerable.",
    "image": "/images/plants/takhian-thong.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Hopea odorata",
        "url": "https://en.wikipedia.org/wiki/Hopea_odorata"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "chingchan",
    "type": "plant",
    "name_th": "ต้นชิงชัน",
    "name_en": "Dalbergia (Chingchan)",
    "scientific_name": "Dalbergia oliveri",
    "status": "EN",
    "summary_th": "ไม้เนื้อแข็งสกุล Dalbergia เนื้อสีม่วง-แดง ใกล้เคียงพะยูง อยู่ใน CITES",
    "summary_en": "CITES-listed Dalbergia hardwood with purple-red grain; used in fine furniture and instruments",
    "body_th": "ชิงชันเป็นไม้ยืนต้นในสกุล Dalbergia วงศ์ถั่ว (Fabaceae) สูง 15–25 เมตร พบในป่าเบญจพรรณและป่าผลัดใบของเมียนมา ลาว กัมพูชา และไทย ใบประกอบขนนก ออกดอกสีขาว เนื้อไม้สีม่วงอ่อน-น้ำตาลแดง มีลวดลายสวย ลักษณะคล้ายพะยูง แต่สีอ่อนกว่าเล็กน้อย เนื้อแน่น แข็งแกร่ง ทนทาน ใช้ทำเฟอร์นิเจอร์หรู ของตกแต่งบ้าน เครื่องดนตรี และงานแกะสลักประดับ มีคุณค่าสูงในตลาด ถูกลักลอบค้าร่วมกับพะยูง จัดอยู่ใน CITES Appendix II เพื่อควบคุมการค้าระหว่างประเทศ สถานะ IUCN: Endangered",
    "body_en": "Chingchan is a Dalbergia tree (Fabaceae), 15–25 m tall, in mixed deciduous and dry forests of Myanmar, Laos, Cambodia, and Thailand. Pinnate leaves; white flowers. Purple-light to reddish-brown wood with attractive grain, similar to Siamese Rosewood but somewhat lighter in color. Dense, strong, and durable. Used for luxury furniture, home décor, musical instruments, and decorative carving. Highly valuable commercially; often trafficked alongside Siamese Rosewood. Listed on CITES Appendix II to regulate international trade. IUCN: Endangered.",
    "image": "/images/plants/chingchan.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Dalbergia oliveri",
        "url": "https://en.wikipedia.org/wiki/Dalbergia_oliveri"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "yang-na",
    "type": "plant",
    "name_th": "ต้นยางนา",
    "name_en": "Yang Na",
    "scientific_name": "Dipterocarpus alatus",
    "status": "CR",
    "summary_th": "ต้นไม้ยักษ์วงศ์ยาง สูงถึง 50 เมตร น้ำมันยางมีประโยชน์หลากหลาย",
    "summary_en": "Giant Dipterocarp reaching 50 m; resin used for wood treatment and traditional medicine",
    "body_th": "ยางนาเป็นไม้ยืนต้นขนาดใหญ่มากในวงศ์ยาง (Dipterocarpaceae) สูง 30–50 เมตร บางครั้งถึง 60 เมตร เส้นผ่านศูนย์กลางลำต้น 100–200 ซม. พบในป่าดิบชื้นของไทย ลาว กัมพูชา และเวียดนาม ใบเดี่ยวขนาดใหญ่ รูปรี ออกดอกสีชมพู-ขาว มีกลีบเลี้ยงขยายเป็นปีก 2 ปีกยาวช่วยให้เมล็ดร่อนไกล เนื้อไม้สีน้ำตาลแดง แข็งแรง ใช้ก่อสร้างและต่อเรือ น้ำมันยาง (Yang Oil) ใช้ทาไม้ ผสมสี และรักษาโรคผิวหนังในตำรายาพื้นบ้าน เป็นต้นไม้ให้ร่มเงาขนาดใหญ่ นิยมปลูกริมถนนและในวัด มีบทบาทสำคัญในระบบนิเวศ สถานะ IUCN: Critically Endangered เนื่องจากการตัดไม้ทำลายป่าและการขยายพื้นที่เกษตรกรรม",
    "body_en": "Yang Na (Dipterocarpus alatus) is one of Southeast Asia's largest trees, reaching 30–60 m height with trunk diameters of 100–200 cm. Found in tropical rainforests of Thailand, Laos, Cambodia, and Vietnam. Large elliptic leaves; pink-white flowers with 2 long winged sepals that help seeds glide long distances. Brown-red timber used in construction and boat-building. Yang oil (resin) is used for wood treatment, paint, and skin conditions in folk medicine. Provides extensive shade; planted along roadsides and in temples. Ecologically critical. IUCN: Critically Endangered due to deforestation and agricultural expansion.",
    "image": "/images/plants/yang-na.jpg",
    "tags": [
      "Large tree",
      "Resin"
    ],
    "sources": [
      {
        "title": "Wikipedia - Dipterocarpus alatus",
        "url": "https://en.wikipedia.org/wiki/Dipterocarpus_alatus"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "bamboo",
    "type": "plant",
    "name_th": "ไผ่",
    "name_en": "Bamboo",
    "scientific_name": "Bambusoideae",
    "status": null,
    "summary_th": "พืชหญ้ายักษ์ เติบโตเร็วที่สุดในโลก ประโยชน์หลากหลายตั้งแต่อาหารถึงก่อสร้าง",
    "summary_en": "World's fastest-growing plant; versatile grass used in food, construction, and crafts",
    "body_th": "ไผ่เป็นพืชในอนุวงศ์ Bambusoideae วงศ์ Poaceae (หญ้า) มีมากกว่า 1,400 ชนิดทั่วโลก พบมากในเอเชีย อเมริกาใต้ และแอฟริกา สายพันธุ์มีขนาดหลากหลาย ตั้งแต่เล็กไม่กี่ซม. ไปถึงยักษ์อย่าง Dendrocalamus giganteus สูงกว่า 30 เมตร ไผ่เติบโตเร็วที่สุดในโลก บางชนิดสูงได้ถึง 91 ซม./วัน ลำต้นเป็นปล้องกลวง แข็งแรง ทนแรงดึงสูง ใช้ประโยชน์หลากหลาย ได้แก่ งานก่อสร้างและนั่งร้าน งานจักสานหัตถกรรม หน่อไม้เป็นอาหาร กระดาษ เฟอร์นิเจอร์ พื้น เครื่องดนตรี ถ่านไผ่ และวัสดุคอมโพสิต ช่วยป้องกันการพังทลายของดินริมฝั่งน้ำ ดูดซับคาร์บอนไดออกไซด์สูง เป็นอาหารหลักของแพนด้ายักษ์ และเป็นสัตว์ขนาดเล็กจำนวนมากอาศัย",
    "body_en": "Bamboo belongs to subfamily Bambusoideae (Poaceae, true grasses), with over 1,400 species worldwide — abundant in Asia, South America, and Africa. Sizes range from small ornamentals to giants like Dendrocalamus giganteus exceeding 30 m. The world's fastest-growing plants, with some species growing up to 91 cm per day. Hollow, segmented culms are strong with high tensile strength. Uses: construction scaffolding, basketry and handicrafts, food (bamboo shoots), paper, furniture, flooring, musical instruments, charcoal, and composite materials. Ecologically important for riverbank erosion control, high CO₂ absorption, giant panda diet, and small animal habitat.",
    "image": "/images/plants/bamboo.jpg",
    "tags": [
      "Grass"
    ],
    "sources": [
      {
        "title": "Wikipedia - Bamboo",
        "url": "https://en.wikipedia.org/wiki/Bamboo"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "salao",
    "type": "plant",
    "name_th": "ต้นเสลา",
    "name_en": "Lagerstroemia (Salao)",
    "scientific_name": "Lagerstroemia loudonii",
    "status": null,
    "summary_th": "ไม้ดอกม่วง-ชมพูสวยงาม นิยมปลูกประดับวัดและถนนในไทย",
    "summary_en": "Beautiful purple-pink flowering tree popular in Thai temple and roadside planting",
    "body_th": "เสลาเป็นไม้ดอกยืนต้นขนาดกลางในสกุล Lagerstroemia วงศ์ Lythraceae สูง 10–20 เมตร มีถิ่นกำเนิดในไทย ลาว และกัมพูชา ออกดอกสีม่วง-ชมพูสดสวยงามเป็นช่อขนาดใหญ่ กลีบดอกย่นคล้ายกระดาษ มักออกดอกปีละ 2–3 ครั้ง เปลือกต้นเรียบสีน้ำตาล-เทา ลอกออกเป็นแผ่นบาง ใบรูปรีถึงรูปไข่ ผลัดใบในฤดูแล้ง นิยมปลูกเป็นไม้ประดับตามริมถนน สวนสาธารณะ และวัด เนื้อไม้แข็งแรง ใช้ก่อสร้างและทำเครื่องมือ เปลือกและใบมีสรรพคุณทางยา ใช้ในตำรายาสมุนไพรพื้นบ้านช่วยลดน้ำตาลในเลือด ปลูกง่าย ทนแล้งได้พอสมควร ต้านทานโรคดี เหมาะสำหรับงานจัดสวนในเขตร้อน",
    "body_en": "Salao is a medium deciduous flowering tree (Lythraceae), native to Thailand, Laos, and Cambodia, growing 10–20 m tall. Produces large, showy clusters of crinkled purple-pink flowers (resembling crepe paper) 2–3 times per year. Smooth gray-brown exfoliating bark; elliptic-ovate leaves, deciduous in dry season. Widely planted as an ornamental along roadsides, in parks, and temple grounds. Durable hardwood used in construction and tool-making. Bark and leaves are used in traditional herbal medicine, notably for blood sugar regulation. Easy to grow, moderately drought-tolerant, and disease-resistant — popular in tropical landscaping.",
    "image": "/images/plants/salao.jpg",
    "tags": [
      "Ornamental"
    ],
    "sources": [
      {
        "title": "Wikipedia - Lagerstroemia loudonii",
        "url": "https://en.wikipedia.org/wiki/Lagerstroemia_loudonii"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "red-padau",
    "type": "plant",
    "name_th": "ต้นประดู่แดง",
    "name_en": "Narra (Red Paduak)",
    "scientific_name": "Pterocarpus indicus",
    "status": "VU",
    "summary_th": "ไม้ประจำชาติฟิลิปปินส์ ดอกเหลืองหอม น้ำยางสีแดงมีประโยชน์ทางยา",
    "summary_en": "Philippines' national tree; fragrant yellow flowers; red resin used medicinally",
    "body_th": "ประดู่แดง (Narra) เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–30 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ ตั้งแต่ฟิลิปปินส์ อินโดนีเซีย มาเลเซีย ไปจนถึงไทยและเมียนมา ออกดอกสีเหลืองหอมหวาน เปลือกแตกเป็นร่องตื้น มีน้ำยางสีแดงชาดออกเมื่อถูกตัด ใช้เป็นสีและยา เนื้อไม้สีแดง-น้ำตาล มีลวดลายสวย แข็งแรง ทนทาน นิยมใช้ทำเฟอร์นิเจอร์ พื้น และของตกแต่ง ปลูกเป็นร่มเงาตามถนนเนื่องจากเรือนยอดกว้าง เป็นต้นไม้ประจำชาติฟิลิปปินส์ เปลือกและรากมีสรรพคุณทางยาพื้นบ้าน รักษาแผลและโรคผิวหนัง สถานะ IUCN: Vulnerable",
    "body_en": "Narra (Red Paduak) is a medium-to-large Fabaceae tree, 15–30 m tall, native to Southeast Asia from the Philippines, Indonesia, and Malaysia to Thailand and Myanmar. Produces fragrant yellow flowers; furrowed bark exudes red-crimson resin used as dye and medicine. The red-brown wood is attractively grained, strong, and durable — widely used for furniture, flooring, and decorative items. Broad canopy makes it ideal for roadside shade planting. The national tree of the Philippines. Bark and roots have traditional medicinal uses for wounds and skin conditions. IUCN: Vulnerable.",
    "image": "/images/plants/red-padau.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Pterocarpus indicus",
        "url": "https://en.wikipedia.org/wiki/Pterocarpus_indicus"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "pak-wan-pa",
    "type": "plant",
    "name_th": "ต้นผักหวานป่า",
    "name_en": "Pak Wan Pa (Sweet Leaf Tree)",
    "scientific_name": "Melientha suavis",
    "status": null,
    "summary_th": "พืชยอดอ่อนหวาน โปรตีนสูง ราคาดีในตลาด อาหารไทยแท้",
    "summary_en": "High-protein sweet forest vegetable prized in Thai cuisine and local markets",
    "body_th": "ผักหวานป่าเป็นพืชยืนต้นในวงศ์ Opiliaceae สูง 5–15 เมตร มีถิ่นกำเนิดในป่าผลัดใบของไทยและเอเชียตะวันออกเฉียงใต้ ยอดอ่อนและใบอ่อนมีรสหวานอมขมเล็กน้อย อุดมด้วยโปรตีน (สูงกว่าผักทั่วไป 3–4 เท่า) วิตามิน B และ C แคลเซียม และธาตุเหล็ก นิยมใช้ปรุงอาหารไทยหลากหลาย เช่น แกงผักหวาน ต้มผักหวาน และผัดผักหวาน ออกดอกเล็กสีขาว-เหลือง ดอกและผลกินได้ ผลสุกสีส้มแดง รสหวาน ราคาในตลาดค่อนข้างสูง (200–400 บาท/กก.) นิยมเพาะปลูกในสวนและฟาร์ม เติบโตช้าแต่ดูแลง่าย ทนแล้ง ให้ผลผลิตนานหลายสิบปี",
    "body_en": "Pak Wan Pa (Sweet Leaf Tree) is a forest tree in the Opiliaceae family, growing 5–15 m tall in deciduous forests of Thailand and Southeast Asia. Young shoots and tender leaves have a pleasantly sweet-slightly-bitter flavor and are exceptionally rich in protein (3–4× more than common vegetables), vitamins B and C, calcium, and iron. Popular in Thai cuisine: used in curries, soups, and stir-fries. Small white-yellow flowers; edible orange-red fruits when ripe. Commands premium market prices (200–400 THB/kg). Increasingly cultivated in gardens and farms — slow-growing but easy to care for, drought-tolerant, and productive for decades.",
    "image": "/images/plants/pak-wan-pa.jpg",
    "tags": [
      "Edible"
    ],
    "sources": [
      {
        "title": "Wikipedia - Melientha suavis",
        "url": "https://en.wikipedia.org/wiki/Melientha_suavis"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "pomelo",
    "type": "plant",
    "name_th": "ต้นส้มโอ",
    "name_en": "Pomelo",
    "scientific_name": "Citrus maxima",
    "status": null,
    "summary_th": "ส้มผลใหญ่ที่สุดในโลก วิตามิน C สูง มีหลายสายพันธุ์ดังในไทย",
    "summary_en": "World's largest citrus fruit; high in vitamin C with many celebrated Thai varieties",
    "body_th": "ส้มโอเป็นไม้ผลเขตร้อนในสกุล Citrus วงศ์ Rutaceae มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ สูง 5–15 เมตร ผลมีขนาดใหญ่ที่สุดในตระกูลส้ม เส้นผ่านศูนย์กลาง 15–25 ซม. น้ำหนัก 1–2 กก. เปลือกหนา สีเหลือง-เขียว เนื้อมีทั้งสีขาว เหลือง ชมพู และแดงทับทิมตามสายพันธุ์ รสหวาน-เปรี้ยว กลิ่นหอม มีวิตามิน C สูง เส้นใยอาหารมาก และสารต้านอนุมูลอิสระ ในไทยมีสายพันธุ์ชื่อดัง เช่น ส้มโอขาวใหญ่ ทองดี ขาวน้ำผึ้ง และแดงใหญ่ ออกดอกสีขาวหอมช่วงมกราคม-มีนาคม เก็บเกี่ยวในช่วงสิงหาคม-ธันวาคม ใช้บริโภคสด ทำน้ำผลไม้ ยำส้มโอ และเป็นของขวัญในเทศกาลสำคัญ มีประวัติการปลูกในไทยมากกว่า 300 ปี",
    "body_en": "Pomelo is a tropical citrus tree (Rutaceae), native to Southeast Asia, growing 5–15 m tall. Its fruit is the largest of all citrus, 15–25 cm diameter, 1–2 kg, with thick peel and juicy flesh that varies by variety: white, yellow, pink, or ruby-red. Sweet-tart flavor with a pleasant aroma; high in vitamin C, dietary fiber, and antioxidants. Thailand's celebrated varieties include Khao Yai, Thong Dee, Khao Nam Phueng, and Daeng Yai. White fragrant flowers bloom January–March; harvest August–December. Eaten fresh, juiced, used in salads (yam som oh), and exchanged as gifts during festivals. Cultivated in Thailand for over 300 years.",
    "image": "/images/plants/pomelo.jpg",
    "tags": [
      "Fruit tree"
    ],
    "sources": [
      {
        "title": "Wikipedia - Pomelo",
        "url": "https://en.wikipedia.org/wiki/Pomelo"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "guava",
    "type": "plant",
    "name_th": "ต้นฝรั่ง",
    "name_en": "Guava",
    "scientific_name": "Psidium guajava",
    "status": null,
    "summary_th": "ไม้ผลวิตามิน C สูง ปลูกง่าย ทนแล้ง ออกผลเกือบตลอดปี",
    "summary_en": "Vitamin C-rich tropical fruit; easy to grow, drought-tolerant, and nearly year-round bearing",
    "body_th": "ฝรั่งเป็นไม้ผลเขตร้อนในวงศ์ Myrtaceae สูง 5–10 เมตร มีถิ่นกำเนิดในอเมริกากลางและอเมริกาใต้ ปัจจุบันปลูกทั่วโลกในเขตร้อน เติบโตเร็ว ทนแล้ง ปลูกง่าย ผลกลม-รีหรือแบน เปลือกสีเขียว-เหลือง เนื้อสีขาว ชมพู หรือแดง รสหวาน-เปรี้ยว กลิ่นหอม มีวิตามิน C สูงมากเป็น 4 เท่าของส้ม มีวิตามิน A เส้นใยอาหาร โพแทสเซียม และสารต้านอนุมูลอิสระ ใบต้มดื่มช่วยแก้ท้องเสียและควบคุมระดับน้ำตาลในเลือด ออกผลเกือบตลอดปี ใช้บริโภคสดและแปรรูปเป็นน้ำฝรั่ง แยม เจลลี่ และโยเกิร์ต สายพันธุ์ที่นิยมในไทย เช่น ฝรั่งกลมสาลี่ ฝรั่งไร้เมล็ด และฝรั่งกิมจู",
    "body_en": "Guava is a fast-growing tropical fruit tree (Myrtaceae), native to Central and South America, now cultivated worldwide in tropical regions. Grows 5–10 m tall; drought-tolerant and easy to cultivate. Round-oval fruit with green-yellow skin; flesh is white, pink, or red. Sweet-tart flavor with a distinctive aroma. Exceptionally high in vitamin C (4× more than oranges), vitamin A, dietary fiber, potassium, and antioxidants. Leaf tea is used medicinally for diarrhea and blood sugar control. Fruits nearly year-round. Eaten fresh or processed into juice, jam, jelly, and yogurt. Popular Thai varieties include Kluay Salee, seedless guava, and Kim Ju.",
    "image": "/images/plants/guava.jpg",
    "tags": [
      "Fruit tree"
    ],
    "sources": [
      {
        "title": "Wikipedia - Guava",
        "url": "https://en.wikipedia.org/wiki/Guava"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "lime",
    "type": "plant",
    "name_th": "ต้นมะนาว",
    "name_en": "Key Lime",
    "scientific_name": "Citrus aurantiifolia",
    "status": null,
    "summary_th": "พืชตระกูลส้ม วิตามิน C สูง หัวใจของอาหารไทยและเครื่องดื่ม",
    "summary_en": "Essential souring agent in Thai cuisine; rich in vitamin C and aromatic oils",
    "body_th": "มะนาวเป็นไม้ผลพุ่มเล็กถึงต้นขนาดกลาง ในสกุล Citrus วงศ์ Rutaceae สูง 3–6 เมตร มีถิ่นกำเนิดในเอเชียใต้-ตะวันออกเฉียงใต้ ออกดอกสีขาวหรือชมพูอ่อน หอม ผลกลมเล็ก เส้นผ่านศูนย์กลาง 3–5 ซม. เปลือกสีเขียว-เหลือง เนื้อสีเหลือง-เขียว รสเปรี้ยวจัด กลิ่นหอมเฉพาะ มีวิตามิน C และสารต้านอนุมูลอิสระสูง ใช้ปรุงรสอาหารไทยทุกประเภท ทั้งยำ น้ำพริก ต้มยำ แกงส้ม และเครื่องดื่ม น้ำมันจากเปลือกมะนาวใช้ในอุตสาหกรรมเครื่องสำอาง ยา และอาหาร ในไทยนิยมปลูกเชิงการค้าหลายสายพันธุ์ เช่น มะนาวแป้น (Round lime) และสายพันธุ์หนัง ออกผลเกือบตลอดปี ชนิดที่พบในตลาดไทยส่วนใหญ่คือ Citrus aurantiifolia ซึ่งมีรสเปรี้ยวกว่า Persian lime",
    "body_en": "Key Lime is a small-to-medium citrus shrub or tree (Rutaceae), native to South-Southeast Asia, growing 3–6 m tall. White or pale pink fragrant flowers; small round fruits 3–5 cm diameter with green-yellow skin and intensely tart yellow-green juice; distinctive aromatic fragrance. High in vitamin C and antioxidants. Indispensable in Thai cuisine for seasoning salads (yam), chili pastes, tom yum, sour curries, and beverages. Peel oil is used in the cosmetic, pharmaceutical, and food industries. Commercially grown in Thailand in Round Lime and thick-skinned varieties; fruits nearly year-round. The Thai lime is more tart than Persian limes found in Western markets.",
    "image": "/images/plants/lime.jpg",
    "tags": [
      "Fruit tree"
    ],
    "sources": [
      {
        "title": "Wikipedia - Key Lime",
        "url": "https://en.wikipedia.org/wiki/Key_lime"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "golden-shower",
    "type": "plant",
    "name_th": "ต้นคูน (ราชพฤกษ์)",
    "name_en": "Golden Shower Tree",
    "scientific_name": "Cassia fistula",
    "status": null,
    "summary_th": "ดอกไม้ประจำชาติไทย ช่อเหลืองทองสวยงาม ออกดอกพร้อมกันทั่วประเทศ",
    "summary_en": "Thailand's national flower; spectacular golden yellow blooms signaling the start of Thai summer",
    "body_th": "คูนหรือราชพฤกษ์เป็นไม้ยืนต้นขนาดกลางในวงศ์ถั่ว (Fabaceae) สูง 10–20 เมตร มีถิ่นกำเนิดในเอเชียใต้ โดยเฉพาะอินเดีย ศรีลังกา และเมียนมา ออกดอกสีเหลืองทองเป็นช่อห้อยยาว 30–40 ซม. สวยงามตระการตา ออกดอกพร้อมกันทั่วไทยช่วงเมษายน-พฤษภาคม ก่อนฝนตก ดอกไม้ประจำชาติไทย ฝักกลม-ยาว 30–60 ซม. มีเมล็ดหลายเมล็ด เนื้อในฝักสีดำหวาน ใช้เป็นยาระบายอ่อนๆ เปลือกและรากใช้ในตำรายาอายุรเวทเพื่อรักษาไข้ โรคผิวหนัง และระบบย่อยอาหาร ใบสีเหลืองหล่นก่อนออกดอก ใบอ่อนใช้ทำอาหาร เนื้อไม้แข็งใช้งานทั่วไป นิยมปลูกตามถนนและสวนสาธารณะทั่วประเทศ",
    "body_en": "The Golden Shower Tree (Ratchaphruek) is a medium deciduous tree (Fabaceae), native to South Asia — especially India, Sri Lanka, and Myanmar — growing 10–20 m tall. Produces spectacular pendant clusters of brilliant yellow flowers, 30–40 cm long, blooming simultaneously across Thailand in April–May (before monsoon rains). It is Thailand's national flower. Long cylindrical pods (30–60 cm) contain seeds embedded in sweet black pulp used as a mild laxative. Bark and roots are used in Ayurvedic medicine for fever, skin diseases, and digestive disorders. Yellow leaves fall before flowering; young leaves are eaten. Hard wood has general utility. Widely planted along Thai roadsides and parks.",
    "image": "/images/plants/golden-shower.jpg",
    "tags": [
      "Ornamental"
    ],
    "sources": [
      {
        "title": "Wikipedia - Cassia fistula",
        "url": "https://en.wikipedia.org/wiki/Cassia_fistula"
      }
    ],
    "featured": true,
    "published": true
  },
  {
    "id": "croton",
    "type": "plant",
    "name_th": "ต้นโกศล (ครอตัน)",
    "name_en": "Croton",
    "scientific_name": "Codiaeum variegatum",
    "status": null,
    "summary_th": "ไม้ประดับใบสีสันหลากหลาย มากกว่า 100 สายพันธุ์ ทนแดดได้ดี",
    "summary_en": "Boldly multicolored ornamental shrub with over 100 varieties; thrives in full sun",
    "body_th": "โกศล (Croton) เป็นไม้พุ่มถึงไม้ต้นเล็กในวงศ์ Euphorbiaceae สูง 1–3 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ หมู่เกาะโมลุกกะ และออสเตรเลีย ใบมีรูปร่างหลากหลาย ได้แก่ แบน วงรี หยักคลื่น ม้วนงอ และสีสันสดใสในใบเดียวกัน รวมถึง เขียว เหลือง ส้ม แดง ชมพู ม่วง และขาว ชอบแสงแดดจัด ยิ่งได้รับแสงมาก สีใบยิ่งเข้มและสวยงาม ปลูกง่าย ทนทาน นิยมใช้ตกแต่งสวน รั้ว และภายในอาคาร มีมากกว่า 100 สายพันธุ์ในตลาด น้ำยาง (Latex) มีสารพิษ ระคายเคืองต่อผิวหนัง และเป็นอันตรายต่อสัตว์เลี้ยงหากกิน ควรล้างมือหลังสัมผัส เป็นหนึ่งในไม้ประดับที่นิยมมากที่สุดในเขตร้อน",
    "body_en": "Croton (Codiaeum variegatum) is a colorful shrub or small tree (Euphorbiaceae), native to Southeast Asia, the Moluccas, and Australia, growing 1–3 m tall. Leaves come in diverse shapes (flat, oval, wavy, twisted) and a spectacular array of colors — green, yellow, orange, red, pink, purple, and white — often spectacularly multicolored on a single leaf. Requires full sun: more light equals richer, bolder colors. Easy to grow and hardy. Widely used in garden borders, hedges, and indoor decoration. Over 100 commercial varieties available. The milky latex is toxic — causes skin irritation and is dangerous to pets if ingested; wash hands after handling. One of the most popular ornamental plants in tropical regions.",
    "image": "/images/plants/croton.jpg",
    "tags": [
      "Ornamental"
    ],
    "sources": [
      {
        "title": "Wikipedia - Codiaeum variegatum",
        "url": "https://en.wikipedia.org/wiki/Codiaeum_variegatum"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "makok",
    "type": "plant",
    "name_th": "ต้นมะกอกป่า",
    "name_en": "Indian Hog Plum",
    "scientific_name": "Spondias pinnata",
    "status": null,
    "summary_th": "ผลไม้พื้นบ้านเปรี้ยว-ฝาด ใช้ทำส้มตำ แกง และดอง",
    "summary_en": "Tart-sour Southeast Asian fruit used in som tum, curries, and traditional pickles",
    "body_th": "มะกอกป่า (Indian Hog Plum) เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ Anacardiaceae สูง 15–25 เมตร มีถิ่นกำเนิดในเอเชียใต้และเอเชียตะวันออกเฉียงใต้ รวมถึงไทย ใบประกอบขนนก ออกดอกสีขาว-เหลืองเป็นช่อ ผลรูปไข่ ยาว 4–6 ซม. สีเขียว-เหลืองเมื่อสุก เนื้อสีเหลือง รสเปรี้ยว-ฝาดอมหวาน กลิ่นหอมเฉพาะตัว นิยมรับประทานสดกับน้ำพริก ทำส้มตำมะกอก แกงส้มมะกอก และน้ำดอง มีวิตามิน C สูง สรรพคุณทางยา ช่วยย่อยอาหาร แก้อาเจียน และบำรุงร่างกาย เปลือกต้มช่วยรักษาโรคผิวหนัง เนื้อไม้เบา ใช้ทำภาชนะและงานไม้ทั่วไป นิยมปลูกในสวนครัวและฟาร์มเพื่อบริโภค",
    "body_en": "Indian Hog Plum (Makok) is a medium-to-large tree (Anacardiaceae), native to South and Southeast Asia including Thailand, growing 15–25 m tall. Pinnate leaves; white-yellow flower clusters; oval fruits 4–6 cm, green-yellow when ripe, with yellow flesh that is sour-astringent-slightly sweet with a distinctive aroma. Eaten fresh with chili paste, in som tum (green papaya salad), sour curries, and pickles. High in vitamin C. Medicinally used to aid digestion, relieve nausea, and as a tonic; bark decoction treats skin conditions. The light wood is used for utensils and general woodwork. Widely grown in kitchen gardens and farms for domestic consumption.",
    "image": "/images/plants/makok.jpg",
    "tags": [
      "Fruit tree"
    ],
    "sources": [
      {
        "title": "Wikipedia - Spondias pinnata",
        "url": "https://en.wikipedia.org/wiki/Spondias_pinnata"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "daeng-xylia",
    "type": "plant",
    "name_th": "ต้นแดง",
    "name_en": "Xylia",
    "scientific_name": "Xylia xylocarpa",
    "status": null,
    "summary_th": "ไม้แข็งที่สุดชนิดหนึ่งในไทย หนักมาก ทนทานต่อน้ำและแมลงสูง",
    "summary_en": "One of Thailand's hardest and heaviest timbers; exceptional resistance to water and insects",
    "body_th": "ต้นแดงหรือ Xylia เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–25 เมตร มีถิ่นกำเนิดในป่าเบญจพรรณของไทย เมียนมา อินเดีย และเอเชียตะวันออกเฉียงใต้ ใบประกอบขนนก ออกดอกสีเหลืองเป็นช่อกลม ฝักแบน รูปเสี้ยวหนา เนื้อไม้สีแดง-น้ำตาลเข้ม หนักมาก แข็งแกร่งที่สุดในบรรดาไม้ไทย (Janka Hardness สูงมาก) ทนต่อน้ำ แมลง และความชื้นสูงมาก ในอดีตใช้ทำล้อเกวียน เพลาล้อ ไม้ฉาก คันไถ และงานโครงสร้างหนัก ปัจจุบันใช้ทำพื้นไม้คุณภาพสูง เฟอร์นิเจอร์ทนทาน ราวบันได และงานก่อสร้างพิเศษที่ต้องการความทนทานสูง เนื้อไม้มีคุณค่าทางเศรษฐกิจสูง ปลูกในโครงการป่าชุมชนและการปลูกป่าทดแทน",
    "body_en": "Xylia (Daeng) is a medium-to-large deciduous hardwood tree (Fabaceae), native to mixed deciduous forests of Thailand, Myanmar, India, and Southeast Asia, growing 15–25 m tall. Pinnate leaves; spherical yellow flower heads; flat thick crescent-shaped pods. The dark red-brown wood is exceptionally heavy and one of Thailand's hardest timbers (very high Janka hardness), with outstanding resistance to water, insects, and moisture. Historically used for cart wheels, axles, plows, and heavy structural work. Today used for premium flooring, heavy furniture, stair railings, and specialized construction requiring extreme durability. Economically valuable; planted in community forest and reforestation projects.",
    "image": "/images/plants/daeng.jpg",
    "tags": [
      "Hardwood"
    ],
    "sources": [
      {
        "title": "Wikipedia - Xylia xylocarpa",
        "url": "https://en.wikipedia.org/wiki/Xylia_xylocarpa"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "kratom",
    "type": "plant",
    "name_th": "ต้นกระท่อม",
    "name_en": "Kratom",
    "scientific_name": "Mitragyna speciosa",
    "status": null,
    "summary_th": "พืชพื้นถิ่นวงศ์กาแฟ กฎหมายไทยปลดล็อกปี 2564 อยู่ระหว่างศึกษาวิจัยทางการแพทย์",
    "summary_en": "Southeast Asian coffee-family plant; decriminalized in Thailand in 2021; under medical research",
    "body_th": "กระท่อมเป็นพืชในวงศ์กาแฟ (Rubiaceae) สูง 4–16 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ โดยเฉพาะไทย มาเลเซีย และอินโดนีเซีย ใบรูปไข่ขนาดใหญ่ 14–20 ซม. ออกดอกสีเหลืองเป็นช่อทรงกลม สารออกฤทธิ์หลักในใบ คือ Mitragynine และ 7-Hydroxymitragynine ซึ่งมีฤทธิ์ต่อตัวรับ Opioid ในสมอง ในปริมาณน้อยช่วยกระตุ้น ในปริมาณมากมีฤทธิ์สงบประสาท ใช้งานดั้งเดิมในชุมชนชนบทเพื่อบรรเทาอาการปวดและเพิ่มความอดทนในการทำงาน ประเทศไทยปลดล็อกกระท่อมออกจากบัญชียาเสพติดในปี พ.ศ. 2564 ปัจจุบันอยู่ระหว่างการศึกษาเพื่อใช้ประโยชน์ทางการแพทย์และพัฒนาเป็นสมุนไพรเศรษฐกิจ การค้าและการใช้งานมีข้อกำกับแตกต่างกันในแต่ละประเทศ",
    "body_en": "Kratom is a tropical tree in the coffee family (Rubiaceae), native to Southeast Asia — especially Thailand, Malaysia, and Indonesia — growing 4–16 m tall. Large oval leaves 14–20 cm; yellow globular flower clusters. Active leaf compounds — Mitragynine and 7-Hydroxymitragynine — act on opioid receptors: stimulating at low doses, sedating at high doses. Traditionally used in rural communities for pain relief and work endurance. Thailand decriminalized Kratom in 2021 (B.E. 2564); it is currently under research for medical applications and development as an economic herb. Trade and use regulations vary significantly by country — check local laws before any use.",
    "image": "/images/plants/kratom.jpg",
    "tags": [
      "Botanical"
    ],
    "sources": [
      {
        "title": "Wikipedia - Mitragyna speciosa",
        "url": "https://en.wikipedia.org/wiki/Mitragyna_speciosa"
      }
    ],
    "featured": false,
    "published": true
  },
  {
    "id": "flame-tree",
    "type": "plant",
    "name_th": "ต้นทองกวาว",
    "name_en": "Flame-of-the-forest",
    "scientific_name": "Butea monosperma",
    "status": null,
    "summary_th": "ดอกสีส้ม-แดงเด่น ออกดอกตอนผลัดใบ สีย้อมธรรมชาติ ยาอายุรเวท",
    "summary_en": "Brilliant orange-red flowers bloom on bare branches; natural dye source and Ayurvedic medicine",
    "body_th": "ทองกวาวเป็นไม้ยืนต้นขนาดกลางในวงศ์ถั่ว (Fabaceae) สูง 10–15 เมตร มีถิ่นกำเนิดในเอเชียใต้ ตั้งแต่อินเดีย เนปาล ไปจนถึงเอเชียตะวันออกเฉียงใต้รวมถึงไทย ออกดอกสีส้ม-แดงสดเป็นช่อขนาดใหญ่ในช่วงมกราคม-มีนาคม ขณะที่ต้นยังไม่มีใบหรือผลัดใบ ทำให้ดูโดดเด่นราวกับต้นไม้กำลังลุกไหม้ จึงได้ชื่อว่า Flame-of-the-forest ใบประกอบแบบขนนก ใบย่อย 3 ใบ รูปกลม-รี ฝักแบน ยาว 15–20 ซม. มีเมล็ดเดียว ดอกสีส้มใช้สกัดสีย้อมธรรมชาติสีเหลือง-ส้มสำหรับเทศกาลโฮลีในอินเดีย เปลือก ราก ดอก และเมล็ดมีสรรพคุณทางยาในตำราอายุรเวทและตำรายาไทย รักษาแผล ลดอาการอักเสบ และบำรุงร่างกาย เนื้อไม้เบา ใช้งานทั่วไป",
    "body_en": "Flame-of-the-forest (Thongkwao) is a medium deciduous tree (Fabaceae), native to South Asia from India and Nepal to Southeast Asia including Thailand, growing 10–15 m tall. Famous for its spectacular clusters of brilliant orange-red flowers that bloom January–March while the tree is entirely leafless — creating a dramatic flaming appearance that gives the tree its common name. Trifoliate pinnate leaves; flat pods 15–20 cm with a single seed. Orange flowers yield a yellow-orange natural dye used in India's Holi festival. Bark, roots, flowers, and seeds are used in Ayurvedic and Thai traditional medicine for wound healing, reducing inflammation, and as a tonic. Lightweight wood has general utility applications.",
    "image": "/images/plants/thongkwao.jpg",
    "tags": [
      "Ornamental"
    ],
    "sources": [
      {
        "title": "Wikipedia - Butea monosperma",
        "url": "https://en.wikipedia.org/wiki/Butea_monosperma"
      }
    ],
    "featured": false,
    "published": true
  }
];
