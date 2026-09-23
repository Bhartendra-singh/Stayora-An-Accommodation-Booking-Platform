// import mongoose from "mongoose";
// import "dotenv/config";
// import Hotel from "./models/Hotel.js";
// import Room from "./models/Room.js";

// // ============================================================
// // DEMO DATA — edit this section
// // ============================================================
// // Paste your own Unsplash image URLs below (2-3 per room is enough).
// // Get them from unsplash.com -> right-click an image -> "Copy Image Address".
// // Valid roomType values (must match exactly, for filters to work):
// //   "Single Bed" | "Double Room" | "Luxury Room" | "Family Suite"
// // Valid amenities (must match exactly, for icons to show):
// //   "Free WiFi" | "Free Breakfast" | "Room Service" | "Mountain View" | "Pool Access"

// const demoHotels = [
//   {
//     name: "Skyline Grand Hotel",
//     address: "12 Marina Boulevard",
//     city: "Dubai",
//     contact: "+971 50 123 4567",
//     rooms: [
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2500,
//         amenities: ["Free WiFi", "Pool Access", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_2",
//         ],
//       },
//       {
//         roomType: "Double Room",
//         pricePerNight: 1200,
//         amenities: ["Free WiFi", "Free Breakfast"],
//         images: [
//           "https://images.unsplash.com/photo-1552858725-693709cc17c7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_4",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Harbourview Inn",
//     address: "88 Bayfront Avenue",
//     city: "Singapore",
//     contact: "+65 8123 4567",
//     rooms: [
//       {
//         roomType: "Single Bed",
//         pricePerNight: 450,
//         amenities: ["Free WiFi"],
//         images: [
//           "https://images.unsplash.com/photo-1668260592478-a6513b0a690e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_6",
//         ],
//       },
//       {
//         roomType: "Family Suite",
//         pricePerNight: 2900,
//         amenities: ["Free WiFi", "Free Breakfast", "Mountain View"],
//         images: [
//           "https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?q=80&w=1076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_8",
//         ],
//       },
//     ],
//   },
//   {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "https://images.unsplash.com/photo-1631048730670-ff5cd0d08f15?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "https://plus.unsplash.com/premium_photo-1661962493427-910e3333cf5a?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         ],
//       },
//     ],
//   },
//     {
//     name: "Central Park Residency",
//     address: "45 5th Avenue",
//     city: "New York",
//     contact: "+1 212 555 0134",
//     rooms: [
//       {
//         roomType: "Double Room",
//         pricePerNight: 1800,
//         amenities: ["Free WiFi", "Room Service"],
//         images: [
//           "https://plus.unsplash.com/premium_photo-1661877303180-19a028c21048?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_10",
//         ],
//       },
//       {
//         roomType: "Luxury Room",
//         pricePerNight: 2999,
//         amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
//         images: [
//           "https://images.unsplash.com/photo-1737517302831-e7b8a8eaa97c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//           "PASTE_IMAGE_URL_12",
//         ],
//       },
//     ],
//   },
// ];

// // ============================================================
// // SEEDING LOGIC — no need to edit below this line
// // ============================================================

// const run = async () => {
//   await mongoose.connect(process.env.MONGODB_URI);
//   console.log("Connected to MongoDB");

//   for (const hotelData of demoHotels) {
//     const { rooms, ...hotelFields } = hotelData;

//     // A unique placeholder owner string per demo hotel — these hotels are
//     // for public browsing/demo purposes only, not tied to a real Clerk
//     // account, so they won't show up in anyone's "My Hotel" dashboard.
//     const owner = `seed-owner-${hotelFields.name.toLowerCase().replace(/\s+/g, "-")}`;

//     const hotel = await Hotel.create({ ...hotelFields, owner });
//     console.log(`Created hotel: ${hotel.name}`);

//     for (const roomData of rooms) {
//       await Room.create({ ...roomData, hotel: hotel._id });
//       console.log(`  + room: ${roomData.roomType} (${roomData.pricePerNight})`);
//     }
//   }

//   console.log("Done seeding.");
//   await mongoose.disconnect();
//   process.exit(0);
// };

// run().catch((err) => {
//   console.error("Seeding failed:", err);
//   process.exit(1);
// });





import mongoose from "mongoose";
import "dotenv/config";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

// ============================================================
// DEMO HOTEL DATA
// ============================================================

