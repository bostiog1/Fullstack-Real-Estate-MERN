// seedData.js - Rulează cu: node seedData.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const userData = {
  username: "Andrei Popescu",
  email: "andrei.popescu@example.com",
  password: "123456", // Va fi hashed
  avatar:
    "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
};

const samplePosts = [
  {
    title: "Apartament modern în centrul Bucureștiului",
    price: 1200,
    images: [
      "https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Bulevardul Magheru 15",
    city: "București",
    bedroom: 2,
    bathroom: 1,
    latitude: "44.4323",
    longitude: "26.1063",
    type: "inchiriaza",
    property: "apartment",
    isRentable: true,
    postDetail: {
      desc: "Apartament modern complet mobilat și utilat, situat în centrul Bucureștiului, la doar câteva minute de metrou și principalele atracții turistice. Apartamentul oferă confort maxim cu toate facilitățile necesare pentru o ședere plăcută.",
      utilities: "owner",
      pet: "allowed",
      size: 78,
    },
  },
  {
    title: "Casă cu grădină în Constanța",
    price: 150000,
    images: [
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Strada Florilor 23",
    city: "Constanța",
    bedroom: 3,
    bathroom: 2,
    latitude: "44.1598",
    longitude: "28.6348",
    type: "cumpara",
    property: "house",
    isRentable: false,
    postDetail: {
      desc: "Casă individuală cu grădină generoasă, ideală pentru o familie. Proprietatea se află într-o zonă liniștită, cu acces facil la toate facilitățile urbane. Casa este în stare excelentă și gata de mutat.",
      utilities: "tenant",
      pet: "allowed",
      size: 120,
    },
  },
  {
    title: "Apartament cu vedere la mare - Mamaia",
    price: 800,
    images: [
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Bulevardul Mamaia 101",
    city: "Constanța",
    bedroom: 2,
    bathroom: 1,
    latitude: "44.2619",
    longitude: "28.6519",
    type: "inchiriaza",
    property: "apartment",
    isRentable: true,
    postDetail: {
      desc: "Apartament spectaculos cu vedere panoramică la Marea Neagră, situat pe prima linie în Mamaia. Perfect pentru vacanțe sau ședere de lungă durată. Apartamentul dispune de toate facilitățile moderne.",
      utilities: "owner",
      pet: "not_allowed",
      size: 65,
    },
  },
  {
    title: "Vila moderna in Cluj-Napoca",
    price: 250000,
    images: [
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Strada Observatorului 45",
    city: "Cluj-Napoca",
    bedroom: 4,
    bathroom: 3,
    latitude: "46.7712",
    longitude: "23.6236",
    type: "cumpara",
    property: "house",
    isRentable: false,
    postDetail: {
      desc: "Vila moderna construita in 2020, cu finisaje de lux si tehnologii smart home. Situata intr-o zona selecta a Clujului, aproape de centru si cu acces rapid la autostrada. Ideala pentru o familie numerosa.",
      utilities: "owner",
      pet: "allowed",
      size: 180,
    },
  },
  {
    title: "Apartament nou in Brasov - zona centrala",
    price: 1000,
    images: [
      "https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Strada Republicii 12",
    city: "Brașov",
    bedroom: 2,
    bathroom: 1,
    latitude: "45.6579",
    longitude: "25.6015",
    type: "inchiriaza",
    property: "apartment",
    isRentable: true,
    postDetail: {
      desc: "Apartament nou, modern amenajat in centrul istoric al Brasovului, cu vedere catre Tampa si Piata Sfatului. Complet mobilat si utilat, ideal pentru persoane care lucreaza in centru sau pentru turisti.",
      utilities: "owner",
      pet: "not_allowed",
      size: 70,
    },
  },
  {
    title: "Casa traditionala in Sibiu",
    price: 180000,
    images: [
      "https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
    address: "Strada Cetatii 67",
    city: "Sibiu",
    bedroom: 3,
    bathroom: 2,
    latitude: "45.7983",
    longitude: "24.1256",
    type: "cumpara",
    property: "house",
    isRentable: false,
    postDetail: {
      desc: "Casa traditionala saseasca renovata cu grija, pastrand caracterul autentic dar adaugand confortul modern. Situata in zona istorica a Sibiului, aproape de centrul vechi si principalele atractii.",
      utilities: "tenant",
      pet: "allowed",
      size: 150,
    },
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Începe popularea bazei de date...");

    // 1. Creează utilizatorul
    console.log("👤 Creez utilizatorul...");
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        avatar: userData.avatar,
      },
    });

    console.log(`✅ Utilizator creat: ${user.username}`);

    // 2. Creează postările
    console.log("🏠 Creez proprietățile...");

    for (const postData of samplePosts) {
      const { postDetail, ...postInfo } = postData;

      const post = await prisma.post.create({
        data: {
          ...postInfo,
          userId: user.id,
          postDetail: {
            create: postDetail,
          },
        },
        include: {
          postDetail: true,
        },
      });

      console.log(`✅ Proprietate creată: ${post.title}`);
    }

    console.log("🎉 Baza de date a fost populată cu succes!");
    console.log(`📊 Statistici:
    - 1 utilizator creat
    - ${samplePosts.length} proprietăți create
    - Utilizator: ${userData.email} / ${userData.password}`);
  } catch (error) {
    console.error("❌ Eroare la popularea bazei de date:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Rulează script-ul
seedDatabase();
