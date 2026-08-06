// All text and product data lives here as plain, editable data.
// Everything in this file can also be changed from inside the app itself
// (turn on "ໂໝດແກ້ໄຂ" / Edit mode) — the app then saves your changes to
// the browser's localStorage, so this file only matters for the very
// first load, or after you press "Reset to default".

export const defaultContent = {
  brand: "Pao Pao",
  eyebrow: "ພະລັງເລີ່ມຕົ້ນທີ່ນີ້",
  heroTitle: "ຊຸດອອກກຳລັງກາຍ & ອາຫານເສີມ",
  heroSubtitle: "ຄຸນນະພາບພຣີເມຍມ ສົ່ງໄວ ທົ່ວລາວ",
  currency: "₭",
  catLabels: {
    women: "ຜູ້ຍິງ",
    men: "ຜູ້ຊາຍ",
    supp: "ອາຫານເສີມ",
  },
  trust: [
    { icon: "truck", text: "ຈັດສົ່ງ 24–48 ຊມ." },
    { icon: "shield", text: "ຊຳລະເງິນປອດໄພ" },
    { icon: "rotate", text: "ປ່ຽນ/ຄືນໄດ້ 7 ວັນ" },
  ],
  footerTagline: "ຝຶກໜັກ ພັກໃຫ້ພຽງພໍ ແລະ ໄປໃຫ້ໄກກວ່າເມື່ອວານ",
};

// Each product's `colors` are self-contained ({label, hex}) so editing one
// product's palette never affects another product.
export const defaultProducts = [
  {
    id: "w1", cat: "women", name: "ກາງເກງເລກກິ້ງແອວສູງ FLEX", price: 890, was: 1090,
    image: null, tag: "ຂາຍດີ", rating: 4.8, reviews: 214,
    colors: [
      { id: "c1", label: "ດຳ", hex: "#1a1a1a" },
      { id: "c2", label: "ຂຽວໄຟຟ້າ", hex: "#a8d928" },
      { id: "c3", label: "ຊາຍ", hex: "#d9cdb8" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: "w2", cat: "women", name: "ເສື້ອຊັ້ນໃນກິລາຊັບພອດສູງ CORE", price: 590, was: null,
    image: null, tag: "", rating: 4.6, reviews: 98,
    colors: [
      { id: "c1", label: "ດຳ", hex: "#1a1a1a" },
      { id: "c2", label: "ສົ້ມພະລັງ", hex: "#ff5a1f" },
      { id: "c3", label: "ຊາຍ", hex: "#d9cdb8" },
    ],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "w3", cat: "women", name: "ເສື້ອຄຮັອບແຂນກຸດ AIRY", price: 450, was: null,
    image: null, tag: "", rating: 4.5, reviews: 61,
    colors: [
      { id: "c1", label: "ຂຽວໄຟຟ້າ", hex: "#a8d928" },
      { id: "c2", label: "ຊາຍ", hex: "#d9cdb8" },
      { id: "c3", label: "ຟ້າກົມທ່າ", hex: "#1f2a44" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: "w4", cat: "women", name: "ຊຸດໂຍຄະ ZEN", price: 1290, was: null,
    image: null, tag: "ໃໝ່", rating: 5.0, reviews: 12,
    colors: [
      { id: "c1", label: "ເທົາຖ່ານ", hex: "#5b5e64" },
      { id: "c2", label: "ຊາຍ", hex: "#d9cdb8" },
    ],
    sizes: ["S", "M", "L"],
  },
  {
    id: "m1", cat: "men", name: "ເສື້ອກ້າມຢິມ POWER", price: 490, was: null,
    image: null, tag: "", rating: 4.7, reviews: 156,
    colors: [
      { id: "c1", label: "ດຳ", hex: "#1a1a1a" },
      { id: "c2", label: "ເທົາຖ່ານ", hex: "#5b5e64" },
      { id: "c3", label: "ຟ້າກົມທ່າ", hex: "#1f2a44" },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "m2", cat: "men", name: "ກາງເກງຂາສັ້ນເທຣນນິ່ງ STRIKE", price: 650, was: 790,
    image: null, tag: "ຂາຍດີ", rating: 4.9, reviews: 302,
    colors: [
      { id: "c1", label: "ດຳ", hex: "#1a1a1a" },
      { id: "c2", label: "ຟ້າກົມທ່າ", hex: "#1f2a44" },
      { id: "c3", label: "ສົ້ມພະລັງ", hex: "#ff5a1f" },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "m3", cat: "men", name: "ເສື້ອຄອມເພຣສຊັ່ນແຂນຍາວ RUSH", price: 750, was: null,
    image: null, tag: "", rating: 4.6, reviews: 87,
    colors: [
      { id: "c1", label: "ດຳ", hex: "#1a1a1a" },
      { id: "c2", label: "ເທົາຖ່ານ", hex: "#5b5e64" },
      { id: "c3", label: "ຂຽວໄຟຟ້າ", hex: "#a8d928" },
    ],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "m4", cat: "men", name: "ເສື້ອແຈັກເກັດຊິບແລ່ນ STORM", price: 1450, was: null,
    image: null, tag: "ໃໝ່", rating: 4.9, reviews: 19,
    colors: [
      { id: "c1", label: "ຟ້າກົມທ່າ", hex: "#1f2a44" },
      { id: "c2", label: "ເທົາຖ່ານ", hex: "#5b5e64" },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    id: "s1", cat: "supp", name: "ເວແອັດໂປຣຕີນ ISO WHEY 2kg", price: 1990, was: null,
    image: null, tag: "ຂາຍດີ", rating: 4.8, reviews: 441,
    colors: [],
    sizes: ["ຊັອກໂກແລັດ", "ວານິນລາ", "ສະຕໍເບີຣີ"],
  },
  {
    id: "s2", cat: "supp", name: "ພຣີເວີກເອົາ IGNITE", price: 890, was: null,
    image: null, tag: "", rating: 4.5, reviews: 73,
    colors: [],
    sizes: ["ບລູລາສເບີຣີ", "ໝາກໂມ"],
  },
  {
    id: "s3", cat: "supp", name: "BCAA ອາມິໂນຟື້ນຟູ", price: 750, was: null,
    image: null, tag: "", rating: 4.6, reviews: 54,
    colors: [],
    sizes: ["ໝາກນັດ", "ເລມອນ"],
  },
  {
    id: "s4", cat: "supp", name: "ມັນຕິວິຕາມິນປະຈຳວັນ DAILY+", price: 490, was: null,
    image: null, tag: "", rating: 4.7, reviews: 128,
    colors: [],
    sizes: ["60 ແຄບຊູນ"],
  },
];

export const CATS = ["women", "men", "supp"];
export const TAG_OPTIONS = ["", "ຂາຍດີ", "ໃໝ່"];
