import type { Species } from "../types/species";

export const plants: Species[] = [
  {
    id: "teak",
    type: "plant",
    name_th: "ต้นสักทอง",
    name_en: "Teak",
    scientific_name: "Tectona grandis",
    short_description: "ราชาแห่งไม้เนื้อแข็ง เนื้อทนทาน ต้านน้ำและแมลงได้ตามธรรมชาติ",
    short_description_en: "King of tropical hardwoods; naturally oil-rich, water and insect resistant",
    description:
      "สักทองเป็นไม้เนื้อแข็งเขตร้อนในวงศ์ Lamiaceae มีถิ่นกำเนิดในเอเชียใต้และเอเชียตะวันออกเฉียงใต้ โดยเฉพาะอินเดีย เมียนมา ลาว และไทย เป็นต้นไม้ขนาดใหญ่ สูง 25–40 เมตร ลำต้นตรง เส้นผ่านศูนย์กลางถึง 150 ซม. ใบใหญ่รูปรีถึงรูปไข่ ขนาด 30–60 ซม. ร่วงใบในฤดูแล้ง ออกดอกสีขาวเป็นช่อช่วงมิถุนายน–ตุลาคม เนื้อไม้สีเหลือง-ทอง มีน้ำมันธรรมชาติทำให้ทนน้ำ แมลง และสภาพอากาศ อายุตัดฟัน 30–80 ปีขึ้นไป นิยมใช้ทำเรือ เฟอร์นิเจอร์หรู พื้น และงานสถาปัตยกรรม ราคาสูงในตลาดโลก ปัจจุบันรัฐบาลไทยควบคุมการตัดและการค้าไม้สักอย่างเข้มงวด สถานะ IUCN: Least Concern",
    description_en:
      "Teak is a large tropical hardwood tree (Lamiaceae), native to South and Southeast Asia — particularly India, Myanmar, Laos, and Thailand. Trees grow 25–40 m tall with trunk diameters up to 150 cm. Large elliptic-ovate leaves 30–60 cm, deciduous in dry season. White flowers in clusters bloom June–October. The golden-yellow wood contains natural oils that resist water, insects, and weathering — making it one of the world's most prized timbers. Harvested after 30–80+ years; used in shipbuilding, luxury furniture, flooring, and architecture. Strictly regulated by Thai law. IUCN: Least Concern.",
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
    short_description: "ไม้เนื้อแข็งสีน้ำตาล-แดง ดอกเหลืองหอม ใช้ทำเฟอร์นิเจอร์หรู",
    short_description_en: "Fragrant-flowered hardwood valued for luxury furniture and musical instruments",
    description:
      "ประดู่ป่าเป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–30 เมตร พบในป่าเบญจพรรณและป่าดิบแล้งทั่วเอเชียตะวันออกเฉียงใต้ รวมถึงไทย เมียนมา และลาว ใบประกอบแบบขนนก ออกดอกสีเหลืองหอมเป็นช่อ ฝักกลม-แผ่นมีปีก เนื้อไม้สีน้ำตาล-แดง เนื้อหยาบ มีลวดลายสวยงาม ความแข็งแรงสูง ทนทานต่อการผุพัง นิยมใช้ทำเฟอร์นิเจอร์หรู เครื่องดนตรี พื้น และงานแกะสลัก เนื้อไม้มีน้ำมันหอมระเหยมีสรรพคุณทางยา ใบและเปลือกใช้ในภูมิปัญญาพื้นบ้านเพื่อรักษาโรคผิวหนังและอักเสบ มีคุณค่าสูงในตลาดส่งออก บางพื้นที่ประชากรลดลงจากการตัดไม้เกินขนาด",
    description_en:
      "Burmese Rosewood is a medium-to-large legume tree (Fabaceae), 15–30 m tall, found in mixed deciduous and dry evergreen forests across Southeast Asia including Thailand, Myanmar, and Laos. Pinnate leaves; fragrant yellow flowers in clusters; round winged pods. The brown-red wood is coarse-grained, beautifully figured, hard, and durable. Widely used for luxury furniture, musical instruments, flooring, and carving. The wood contains aromatic essential oils with medicinal properties; leaves and bark are used in folk medicine for skin conditions and inflammation. Highly valued for export; populations declining in some areas due to over-logging.",
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
    short_description: "ไม้หวงห้ามสูงสุด เนื้อสีม่วง-แดง ราคาสูงที่สุดในบรรดาไม้เนื้อแข็งเอเชีย",
    short_description_en: "Asia's most valuable rosewood; protected by CITES and Thai law due to illegal logging",
    description:
      "พะยูงเป็นไม้ในสกุล Dalbergia วงศ์ถั่ว (Fabaceae) มีถิ่นกำเนิดในไทย กัมพูชา เวียดนาม และลาว สูง 10–25 เมตร เนื้อไม้สีม่วง-น้ำตาลแดง ลวดลายสวยงาม เนื้อละเอียด แข็งแกร่งและทนทานมาก ราคาสูงที่สุดในบรรดาไม้เนื้อแข็งของเอเชีย บางครั้งเรียก \"ไม้โรสวู้ดไทย\" หรือ \"พะยูงไทย\" นิยมใช้ทำเฟอร์นิเจอร์หรูส่งออกจีน เครื่องดนตรีชั้นดี (ลูกบิดกีต้าร์ วิโอลิน) และงานแกะสลักประณีต การลักลอบตัดและค้าเพื่อส่งออกทำให้ใกล้สูญพันธุ์ในธรรมชาติ อยู่ใน CITES Appendix II และจัดเป็นไม้หวงห้ามพิเศษตาม พ.ร.บ. ป่าไม้ของไทย สถานะ IUCN: Endangered",
    description_en:
      "Siamese Rosewood is a Dalbergia species (Fabaceae) native to Thailand, Cambodia, Vietnam, and Laos, growing 10–25 m tall. Its purple-red to dark brown wood has beautiful fine grain, exceptional hardness, and outstanding durability — the most valuable hardwood in Asia, known as 'Thai Rosewood.' Prized for luxury furniture exported to China, fine musical instruments (guitar tuning pegs, violins), and intricate carving. Intense illegal logging and smuggling has driven it to near-extinction in the wild. Listed on CITES Appendix II and as a specially protected timber under Thai forestry law. IUCN: Endangered.",
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
    short_description: "ไม้ในวงศ์ยาง ดอกหอม นิยมปลูกตามวัดและถนน",
    short_description_en: "Fragrant-flowered Dipterocarp tree planted at temples and roadsides across Southeast Asia",
    description:
      "พยอมเป็นไม้ยืนต้นขนาดใหญ่ในวงศ์ยาง (Dipterocarpaceae) สูง 20–35 เมตร พบในป่าเบญจพรรณและป่าดิบแล้งของไทย อินเดีย และเอเชียตะวันออกเฉียงใต้ ใบรูปหอก-รูปไข่ ออกดอกสีขาวหรือครีมหอมหวานเป็นช่อ กลีบเลี้ยงขยายเป็นปีก 5 ปีกช่วยให้เมล็ดร่อนในอากาศ นิยมปลูกเป็นไม้ประดับในวัดและถนนทั่วไทย เนื้อไม้สีขาว-ครีม ใช้ก่อสร้าง กล่องไม้ และกระดาษ น้ำยางมีสรรพคุณทางยา ดอกมีกลิ่นหอมหวานใช้บูชาพระ มีบทบาทสำคัญในระบบนิเวศป่าเป็นอาหารของสัตว์ป่าหลากชนิด สถานะ IUCN: Vulnerable เนื่องจากการสูญเสียป่าอย่างต่อเนื่อง",
    description_en:
      "Payom (White Meranti) is a large Dipterocarpaceae tree, 20–35 m tall, found in mixed deciduous and dry evergreen forests of Thailand, India, and Southeast Asia. Lance-ovate leaves; fragrant white or cream flower clusters; 5-winged sepals help seeds disperse by wind. Planted as an ornamental in temple grounds and along roadsides throughout Thailand. White-cream wood used in construction, crates, and paper. The resin has medicinal uses; fragrant flowers are offered in Buddhist ceremonies. Important ecologically as a food source for diverse wildlife. IUCN: Vulnerable due to ongoing forest loss.",
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
    short_description: "ไม้ยืนต้นขนาดใหญ่ วงศ์ยาง เนื้อแข็งมาก มีตำนานสิ่งศักดิ์สิทธิ์",
    short_description_en: "Giant Dipterocarp with very hard water-resistant timber and rich Thai spiritual folklore",
    description:
      "ตะเคียนทองเป็นไม้ยืนต้นขนาดใหญ่ในวงศ์ยาง (Dipterocarpaceae) สูง 30–45 เมตร เส้นผ่านศูนย์กลางลำต้นถึง 200 ซม. พบในป่าดิบชื้นและป่าดิบแล้งทั่วเอเชียตะวันออกเฉียงใต้ ใบเดี่ยวเรียงสลับ รูปรีถึงรูปไข่ ปลายแหลม ออกดอกสีขาว-เหลืองอ่อน เนื้อไม้สีน้ำตาล-แดง แข็งมาก ทนต่อแมลงและความชื้น เหมาะสร้างสะพาน เรือ รางน้ำ และงานก่อสร้างกลางแจ้ง น้ำมันยางใช้ทาไม้ป้องกันแมลง ในวัฒนธรรมไทยเชื่อว่ามีสิ่งศักดิ์สิทธิ์ (นางไม้) สิงอยู่ มักปรากฏในนิทานพื้นบ้านและละครไทย ห้ามตัดโดยไม่ขออนุญาตและไม่ทำพิธีกรรม สถานะ IUCN: Vulnerable",
    description_en:
      "Takhian (Hopea odorata) is a massive Dipterocarpaceae tree, 30–45 m tall with trunk diameters up to 200 cm, found in tropical rainforests across Southeast Asia. Alternate elliptic-ovate leaves with pointed tips; white-pale yellow flowers. The brown-red wood is very hard, resistant to insects and moisture — ideal for bridges, boats, water troughs, and outdoor construction. Resin is used as a wood preservative. In Thai culture, the tree is believed to be home to spirits (Nang Mai) and features prominently in folk tales and classical Thai drama; cutting requires formal permission and ritual. IUCN: Vulnerable.",
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
    short_description: "ไม้เนื้อแข็งสกุล Dalbergia เนื้อสีม่วง-แดง ใกล้เคียงพะยูง อยู่ใน CITES",
    short_description_en: "CITES-listed Dalbergia hardwood with purple-red grain; used in fine furniture and instruments",
    description:
      "ชิงชันเป็นไม้ยืนต้นในสกุล Dalbergia วงศ์ถั่ว (Fabaceae) สูง 15–25 เมตร พบในป่าเบญจพรรณและป่าผลัดใบของเมียนมา ลาว กัมพูชา และไทย ใบประกอบขนนก ออกดอกสีขาว เนื้อไม้สีม่วงอ่อน-น้ำตาลแดง มีลวดลายสวย ลักษณะคล้ายพะยูง แต่สีอ่อนกว่าเล็กน้อย เนื้อแน่น แข็งแกร่ง ทนทาน ใช้ทำเฟอร์นิเจอร์หรู ของตกแต่งบ้าน เครื่องดนตรี และงานแกะสลักประดับ มีคุณค่าสูงในตลาด ถูกลักลอบค้าร่วมกับพะยูง จัดอยู่ใน CITES Appendix II เพื่อควบคุมการค้าระหว่างประเทศ สถานะ IUCN: Endangered",
    description_en:
      "Chingchan is a Dalbergia tree (Fabaceae), 15–25 m tall, in mixed deciduous and dry forests of Myanmar, Laos, Cambodia, and Thailand. Pinnate leaves; white flowers. Purple-light to reddish-brown wood with attractive grain, similar to Siamese Rosewood but somewhat lighter in color. Dense, strong, and durable. Used for luxury furniture, home décor, musical instruments, and decorative carving. Highly valuable commercially; often trafficked alongside Siamese Rosewood. Listed on CITES Appendix II to regulate international trade. IUCN: Endangered.",
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
    short_description: "ต้นไม้ยักษ์วงศ์ยาง สูงถึง 50 เมตร น้ำมันยางมีประโยชน์หลากหลาย",
    short_description_en: "Giant Dipterocarp reaching 50 m; resin used for wood treatment and traditional medicine",
    description:
      "ยางนาเป็นไม้ยืนต้นขนาดใหญ่มากในวงศ์ยาง (Dipterocarpaceae) สูง 30–50 เมตร บางครั้งถึง 60 เมตร เส้นผ่านศูนย์กลางลำต้น 100–200 ซม. พบในป่าดิบชื้นของไทย ลาว กัมพูชา และเวียดนาม ใบเดี่ยวขนาดใหญ่ รูปรี ออกดอกสีชมพู-ขาว มีกลีบเลี้ยงขยายเป็นปีก 2 ปีกยาวช่วยให้เมล็ดร่อนไกล เนื้อไม้สีน้ำตาลแดง แข็งแรง ใช้ก่อสร้างและต่อเรือ น้ำมันยาง (Yang Oil) ใช้ทาไม้ ผสมสี และรักษาโรคผิวหนังในตำรายาพื้นบ้าน เป็นต้นไม้ให้ร่มเงาขนาดใหญ่ นิยมปลูกริมถนนและในวัด มีบทบาทสำคัญในระบบนิเวศ สถานะ IUCN: Critically Endangered เนื่องจากการตัดไม้ทำลายป่าและการขยายพื้นที่เกษตรกรรม",
    description_en:
      "Yang Na (Dipterocarpus alatus) is one of Southeast Asia's largest trees, reaching 30–60 m height with trunk diameters of 100–200 cm. Found in tropical rainforests of Thailand, Laos, Cambodia, and Vietnam. Large elliptic leaves; pink-white flowers with 2 long winged sepals that help seeds glide long distances. Brown-red timber used in construction and boat-building. Yang oil (resin) is used for wood treatment, paint, and skin conditions in folk medicine. Provides extensive shade; planted along roadsides and in temples. Ecologically critical. IUCN: Critically Endangered due to deforestation and agricultural expansion.",
    image: "/images/plants/yang-na.jpg",
    tags: ["Large tree", "Resin"],
    references: [
      { title: "Wikipedia - Dipterocarpus alatus", url: "https://en.wikipedia.org/wiki/Dipterocarpus_alatus" }
    ]
  },
  {
    id: "bamboo",
    type: "plant",
    name_th: "ไผ่",
    name_en: "Bamboo",
    scientific_name: "Bambusoideae",
    short_description: "พืชหญ้ายักษ์ เติบโตเร็วที่สุดในโลก ประโยชน์หลากหลายตั้งแต่อาหารถึงก่อสร้าง",
    short_description_en: "World's fastest-growing plant; versatile grass used in food, construction, and crafts",
    description:
      "ไผ่เป็นพืชในอนุวงศ์ Bambusoideae วงศ์ Poaceae (หญ้า) มีมากกว่า 1,400 ชนิดทั่วโลก พบมากในเอเชีย อเมริกาใต้ และแอฟริกา สายพันธุ์มีขนาดหลากหลาย ตั้งแต่เล็กไม่กี่ซม. ไปถึงยักษ์อย่าง Dendrocalamus giganteus สูงกว่า 30 เมตร ไผ่เติบโตเร็วที่สุดในโลก บางชนิดสูงได้ถึง 91 ซม./วัน ลำต้นเป็นปล้องกลวง แข็งแรง ทนแรงดึงสูง ใช้ประโยชน์หลากหลาย ได้แก่ งานก่อสร้างและนั่งร้าน งานจักสานหัตถกรรม หน่อไม้เป็นอาหาร กระดาษ เฟอร์นิเจอร์ พื้น เครื่องดนตรี ถ่านไผ่ และวัสดุคอมโพสิต ช่วยป้องกันการพังทลายของดินริมฝั่งน้ำ ดูดซับคาร์บอนไดออกไซด์สูง เป็นอาหารหลักของแพนด้ายักษ์ และเป็นสัตว์ขนาดเล็กจำนวนมากอาศัย",
    description_en:
      "Bamboo belongs to subfamily Bambusoideae (Poaceae, true grasses), with over 1,400 species worldwide — abundant in Asia, South America, and Africa. Sizes range from small ornamentals to giants like Dendrocalamus giganteus exceeding 30 m. The world's fastest-growing plants, with some species growing up to 91 cm per day. Hollow, segmented culms are strong with high tensile strength. Uses: construction scaffolding, basketry and handicrafts, food (bamboo shoots), paper, furniture, flooring, musical instruments, charcoal, and composite materials. Ecologically important for riverbank erosion control, high CO₂ absorption, giant panda diet, and small animal habitat.",
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
    short_description: "ไม้ดอกม่วง-ชมพูสวยงาม นิยมปลูกประดับวัดและถนนในไทย",
    short_description_en: "Beautiful purple-pink flowering tree popular in Thai temple and roadside planting",
    description:
      "เสลาเป็นไม้ดอกยืนต้นขนาดกลางในสกุล Lagerstroemia วงศ์ Lythraceae สูง 10–20 เมตร มีถิ่นกำเนิดในไทย ลาว และกัมพูชา ออกดอกสีม่วง-ชมพูสดสวยงามเป็นช่อขนาดใหญ่ กลีบดอกย่นคล้ายกระดาษ มักออกดอกปีละ 2–3 ครั้ง เปลือกต้นเรียบสีน้ำตาล-เทา ลอกออกเป็นแผ่นบาง ใบรูปรีถึงรูปไข่ ผลัดใบในฤดูแล้ง นิยมปลูกเป็นไม้ประดับตามริมถนน สวนสาธารณะ และวัด เนื้อไม้แข็งแรง ใช้ก่อสร้างและทำเครื่องมือ เปลือกและใบมีสรรพคุณทางยา ใช้ในตำรายาสมุนไพรพื้นบ้านช่วยลดน้ำตาลในเลือด ปลูกง่าย ทนแล้งได้พอสมควร ต้านทานโรคดี เหมาะสำหรับงานจัดสวนในเขตร้อน",
    description_en:
      "Salao is a medium deciduous flowering tree (Lythraceae), native to Thailand, Laos, and Cambodia, growing 10–20 m tall. Produces large, showy clusters of crinkled purple-pink flowers (resembling crepe paper) 2–3 times per year. Smooth gray-brown exfoliating bark; elliptic-ovate leaves, deciduous in dry season. Widely planted as an ornamental along roadsides, in parks, and temple grounds. Durable hardwood used in construction and tool-making. Bark and leaves are used in traditional herbal medicine, notably for blood sugar regulation. Easy to grow, moderately drought-tolerant, and disease-resistant — popular in tropical landscaping.",
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
    short_description: "ไม้ประจำชาติฟิลิปปินส์ ดอกเหลืองหอม น้ำยางสีแดงมีประโยชน์ทางยา",
    short_description_en: "Philippines' national tree; fragrant yellow flowers; red resin used medicinally",
    description:
      "ประดู่แดง (Narra) เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–30 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ ตั้งแต่ฟิลิปปินส์ อินโดนีเซีย มาเลเซีย ไปจนถึงไทยและเมียนมา ออกดอกสีเหลืองหอมหวาน เปลือกแตกเป็นร่องตื้น มีน้ำยางสีแดงชาดออกเมื่อถูกตัด ใช้เป็นสีและยา เนื้อไม้สีแดง-น้ำตาล มีลวดลายสวย แข็งแรง ทนทาน นิยมใช้ทำเฟอร์นิเจอร์ พื้น และของตกแต่ง ปลูกเป็นร่มเงาตามถนนเนื่องจากเรือนยอดกว้าง เป็นต้นไม้ประจำชาติฟิลิปปินส์ เปลือกและรากมีสรรพคุณทางยาพื้นบ้าน รักษาแผลและโรคผิวหนัง สถานะ IUCN: Vulnerable",
    description_en:
      "Narra (Red Paduak) is a medium-to-large Fabaceae tree, 15–30 m tall, native to Southeast Asia from the Philippines, Indonesia, and Malaysia to Thailand and Myanmar. Produces fragrant yellow flowers; furrowed bark exudes red-crimson resin used as dye and medicine. The red-brown wood is attractively grained, strong, and durable — widely used for furniture, flooring, and decorative items. Broad canopy makes it ideal for roadside shade planting. The national tree of the Philippines. Bark and roots have traditional medicinal uses for wounds and skin conditions. IUCN: Vulnerable.",
    image: "/images/plants/red-padau.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Pterocarpus indicus", url: "https://en.wikipedia.org/wiki/Pterocarpus_indicus" }
    ]
  },
  {
    id: "pak-wan-pa",
    type: "plant",
    name_th: "ต้นผักหวานป่า",
    name_en: "Pak Wan Pa (Sweet Leaf Tree)",
    scientific_name: "Melientha suavis",
    short_description: "พืชยอดอ่อนหวาน โปรตีนสูง ราคาดีในตลาด อาหารไทยแท้",
    short_description_en: "High-protein sweet forest vegetable prized in Thai cuisine and local markets",
    description:
      "ผักหวานป่าเป็นพืชยืนต้นในวงศ์ Opiliaceae สูง 5–15 เมตร มีถิ่นกำเนิดในป่าผลัดใบของไทยและเอเชียตะวันออกเฉียงใต้ ยอดอ่อนและใบอ่อนมีรสหวานอมขมเล็กน้อย อุดมด้วยโปรตีน (สูงกว่าผักทั่วไป 3–4 เท่า) วิตามิน B และ C แคลเซียม และธาตุเหล็ก นิยมใช้ปรุงอาหารไทยหลากหลาย เช่น แกงผักหวาน ต้มผักหวาน และผัดผักหวาน ออกดอกเล็กสีขาว-เหลือง ดอกและผลกินได้ ผลสุกสีส้มแดง รสหวาน ราคาในตลาดค่อนข้างสูง (200–400 บาท/กก.) นิยมเพาะปลูกในสวนและฟาร์ม เติบโตช้าแต่ดูแลง่าย ทนแล้ง ให้ผลผลิตนานหลายสิบปี",
    description_en:
      "Pak Wan Pa (Sweet Leaf Tree) is a forest tree in the Opiliaceae family, growing 5–15 m tall in deciduous forests of Thailand and Southeast Asia. Young shoots and tender leaves have a pleasantly sweet-slightly-bitter flavor and are exceptionally rich in protein (3–4× more than common vegetables), vitamins B and C, calcium, and iron. Popular in Thai cuisine: used in curries, soups, and stir-fries. Small white-yellow flowers; edible orange-red fruits when ripe. Commands premium market prices (200–400 THB/kg). Increasingly cultivated in gardens and farms — slow-growing but easy to care for, drought-tolerant, and productive for decades.",
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
    short_description: "ส้มผลใหญ่ที่สุดในโลก วิตามิน C สูง มีหลายสายพันธุ์ดังในไทย",
    short_description_en: "World's largest citrus fruit; high in vitamin C with many celebrated Thai varieties",
    description:
      "ส้มโอเป็นไม้ผลเขตร้อนในสกุล Citrus วงศ์ Rutaceae มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ สูง 5–15 เมตร ผลมีขนาดใหญ่ที่สุดในตระกูลส้ม เส้นผ่านศูนย์กลาง 15–25 ซม. น้ำหนัก 1–2 กก. เปลือกหนา สีเหลือง-เขียว เนื้อมีทั้งสีขาว เหลือง ชมพู และแดงทับทิมตามสายพันธุ์ รสหวาน-เปรี้ยว กลิ่นหอม มีวิตามิน C สูง เส้นใยอาหารมาก และสารต้านอนุมูลอิสระ ในไทยมีสายพันธุ์ชื่อดัง เช่น ส้มโอขาวใหญ่ ทองดี ขาวน้ำผึ้ง และแดงใหญ่ ออกดอกสีขาวหอมช่วงมกราคม-มีนาคม เก็บเกี่ยวในช่วงสิงหาคม-ธันวาคม ใช้บริโภคสด ทำน้ำผลไม้ ยำส้มโอ และเป็นของขวัญในเทศกาลสำคัญ มีประวัติการปลูกในไทยมากกว่า 300 ปี",
    description_en:
      "Pomelo is a tropical citrus tree (Rutaceae), native to Southeast Asia, growing 5–15 m tall. Its fruit is the largest of all citrus, 15–25 cm diameter, 1–2 kg, with thick peel and juicy flesh that varies by variety: white, yellow, pink, or ruby-red. Sweet-tart flavor with a pleasant aroma; high in vitamin C, dietary fiber, and antioxidants. Thailand's celebrated varieties include Khao Yai, Thong Dee, Khao Nam Phueng, and Daeng Yai. White fragrant flowers bloom January–March; harvest August–December. Eaten fresh, juiced, used in salads (yam som oh), and exchanged as gifts during festivals. Cultivated in Thailand for over 300 years.",
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
    short_description: "ไม้ผลวิตามิน C สูง ปลูกง่าย ทนแล้ง ออกผลเกือบตลอดปี",
    short_description_en: "Vitamin C-rich tropical fruit; easy to grow, drought-tolerant, and nearly year-round bearing",
    description:
      "ฝรั่งเป็นไม้ผลเขตร้อนในวงศ์ Myrtaceae สูง 5–10 เมตร มีถิ่นกำเนิดในอเมริกากลางและอเมริกาใต้ ปัจจุบันปลูกทั่วโลกในเขตร้อน เติบโตเร็ว ทนแล้ง ปลูกง่าย ผลกลม-รีหรือแบน เปลือกสีเขียว-เหลือง เนื้อสีขาว ชมพู หรือแดง รสหวาน-เปรี้ยว กลิ่นหอม มีวิตามิน C สูงมากเป็น 4 เท่าของส้ม มีวิตามิน A เส้นใยอาหาร โพแทสเซียม และสารต้านอนุมูลอิสระ ใบต้มดื่มช่วยแก้ท้องเสียและควบคุมระดับน้ำตาลในเลือด ออกผลเกือบตลอดปี ใช้บริโภคสดและแปรรูปเป็นน้ำฝรั่ง แยม เจลลี่ และโยเกิร์ต สายพันธุ์ที่นิยมในไทย เช่น ฝรั่งกลมสาลี่ ฝรั่งไร้เมล็ด และฝรั่งกิมจู",
    description_en:
      "Guava is a fast-growing tropical fruit tree (Myrtaceae), native to Central and South America, now cultivated worldwide in tropical regions. Grows 5–10 m tall; drought-tolerant and easy to cultivate. Round-oval fruit with green-yellow skin; flesh is white, pink, or red. Sweet-tart flavor with a distinctive aroma. Exceptionally high in vitamin C (4× more than oranges), vitamin A, dietary fiber, potassium, and antioxidants. Leaf tea is used medicinally for diarrhea and blood sugar control. Fruits nearly year-round. Eaten fresh or processed into juice, jam, jelly, and yogurt. Popular Thai varieties include Kluay Salee, seedless guava, and Kim Ju.",
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
    short_description: "พืชตระกูลส้ม วิตามิน C สูง หัวใจของอาหารไทยและเครื่องดื่ม",
    short_description_en: "Essential souring agent in Thai cuisine; rich in vitamin C and aromatic oils",
    description:
      "มะนาวเป็นไม้ผลพุ่มเล็กถึงต้นขนาดกลาง ในสกุล Citrus วงศ์ Rutaceae สูง 3–6 เมตร มีถิ่นกำเนิดในเอเชียใต้-ตะวันออกเฉียงใต้ ออกดอกสีขาวหรือชมพูอ่อน หอม ผลกลมเล็ก เส้นผ่านศูนย์กลาง 3–5 ซม. เปลือกสีเขียว-เหลือง เนื้อสีเหลือง-เขียว รสเปรี้ยวจัด กลิ่นหอมเฉพาะ มีวิตามิน C และสารต้านอนุมูลอิสระสูง ใช้ปรุงรสอาหารไทยทุกประเภท ทั้งยำ น้ำพริก ต้มยำ แกงส้ม และเครื่องดื่ม น้ำมันจากเปลือกมะนาวใช้ในอุตสาหกรรมเครื่องสำอาง ยา และอาหาร ในไทยนิยมปลูกเชิงการค้าหลายสายพันธุ์ เช่น มะนาวแป้น (Round lime) และสายพันธุ์หนัง ออกผลเกือบตลอดปี ชนิดที่พบในตลาดไทยส่วนใหญ่คือ Citrus aurantiifolia ซึ่งมีรสเปรี้ยวกว่า Persian lime",
    description_en:
      "Key Lime is a small-to-medium citrus shrub or tree (Rutaceae), native to South-Southeast Asia, growing 3–6 m tall. White or pale pink fragrant flowers; small round fruits 3–5 cm diameter with green-yellow skin and intensely tart yellow-green juice; distinctive aromatic fragrance. High in vitamin C and antioxidants. Indispensable in Thai cuisine for seasoning salads (yam), chili pastes, tom yum, sour curries, and beverages. Peel oil is used in the cosmetic, pharmaceutical, and food industries. Commercially grown in Thailand in Round Lime and thick-skinned varieties; fruits nearly year-round. The Thai lime is more tart than Persian limes found in Western markets.",
    image: "/images/plants/lime.jpg",
    tags: ["Fruit tree"],
    references: [
      { title: "Wikipedia - Key Lime", url: "https://en.wikipedia.org/wiki/Key_lime" }
    ]
  },
  {
    id: "golden-shower",
    type: "plant",
    name_th: "ต้นคูน (ราชพฤกษ์)",
    name_en: "Golden Shower Tree",
    scientific_name: "Cassia fistula",
    short_description: "ดอกไม้ประจำชาติไทย ช่อเหลืองทองสวยงาม ออกดอกพร้อมกันทั่วประเทศ",
    short_description_en: "Thailand's national flower; spectacular golden yellow blooms signaling the start of Thai summer",
    description:
      "คูนหรือราชพฤกษ์เป็นไม้ยืนต้นขนาดกลางในวงศ์ถั่ว (Fabaceae) สูง 10–20 เมตร มีถิ่นกำเนิดในเอเชียใต้ โดยเฉพาะอินเดีย ศรีลังกา และเมียนมา ออกดอกสีเหลืองทองเป็นช่อห้อยยาว 30–40 ซม. สวยงามตระการตา ออกดอกพร้อมกันทั่วไทยช่วงเมษายน-พฤษภาคม ก่อนฝนตก ดอกไม้ประจำชาติไทย ฝักกลม-ยาว 30–60 ซม. มีเมล็ดหลายเมล็ด เนื้อในฝักสีดำหวาน ใช้เป็นยาระบายอ่อนๆ เปลือกและรากใช้ในตำรายาอายุรเวทเพื่อรักษาไข้ โรคผิวหนัง และระบบย่อยอาหาร ใบสีเหลืองหล่นก่อนออกดอก ใบอ่อนใช้ทำอาหาร เนื้อไม้แข็งใช้งานทั่วไป นิยมปลูกตามถนนและสวนสาธารณะทั่วประเทศ",
    description_en:
      "The Golden Shower Tree (Ratchaphruek) is a medium deciduous tree (Fabaceae), native to South Asia — especially India, Sri Lanka, and Myanmar — growing 10–20 m tall. Produces spectacular pendant clusters of brilliant yellow flowers, 30–40 cm long, blooming simultaneously across Thailand in April–May (before monsoon rains). It is Thailand's national flower. Long cylindrical pods (30–60 cm) contain seeds embedded in sweet black pulp used as a mild laxative. Bark and roots are used in Ayurvedic medicine for fever, skin diseases, and digestive disorders. Yellow leaves fall before flowering; young leaves are eaten. Hard wood has general utility. Widely planted along Thai roadsides and parks.",
    image: "/images/plants/golden-shower.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Cassia fistula", url: "https://en.wikipedia.org/wiki/Cassia_fistula" }
    ]
  },
  {
    id: "croton",
    type: "plant",
    name_th: "ต้นโกศล (ครอตัน)",
    name_en: "Croton",
    scientific_name: "Codiaeum variegatum",
    short_description: "ไม้ประดับใบสีสันหลากหลาย มากกว่า 100 สายพันธุ์ ทนแดดได้ดี",
    short_description_en: "Boldly multicolored ornamental shrub with over 100 varieties; thrives in full sun",
    description:
      "โกศล (Croton) เป็นไม้พุ่มถึงไม้ต้นเล็กในวงศ์ Euphorbiaceae สูง 1–3 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ หมู่เกาะโมลุกกะ และออสเตรเลีย ใบมีรูปร่างหลากหลาย ได้แก่ แบน วงรี หยักคลื่น ม้วนงอ และสีสันสดใสในใบเดียวกัน รวมถึง เขียว เหลือง ส้ม แดง ชมพู ม่วง และขาว ชอบแสงแดดจัด ยิ่งได้รับแสงมาก สีใบยิ่งเข้มและสวยงาม ปลูกง่าย ทนทาน นิยมใช้ตกแต่งสวน รั้ว และภายในอาคาร มีมากกว่า 100 สายพันธุ์ในตลาด น้ำยาง (Latex) มีสารพิษ ระคายเคืองต่อผิวหนัง และเป็นอันตรายต่อสัตว์เลี้ยงหากกิน ควรล้างมือหลังสัมผัส เป็นหนึ่งในไม้ประดับที่นิยมมากที่สุดในเขตร้อน",
    description_en:
      "Croton (Codiaeum variegatum) is a colorful shrub or small tree (Euphorbiaceae), native to Southeast Asia, the Moluccas, and Australia, growing 1–3 m tall. Leaves come in diverse shapes (flat, oval, wavy, twisted) and a spectacular array of colors — green, yellow, orange, red, pink, purple, and white — often spectacularly multicolored on a single leaf. Requires full sun: more light equals richer, bolder colors. Easy to grow and hardy. Widely used in garden borders, hedges, and indoor decoration. Over 100 commercial varieties available. The milky latex is toxic — causes skin irritation and is dangerous to pets if ingested; wash hands after handling. One of the most popular ornamental plants in tropical regions.",
    image: "/images/plants/croton.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Codiaeum variegatum", url: "https://en.wikipedia.org/wiki/Codiaeum_variegatum" }
    ]
  },
  {
    id: "makok",
    type: "plant",
    name_th: "ต้นมะกอกป่า",
    name_en: "Indian Hog Plum",
    scientific_name: "Spondias pinnata",
    short_description: "ผลไม้พื้นบ้านเปรี้ยว-ฝาด ใช้ทำส้มตำ แกง และดอง",
    short_description_en: "Tart-sour Southeast Asian fruit used in som tum, curries, and traditional pickles",
    description:
      "มะกอกป่า (Indian Hog Plum) เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ Anacardiaceae สูง 15–25 เมตร มีถิ่นกำเนิดในเอเชียใต้และเอเชียตะวันออกเฉียงใต้ รวมถึงไทย ใบประกอบขนนก ออกดอกสีขาว-เหลืองเป็นช่อ ผลรูปไข่ ยาว 4–6 ซม. สีเขียว-เหลืองเมื่อสุก เนื้อสีเหลือง รสเปรี้ยว-ฝาดอมหวาน กลิ่นหอมเฉพาะตัว นิยมรับประทานสดกับน้ำพริก ทำส้มตำมะกอก แกงส้มมะกอก และน้ำดอง มีวิตามิน C สูง สรรพคุณทางยา ช่วยย่อยอาหาร แก้อาเจียน และบำรุงร่างกาย เปลือกต้มช่วยรักษาโรคผิวหนัง เนื้อไม้เบา ใช้ทำภาชนะและงานไม้ทั่วไป นิยมปลูกในสวนครัวและฟาร์มเพื่อบริโภค",
    description_en:
      "Indian Hog Plum (Makok) is a medium-to-large tree (Anacardiaceae), native to South and Southeast Asia including Thailand, growing 15–25 m tall. Pinnate leaves; white-yellow flower clusters; oval fruits 4–6 cm, green-yellow when ripe, with yellow flesh that is sour-astringent-slightly sweet with a distinctive aroma. Eaten fresh with chili paste, in som tum (green papaya salad), sour curries, and pickles. High in vitamin C. Medicinally used to aid digestion, relieve nausea, and as a tonic; bark decoction treats skin conditions. The light wood is used for utensils and general woodwork. Widely grown in kitchen gardens and farms for domestic consumption.",
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
    short_description: "ไม้แข็งที่สุดชนิดหนึ่งในไทย หนักมาก ทนทานต่อน้ำและแมลงสูง",
    short_description_en: "One of Thailand's hardest and heaviest timbers; exceptional resistance to water and insects",
    description:
      "ต้นแดงหรือ Xylia เป็นไม้ยืนต้นขนาดกลางถึงใหญ่ในวงศ์ถั่ว (Fabaceae) สูง 15–25 เมตร มีถิ่นกำเนิดในป่าเบญจพรรณของไทย เมียนมา อินเดีย และเอเชียตะวันออกเฉียงใต้ ใบประกอบขนนก ออกดอกสีเหลืองเป็นช่อกลม ฝักแบน รูปเสี้ยวหนา เนื้อไม้สีแดง-น้ำตาลเข้ม หนักมาก แข็งแกร่งที่สุดในบรรดาไม้ไทย (Janka Hardness สูงมาก) ทนต่อน้ำ แมลง และความชื้นสูงมาก ในอดีตใช้ทำล้อเกวียน เพลาล้อ ไม้ฉาก คันไถ และงานโครงสร้างหนัก ปัจจุบันใช้ทำพื้นไม้คุณภาพสูง เฟอร์นิเจอร์ทนทาน ราวบันได และงานก่อสร้างพิเศษที่ต้องการความทนทานสูง เนื้อไม้มีคุณค่าทางเศรษฐกิจสูง ปลูกในโครงการป่าชุมชนและการปลูกป่าทดแทน",
    description_en:
      "Xylia (Daeng) is a medium-to-large deciduous hardwood tree (Fabaceae), native to mixed deciduous forests of Thailand, Myanmar, India, and Southeast Asia, growing 15–25 m tall. Pinnate leaves; spherical yellow flower heads; flat thick crescent-shaped pods. The dark red-brown wood is exceptionally heavy and one of Thailand's hardest timbers (very high Janka hardness), with outstanding resistance to water, insects, and moisture. Historically used for cart wheels, axles, plows, and heavy structural work. Today used for premium flooring, heavy furniture, stair railings, and specialized construction requiring extreme durability. Economically valuable; planted in community forest and reforestation projects.",
    image: "/images/plants/daeng.jpg",
    tags: ["Hardwood"],
    references: [
      { title: "Wikipedia - Xylia xylocarpa", url: "https://en.wikipedia.org/wiki/Xylia_xylocarpa" }
    ]
  },
  {
    id: "kratom",
    type: "plant",
    name_th: "ต้นกระท่อม",
    name_en: "Kratom",
    scientific_name: "Mitragyna speciosa",
    short_description: "พืชพื้นถิ่นวงศ์กาแฟ กฎหมายไทยปลดล็อกปี 2564 อยู่ระหว่างศึกษาวิจัยทางการแพทย์",
    short_description_en: "Southeast Asian coffee-family plant; decriminalized in Thailand in 2021; under medical research",
    description:
      "กระท่อมเป็นพืชในวงศ์กาแฟ (Rubiaceae) สูง 4–16 เมตร มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ โดยเฉพาะไทย มาเลเซีย และอินโดนีเซีย ใบรูปไข่ขนาดใหญ่ 14–20 ซม. ออกดอกสีเหลืองเป็นช่อทรงกลม สารออกฤทธิ์หลักในใบ คือ Mitragynine และ 7-Hydroxymitragynine ซึ่งมีฤทธิ์ต่อตัวรับ Opioid ในสมอง ในปริมาณน้อยช่วยกระตุ้น ในปริมาณมากมีฤทธิ์สงบประสาท ใช้งานดั้งเดิมในชุมชนชนบทเพื่อบรรเทาอาการปวดและเพิ่มความอดทนในการทำงาน ประเทศไทยปลดล็อกกระท่อมออกจากบัญชียาเสพติดในปี พ.ศ. 2564 ปัจจุบันอยู่ระหว่างการศึกษาเพื่อใช้ประโยชน์ทางการแพทย์และพัฒนาเป็นสมุนไพรเศรษฐกิจ การค้าและการใช้งานมีข้อกำกับแตกต่างกันในแต่ละประเทศ",
    description_en:
      "Kratom is a tropical tree in the coffee family (Rubiaceae), native to Southeast Asia — especially Thailand, Malaysia, and Indonesia — growing 4–16 m tall. Large oval leaves 14–20 cm; yellow globular flower clusters. Active leaf compounds — Mitragynine and 7-Hydroxymitragynine — act on opioid receptors: stimulating at low doses, sedating at high doses. Traditionally used in rural communities for pain relief and work endurance. Thailand decriminalized Kratom in 2021 (B.E. 2564); it is currently under research for medical applications and development as an economic herb. Trade and use regulations vary significantly by country — check local laws before any use.",
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
    short_description: "ดอกสีส้ม-แดงเด่น ออกดอกตอนผลัดใบ สีย้อมธรรมชาติ ยาอายุรเวท",
    short_description_en: "Brilliant orange-red flowers bloom on bare branches; natural dye source and Ayurvedic medicine",
    description:
      "ทองกวาวเป็นไม้ยืนต้นขนาดกลางในวงศ์ถั่ว (Fabaceae) สูง 10–15 เมตร มีถิ่นกำเนิดในเอเชียใต้ ตั้งแต่อินเดีย เนปาล ไปจนถึงเอเชียตะวันออกเฉียงใต้รวมถึงไทย ออกดอกสีส้ม-แดงสดเป็นช่อขนาดใหญ่ในช่วงมกราคม-มีนาคม ขณะที่ต้นยังไม่มีใบหรือผลัดใบ ทำให้ดูโดดเด่นราวกับต้นไม้กำลังลุกไหม้ จึงได้ชื่อว่า Flame-of-the-forest ใบประกอบแบบขนนก ใบย่อย 3 ใบ รูปกลม-รี ฝักแบน ยาว 15–20 ซม. มีเมล็ดเดียว ดอกสีส้มใช้สกัดสีย้อมธรรมชาติสีเหลือง-ส้มสำหรับเทศกาลโฮลีในอินเดีย เปลือก ราก ดอก และเมล็ดมีสรรพคุณทางยาในตำราอายุรเวทและตำรายาไทย รักษาแผล ลดอาการอักเสบ และบำรุงร่างกาย เนื้อไม้เบา ใช้งานทั่วไป",
    description_en:
      "Flame-of-the-forest (Thongkwao) is a medium deciduous tree (Fabaceae), native to South Asia from India and Nepal to Southeast Asia including Thailand, growing 10–15 m tall. Famous for its spectacular clusters of brilliant orange-red flowers that bloom January–March while the tree is entirely leafless — creating a dramatic flaming appearance that gives the tree its common name. Trifoliate pinnate leaves; flat pods 15–20 cm with a single seed. Orange flowers yield a yellow-orange natural dye used in India's Holi festival. Bark, roots, flowers, and seeds are used in Ayurvedic and Thai traditional medicine for wound healing, reducing inflammation, and as a tonic. Lightweight wood has general utility applications.",
    image: "/images/plants/thongkwao.jpg",
    tags: ["Ornamental"],
    references: [
      { title: "Wikipedia - Butea monosperma", url: "https://en.wikipedia.org/wiki/Butea_monosperma" }
    ]
  }
];
