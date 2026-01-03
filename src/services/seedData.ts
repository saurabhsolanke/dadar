
import {
    collection,
    doc,
    GeoPoint,
    Timestamp,
    writeBatch
} from "firebase/firestore";
import { db } from "../config/firebase";

export const seedDatabase = async () => {
  console.log("Starting seed process...");
  const batch = writeBatch(db);

  // 1. Users Collection
  const userRef = doc(db, "users", "test_user_123");
  batch.set(userRef, {
    displayName: "Saurabh User",
    email: "saurabh@example.com",
    photoURL: "https://ui-avatars.com/api/?name=Saurabh+User",
    createdAt: Timestamp.now(),
    preferences: {
      theme: "dark",
      notifications: true
    }
  });

  // 2. Places Collection
  const placesData = [
    {
      title: "Shivaji Park",
      description: "A large public park in Dadar, famous for cricket and politics.",
      location: "Dadar West",
      geoPoint: new GeoPoint(19.0269, 72.8383),
      rating: 4.8,
      images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Shivaji_Park_Mumbai.jpg/800px-Shivaji_Park_Mumbai.jpg"],
      category: "park"
    },
    {
      title: "Siddhivinayak Temple",
      description: "One of the richest and most famous temples/shrines in Mumbai.",
      location: "Prabhadevi (Near Dadar)",
      geoPoint: new GeoPoint(19.0169, 72.8304),
      rating: 4.9,
      images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Siddhivinayak_Temple_Mumbai.jpg/800px-Siddhivinayak_Temple_Mumbai.jpg"],
      category: "historical"
    },
    {
      title: "Dadar Flower Market",
      description: "A bustling wholesale flower market, best visited early morning.",
      location: "Dadar West (Near Station)",
      geoPoint: new GeoPoint(19.0222, 72.8417),
      rating: 4.5,
      images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Flower_Market_Dadar.jpg/800px-Flower_Market_Dadar.jpg"],
      category: "market"
    }
  ];

  placesData.forEach(place => {
    const placeRef = doc(collection(db, "places"));
    batch.set(placeRef, place);
  });

  // 3. Hotels Collection
  const hotelsData = [
    {
      title: "Pritam Da Dhaba",
      description: "Famous for its authentic Punjabi cuisine and retro ambience.",
      location: "Dadar East",
      rating: 4.4,
      image: "https://b.zmtcdn.com/data/pictures/chains/2/32002/6e8851c8632df50901e8f2674251214c.jpg",
      priceRange: "$$"
    },
    {
      title: "Aaswad",
      description: "Renowned for Maharashtrian vegetarian delicacies like Misal Pav.",
      location: "Shivaji Park, Dadar West",
      rating: 4.6,
      image: "https://b.zmtcdn.com/data/pictures/chains/4/33004/3e351910609bb5361732655cb3438a2e.jpg",
      priceRange: "$"
    },
    {
      title: "Gypsy Corner",
      description: "Popular fast food and Maharashtrian snacks joint.",
      location: "Shivaji Park, Dadar West",
      rating: 4.3,
      image: "https://b.zmtcdn.com/data/pictures/1/36301/b66157850024467c6990cdfc892c9068.jpg",
      priceRange: "$$"
    }
  ];

  hotelsData.forEach(hotel => {
    const hotelRef = doc(collection(db, "hotels"));
    batch.set(hotelRef, hotel);
  });

  // 4. Shops Collection
  const shopsData = [
    {
      name: "Dadar Flower Market",
      description: "Wholesale flowers used for festivals and decoration.",
      location: "0.2 km from Dadar Station",
      rating: 4.7,
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Flower_Market_Dadar.jpg/800px-Flower_Market_Dadar.jpg",
      category: "flower market"
    },
    {
      name: "Hindmata Cloth Market",
      description: "Famous wholesale cloth market for sarees and dress materials.",
      location: "1.0 km from Dadar Station",
      rating: 4.2,
      image: "https://content.jdmagicbox.com/comp/mumbai/65/022p8008265/catalogue/hindmata-market-dadar-east-mumbai-fabric-retailers-3p2b3.jpg",
      category: "clothing"
    }
  ];

  shopsData.forEach(shop => {
    const shopRef = doc(collection(db, "shops"));
    batch.set(shopRef, shop);
  });

  // 5. Events Collection
  const eventsData = [
    {
      title: "Dadar Cultural Festival",
      description: "Annual festival celebrating local art, music, and food.",
      location: "Shivaji Park",
      date: Timestamp.fromDate(new Date("2024-02-15T18:00:00")),
      image: "https://example.com/fest.jpg",
      organizer: "Dadar Residents Association"
    },
    {
      title: "Mumbai Marathon (Dadar Leg)",
      description: "Cheering point for the annual Mumbai Marathon.",
      location: "Cadell Road, Dadar",
      date: Timestamp.fromDate(new Date("2024-01-21T06:00:00")),
      image: "https://example.com/marathon.jpg",
      organizer: "Procam"
    }
  ];

  eventsData.forEach(event => {
    const eventRef = doc(collection(db, "events"));
    batch.set(eventRef, event);
  });

  // 6. Notifications Collection
  const notificationsData = [
    {
      title: "Welcome to Dadar App!",
      message: "Explore the best of Dadar with our new guide.",
      createdAt: Timestamp.now(),
      type: "general",
      targetUser: null // Broadcast
    },
    {
      title: "Weekend Offer",
      message: "Get 20% off at Aaswad this weekend.",
      createdAt: Timestamp.now(),
      type: "promo",
      targetUser: "test_user_123"
    }
  ];

  notificationsData.forEach(notif => {
    const notifRef = doc(collection(db, "notifications"));
    batch.set(notifRef, notif);
  });

  try {
    await batch.commit();
    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
};
