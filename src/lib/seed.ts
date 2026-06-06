import dbConnect from './dbConnect';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { Review } from '../models/Review';
import { Settings } from '../models/Settings';

const categoriesData = [
  {
    name: 'Padlocks',
    slug: 'padlocks',
    image: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy duty, weather-resistant brass and steel padlocks for high-security outdoor and indoor applications.',
    sortOrder: 1,
    isActive: true,
  },
  {
    name: 'Door Locks',
    slug: 'door-locks',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=80',
    description: 'Classic and modern mechanical door handle locks, lever locks, and premium entry handle sets.',
    sortOrder: 2,
    isActive: true,
  },
  {
    name: 'Smart Locks',
    slug: 'smart-locks',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    description: 'State-of-the-art biometric fingerprint, keypad, Bluetooth, and Wi-Fi enabled keyless entry locks.',
    sortOrder: 3,
    isActive: true,
  },
  {
    name: 'Deadbolts',
    slug: 'deadbolts',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80',
    description: 'High-security single and double cylinder deadbolt locking mechanisms for external wood and metal doors.',
    sortOrder: 4,
    isActive: true,
  },
  {
    name: 'Cabinet Locks',
    slug: 'cabinet-locks',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&auto=format&fit=crop&q=80',
    description: 'Drawer locks, wardrobe locks, showcase locks, and cam locking systems for home and office furniture.',
    sortOrder: 5,
    isActive: true,
  },
  {
    name: 'Gate Locks',
    slug: 'gate-locks',
    image: 'https://images.unsplash.com/photo-1548682618-971fa8d376d4?w=600&auto=format&fit=crop&q=80',
    description: 'Heavy-duty rim locks, latch locks, and mechanical security locks engineered specifically for gates and fences.',
    sortOrder: 6,
    isActive: true,
  },
  {
    name: 'Mortise Locks',
    slug: 'mortise-locks',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    description: 'Traditional mortise sashlocks, deadlocks, and sliding door mechanisms that fit inside the door cavity.',
    sortOrder: 7,
    isActive: true,
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80',
    description: 'Replacement keys, key rings, lubricants, strike plates, and auxiliary mounting hardware for locking systems.',
    sortOrder: 8,
    isActive: true,
  },
];

