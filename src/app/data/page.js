// src/data/services.js
export const services = [
  {
    id: 1,
    name: "Plumbing Services",
    slug: "plumbing", // Added slug for consistent routing
    description: "Fix leaks, install fixtures, and handle all plumbing needs",
    priceRange: "$99+",
    rating: 4.9,
    image: "/services/plumber_04.jpg", // Consistent naming
    features: ["Pipe repair", "Drain cleaning", "Fixture installation"]
  },
  {
    id: 2,
    name: "Electrical Repairs",
    slug: "electrical",
    description: "Professional electrical installations and repairs",
    priceRange: "$129+",
    rating: 4.8,
    image: "/services/electrical.jpg",
    features: ["Wiring", "Panel upgrades", "Safety inspections"]
  },
  {
    id: 3,
    name: "Car Maintenance",
    slug: "car-maintenance",
    description: "Professional vehicle maintenance services",
    priceRange: "$79+",
    rating: 4.7,
    image: "/services/car.jpg",
    features: ["Oil changes", "Brake services", "Battery checks"]
  },
  {
    id: 4,
    name: "Home Cleaning",
    slug: "home-cleaning",
    description: "Professional home cleaning services",
    priceRange: "$120+",
    rating: 4.9,
    image: "/services/homecleaning.jpg",
    features: ["Deep cleaning", "Move-in cleaning", "Window washing"]
  },
  {
    id: 5,
    name: "AC Repair",
    slug: "ac-repair",
    description: "Professional air conditioning services",
    priceRange: "$149+",
    rating: 4.8,
    image: "/services/Ac_reapir.jpg",
    features: ["AC repair", "Refrigerant", "Thermostat"]
  },
  {
    id: 6,
    name: "Appliance Repair",
    slug: "appliance-repair",
    description: "Professional appliance repair services",
    priceRange: "$109+",
    rating: 4.7,
    image: "/services/Appliance_reapir.jpg",
    features: ["Refrigerator", "Washer/dryer", "Dishwasher"]
  }
];