const demoHotels = [
  {
    name: "Skyline Grand Hotel",
    address: "12 Marina Boulevard",
    city: "Dubai",
    contact: "+971 50 123 4567",
    rooms: [
      {
        roomType: "Luxury Room",
        pricePerNight: 2500,
        amenities: ["Free WiFi", "Pool Access", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Double Room",
        pricePerNight: 1200,
        amenities: ["Free WiFi", "Free Breakfast"],
        images: [
          "https://images.unsplash.com/photo-1552858725-693709cc17c7?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "Harbourview Inn",
    address: "88 Bayfront Avenue",
    city: "Singapore",
    contact: "+65 8123 4567",
    rooms: [
      {
        roomType: "Single Bed",
        pricePerNight: 450,
        amenities: ["Free WiFi"],
        images: [
          "https://images.unsplash.com/photo-1668260592478-a6513b0a690e?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Family Suite",
        pricePerNight: 2900,
        amenities: ["Free WiFi", "Free Breakfast", "Mountain View"],
        images: [
          "https://images.unsplash.com/photo-1662841540530-2f04bb3291e8?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "Central Park Residency",
    address: "45 5th Avenue",
    city: "New York",
    contact: "+1 212 555 0134",
    rooms: [
      {
        roomType: "Double Room",
        pricePerNight: 1800,
        amenities: ["Free WiFi", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Luxury Room",
        pricePerNight: 2999,
        amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Pool Access"],
        images: [
          "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "Royal Palm Resort",
    address: "7 Palm Jumeirah",
    city: "Dubai",
    contact: "+971 50 987 6543",
    rooms: [
      {
        roomType: "Luxury Room",
        pricePerNight: 3500,
        amenities: ["Free WiFi", "Pool Access", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Family Suite",
        pricePerNight: 4200,
        amenities: ["Free WiFi", "Free Breakfast", "Pool Access"],
        images: [
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "Mountain View Lodge",
    address: "21 Hill Road",
    city: "Manali",
    contact: "+91 98765 43210",
    rooms: [
      {
        roomType: "Single Bed",
        pricePerNight: 900,
        amenities: ["Free WiFi", "Mountain View"],
        images: [
          "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1544986581-efac024faf62?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Family Suite",
        pricePerNight: 2200,
        amenities: ["Free WiFi", "Free Breakfast", "Mountain View"],
        images: [
          "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "Ocean Pearl Resort",
    address: "Beach Road",
    city: "Goa",
    contact: "+91 99887 66554",
    rooms: [
      {
        roomType: "Double Room",
        pricePerNight: 1600,
        amenities: ["Free WiFi", "Free Breakfast"],
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Luxury Room",
        pricePerNight: 2800,
        amenities: ["Free WiFi", "Pool Access", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "The Heritage Palace",
    address: "15 Palace Road",
    city: "Jaipur",
    contact: "+91 98765 12345",
    rooms: [
      {
        roomType: "Double Room",
        pricePerNight: 1400,
        amenities: ["Free WiFi", "Free Breakfast", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200&auto=format&fit=crop",
        ]
      },
      {
        roomType: "Luxury Room",
        pricePerNight: 2600,
        amenities: ["Free WiFi", "Free Breakfast", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  },

  {
    name: "City Lights Hotel",
    address: "101 MG Road",
    city: "Bangalore",
    contact: "+91 91234 56789",
    rooms: [
      {
        roomType: "Single Bed",
        pricePerNight: 800,
        amenities: ["Free WiFi", "Free Breakfast"],
        images: [
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop"
        ]
      },
      {
        roomType: "Double Room",
        pricePerNight: 1500,
        amenities: ["Free WiFi", "Room Service"],
        images: [
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop"
        ]
      }
    ]
  }
];


// ============================================================
// SEED DATABASE
// ============================================================

const run = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/WanderLust`);

    console.log("Connected to MongoDB");

    // Remove old demo data
    await Room.deleteMany({});
    await Hotel.deleteMany({});

    console.log("Old hotel and room data cleared.");

    // Create fresh demo data
    for (const hotelData of demoHotels) {
      const { rooms, ...hotelFields } = hotelData;

      const owner = `seed-owner-${hotelFields.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;

      const hotel = await Hotel.create({
        ...hotelFields,
        owner
      });

      console.log(`Created hotel: ${hotel.name}`);

      for (const roomData of rooms) {
        await Room.create({
          ...roomData,
          hotel: hotel._id
        });

        console.log(
          `  + room: ${roomData.roomType} (${roomData.pricePerNight})`
        );
      }
    }

    console.log("Done seeding.");

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

run();