const productsData = [
  // Padlocks
  {
    name: 'Nayyars Solid Brass Heavy Duty Padlock',
    slug: 'nayyars-solid-brass-heavy-duty-padlock',
    description: 'The Nayyars Solid Brass Padlock offers superior protection for your valuables. Machined from solid brass, it features a double-locking hardened steel shackle that resists cutting and sawing. Perfect for warehouses, lockers, fences, and utility chests. Features high-precision pin cylinders to resist picking and bumping.',
    shortDescription: 'Double-locking hardened steel padlock made from premium solid brass.',
    categorySlug: 'padlocks',
    images: ['https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-PL-BR-50',
    brand: 'Nayyars',
    price: 850,
    originalPrice: 1200,
    material: 'Solid Brass',
    keyType: 'Standard Dimple Key',
    securityGrade: 'Grade 4 (High Security)',
    features: [
      'Rust-proof solid brass body',
      'Hardened steel shackle (10mm diameter)',
      'Double locking mechanism for pry-resistance',
      '5-pin high precision brass cylinder',
      'Comes with 3 nickel-plated keys'
    ],
    specifications: {
      'Body Width': '50 mm',
      'Shackle Clearance': '25 mm',
      'Shackle Diameter': '10 mm',
      'Weight': '350 grams',
      'Corrosion Resistance': 'High'
    },
    tags: ['brass', 'padlock', 'heavy duty', 'security', 'weatherproof'],
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
  },
  {
    name: 'Nayyars All-Weather Armored Shrouded Padlock',
    slug: 'nayyars-all-weather-armored-shrouded-padlock',
    description: 'Designed specifically for extreme environments, this armored padlock features a shrouded shackle design that prevents bolt-cutter attacks. The hardened steel jacket shields the brass body, while the protective keyway cover keeps out dust, water, and debris. Ideal for marine environments and outdoor gates.',
    shortDescription: 'Bolt-cutter proof armored padlock with weatherproof protective cover.',
    categorySlug: 'padlocks',
    images: ['https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-PL-AR-70',
    brand: 'Nayyars',
    price: 1450,
    originalPrice: 1950,
    material: 'Armored Hardened Steel & Brass',
    keyType: 'Laser Cut Key',
    securityGrade: 'Grade 5 (Maximum Security)',
    features: [
      'Shrouded shackle eliminates bolt-cutter access',
      'Impact-resistant armored steel jacket',
      'Rubber keyway dust cap prevents clogging',
      'Anti-drill protection plate over keyway',
      '4 high-security laser keys included'
    ],
    specifications: {
      'Body Width': '70 mm',
      'Shackle Clearance': '18 mm',
      'Shackle Diameter': '12 mm',
      'Weight': '620 grams',
      'Weather Protection': 'IP65 Rated'
    },
    tags: ['armored', 'padlock', 'shrouded', 'maximum security', 'weatherproof'],
    isActive: true,
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
  },

  // Smart Locks
  {
    name: 'Nayyars Touch Pro Biometric Smart Lock',
    slug: 'nayyars-touch-pro-biometric-smart-lock',
    description: 'Step into keyless luxury with the Touch Pro Biometric Smart Lock. Unlock your door in under 0.3 seconds using the semiconductor fingerprint sensor, or choose from a touchscreen keypad, RF card, physical backup key, or our dedicated mobile app. Integrates with smart home systems to track access logs and manage temporary visitor pins.',
    shortDescription: '5-in-1 biometric smart lock with fingerprint, passcode, and app access.',
    categorySlug: 'smart-locks',
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-SL-TP-100',
    brand: 'Nayyars',
    price: 12500,
    originalPrice: 18000,
    material: 'Zinc Alloy & Tempered Glass',
    keyType: 'Biometric / Passcode / RF Card / Key',
    securityGrade: 'Grade 6 (Commercial Smart Grade)',
    features: [
      'Ultra-fast 3D semiconductor fingerprint reader',
      'Store up to 100 fingerprints and 50 passcodes',
      'Temporary one-time codes for guests via mobile app',
      'Auto-lock function when door is closed',
      'Emergency USB Type-C charging port for dead batteries'
    ],
    specifications: {
      'Fingerprint Scan Time': '< 0.3 seconds',
      'Battery Life': '10-12 months (4x AA Alkaline)',
      'Door Thickness Range': '35 mm to 65 mm',
      'App Support': 'iOS & Android via Bluetooth/Wi-Fi',
      'Emergency Key': 'Yes, 2 Mechanical Override Keys'
    },
    tags: ['smart', 'biometric', 'fingerprint', 'keyless', 'touchscreen'],
    isActive: true,
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
  },

  // Door Locks
  {
    name: 'Nayyars Imperial Brass Lever Handle Lock',
    slug: 'nayyars-imperial-brass-lever-handle-lock',
    description: 'Enhance your interior and exterior doors with the elegant Imperial Lever Set. Finished in premium satin gold, this mechanical lock features an ergonomic lever design and a heavy-duty latched mortise mechanism. Specially coated to prevent tarnishing and fingerprint marks.',
    shortDescription: 'Elegant satin-gold lever handle lock for entryways.',
    categorySlug: 'door-locks',
    images: ['https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-DL-IM-80',
    brand: 'Nayyars',
    price: 3800,
    originalPrice: 5500,
    material: 'Forged Solid Brass',
    keyType: 'High-Security Dimple Key',
    securityGrade: 'Grade 3 (Residential High Security)',
    features: [
      'Ergonomic lever-action handle set',
      'Premium corrosion-resistant gold plating',
      'Adjustable latch mechanism for left/right opening doors',
      'Reinforced internal steel chassis',
      'Includes mortise cylinder and 3 keys'
    ],
    specifications: {
      'Handle Length': '125 mm',
      'Plate Height': '240 mm',
      'Locking Distance': '85 mm',
      'Suitable Doors': 'Wooden, Steel, Composite'
    },
    tags: ['door lock', 'brass handle', 'lever lock', 'luxury', 'satin gold'],
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: false,
  },

  // Deadbolts
  {
    name: 'Nayyars Double Cylinder Maximum Security Deadbolt',
    slug: 'nayyars-double-cylinder-maximum-security-deadbolt',
    description: 'Ensure double-sided security for your wooden doors, especially those near glass panels. The Nayyars Double Cylinder Deadbolt requires a key on both the inside and outside, preventing intruders from breaking the glass and reaching inside to turn a thumbturn. Built with an anti-drill core and a heavy steel bolt throw.',
    shortDescription: 'Key-operated double-sided deadbolt with anti-drill cylinder core.',
    categorySlug: 'deadbolts',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-DB-DC-20',
    brand: 'Nayyars',
    price: 1850,
    originalPrice: 2500,
    material: 'Hardened Stainless Steel',
    keyType: 'Computerized Dimple Key',
    securityGrade: 'Grade 5 (High Security)',
    features: [
      'Requires key operation on both internal and external sides',
      'Saw-resistant solid steel throw bolt with hardened pin',
      'Reinforced strike plate with 3-inch screws to resist kick-ins',
      'Anti-pick, anti-drill cylinder shell',
      'Universal latch fits 60mm or 70mm backsets'
    ],
    specifications: {
      'Latch Backset': '60 mm - 70 mm adjustable',
      'Bolt Throw Length': '25 mm (1 inch)',
      'Cylinder Type': '6-Pin brass core',
      'Door Fit': '35 mm to 50 mm thick'
    },
    tags: ['deadbolt', 'double cylinder', 'stainless steel', 'door security', 'anti-drill'],
    isActive: true,
    isFeatured: false,
    isBestseller: true,
    isNewArrival: false,
  },

  // Gate Locks
  {
    name: 'Nayyars Guardian Rim Gate Lock',
    slug: 'nayyars-guardian-rim-gate-lock',
    description: 'Designed for main iron and wooden gates, this heavy-duty Rim Lock is mounted directly onto the inner surface of the gate. It features an extra-thick steel bolt and a double-throw locking system. Easy to operate from the inside with an ergonomic knob and from the outside with a high-security dimple key.',
    shortDescription: 'Surface-mounted heavy-duty gate lock with double throw steel bolts.',
    categorySlug: 'gate-locks',
    images: ['https://images.unsplash.com/photo-1548682618-971fa8d376d4?w=600&auto=format&fit=crop&q=80'],
    SKU: 'NY-GL-GR-90',
    brand: 'Nayyars',
    price: 2600,
    originalPrice: 3800,
    material: 'Carbon Steel Body & Brass Cylinder',
    keyType: 'Precision Computerized Key',
    securityGrade: 'Grade 4 (High Security)',
    features: [
      'Sturdy steel casing with scratch-resistant powder coat',
      'Double-throw bolt extends 20mm for robust gate lockup',
      'Easy surface mounting setup with standard tools',
      'Brass cylinder mechanism for long rust-free lifespan',
      'Supplied with 4 computer-cut keys'
    ],
    specifications: {
      'Lock Body Dimensions': '120 mm x 90 mm x 30 mm',
      'Bolt Throw': '20 mm (Double Throw)',
      'Gate Compatibility': 'Iron, Steel, Wood gates',
      'Cylinder Length': '60 mm'
    },
    tags: ['gate lock', 'rim lock', 'outdoor', 'iron gate', 'heavy duty'],
    isActive: true,
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
  }
];

const reviewsData = [
  {
    customerName: 'Aarav Sharma',
    location: 'New Delhi, India',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Outstanding build quality and security!',
    comment: 'I bought the Solid Brass Heavy Duty Padlock for our main shop shutter. The lock is extremely heavy and feels indestructible. The dimple keys function very smoothly. Very happy with the security it offers.',
    source: 'Google Review',
    isFeatured: true,
    isPublished: true,
    reviewDate: new Date('2026-03-15'),
  },
  {
    customerName: 'Priyah Patel',
    location: 'Mumbai, India',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Touch Pro Smart Lock is worth every rupee',
    comment: 'No more searching for keys when returning home with groceries! The fingerprint scanner is incredibly fast, and the mobile app is easy to navigate. It also alerts us when batteries run low. Extremely premium.',
    source: 'WhatsApp Client Share',
    isFeatured: true,
    isPublished: true,
    reviewDate: new Date('2026-04-22'),
  },
  {
    customerName: 'Vikram Singh',
    location: 'Jaipur, India',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4,
    title: 'Reliable Rim Gate Lock',
    comment: 'Installed the Guardian Rim Lock on our main metal gate. The double throw bolt provides awesome safety. Installation was simple and it works flawlessly in heavy rain.',
    source: 'Google Review',
    isFeatured: true,
    isPublished: true,
    reviewDate: new Date('2026-05-10'),
  }
];

const defaultSettings = {
  siteName: 'Nayyarslocks',
  logo: '/logo.png',
  tagline: 'Premium Security Locking Systems & Solutions',
  hero: {
    title: 'Uncompromised Security, Premium Craftsmanship',
    subtitle: 'Discover our advanced range of padlocks, smart biometric locks, mechanical deadbolts, and security hardware engineered to safeguard your world.',
    bgImage: 'https://images.unsplash.com/photo-1510519138101-570d1dca3d66?w=1600&auto=format&fit=crop&q=80',
    ctaText: 'Explore Locks Range',
  },
  about: {
    story: 'Founded with a dedication to security and precision engineering, Nayyarslocks has grown into a leading manufacturer and provider of high-security locking systems. We utilize high-grade solid brass, carbon steel, and smart-biometric circuits to create products that combine timeless strength with futuristic innovation. Every lock bearing the Nayyars name is rigorously tested against pry, bump, drill, and environmental wearing.',
    mission: 'To manufacture and deliver top-grade lock safety systems that secure lives and assets, maintaining unmatched customer trust and product integrity.',
    vision: 'To shape the future of locks engineering across the globe, recognized as the hallmark of durable protection and state-of-the-art keyless smart integration.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
  contact: {
    whatsappNumber: '9219595948',
    phone: '9219595948',
    email: 'sales@nayyarslocks.com',
    address: 'Nayyarslocks Industrial Area, Gate No. 2, Security Plaza, New Delhi, 110015',
    hours: 'Monday - Saturday: 9:00 AM - 7:00 PM (Closed on Sunday)',
  },
  socialLinks: {
    facebook: 'https://facebook.com/nayyarslocks',
    instagram: 'https://instagram.com/nayyarslocks',
    twitter: 'https://twitter.com/nayyarslocks',
    linkedin: 'https://linkedin.com/company/nayyarslocks',
  },
  seo: {
    metaTitle: 'Nayyarslocks | Heavy-Duty Brass Padlocks & Smart Keyless Systems',
    metaDescription: 'Secure your residential and commercial properties with Nayyarslocks. Browse our collection of brass padlocks, fingerprint door handles, deadbolts, and heavy gate rim locks.',
    keywords: ['brass locks', 'nayyars locks', 'heavy duty padlocks', 'fingerprint biometric lock', 'lever door handle', 'rim gate lock', 'security hardware India'],
  },
  footer: {
    copyright: '© 2026 Nayyarslocks. All rights reserved. Precision crafted for ultimate peace of mind.',
    aboutText: 'Nayyarslocks is a premier manufacturer of premium mechanical locks, high-security deadbolts, and modern smart entrance locking systems designed for ultimate durability.',
  },
};

export async function runSeed() {
  await dbConnect();

  // Clear existing data
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Review.deleteMany({});
  await Settings.deleteMany({});

  // Seed settings
  const settingsInstance = new Settings(defaultSettings);
  await settingsInstance.save();

  // Seed categories
  const seededCategories = await Category.insertMany(categoriesData);

  // Map category slug to mongoose object _id
  const categoryMap: Record<string, string> = {};
  seededCategories.forEach((cat) => {
    categoryMap[cat.slug] = cat._id.toString();
  });

  // Modify products to use actual category _id reference
  const productsWithCatRef = productsData.map((prod) => {
    const catId = categoryMap[prod.categorySlug];
    if (!catId) {
      throw new Error(`Category slug ${prod.categorySlug} not found in seeded categories.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categorySlug, ...rest } = prod;
    return {
      ...rest,
      category: catId,
    };
  });

  // Seed products
  const seededProducts = await Product.insertMany(productsWithCatRef);

  // Seed reviews, link to appropriate products if applicable
  const reviewsWithProductRef = reviewsData.map((rev, index) => {
    // Link first review to first product, second to second, etc.
    const product = seededProducts[index % seededProducts.length];
    return {
      ...rev,
      linkedProduct: product ? product._id.toString() : undefined,
    };
  });

  await Review.insertMany(reviewsWithProductRef);

  return {
    categoriesCount: seededCategories.length,
    productsCount: seededProducts.length,
    reviewsCount: reviewsWithProductRef.length,
    settingsSeeded: true,
  };
}
