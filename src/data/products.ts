export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  inStock: boolean;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

export const categories = [
  { id: 'tvs', name: 'TVs & Entertainment', icon: 'Tv' },
  { id: 'refrigerators', name: 'Refrigerators', icon: 'Refrigerator' },
  { id: 'washing-machines', name: 'Washing Machines', icon: 'WashingMachine' },
  { id: 'sound-systems', name: 'Sound Systems', icon: 'Speaker' },
  { id: 'cooking', name: 'Cooking Appliances', icon: 'ChefHat' },
  { id: 'irons', name: 'Irons & Garment Care', icon: 'Iron' },
  { id: 'other', name: 'Other Electronics', icon: 'Zap' },
];

export const products: Product[] = [
  // TVs & Entertainment
  {
    id: 'tv-samsung-55',
    name: 'Samsung 55" 4K UHD Smart TV',
    price: 85000,
    originalPrice: 95000,
    image: '/api/placeholder/400/300',
    category: 'tvs',
    brand: 'Samsung',
    description: 'Experience stunning 4K UHD picture quality with this Samsung Smart TV featuring Crystal Processor 4K and smart connectivity.',
    specifications: {
      'Screen Size': '55 inches',
      'Resolution': '4K UHD (3840 x 2160)',
      'Smart TV': 'Yes - Tizen OS',
      'HDR': 'HDR10+',
      'Connectivity': 'WiFi, Bluetooth, 3x HDMI, 2x USB',
    },
    features: ['Crystal Processor 4K', 'Smart TV with Apps', 'Voice Control', 'Game Mode'],
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
    isFeatured: true,
    discount: 11,
  },
  {
    id: 'tv-lg-43',
    name: 'LG 43" Full HD Smart TV',
    price: 45000,
    image: '/api/placeholder/400/300',
    category: 'tvs',
    brand: 'LG',
    description: 'Affordable Full HD Smart TV with webOS platform and built-in streaming apps.',
    specifications: {
      'Screen Size': '43 inches',
      'Resolution': 'Full HD (1920 x 1080)',
      'Smart TV': 'Yes - webOS',
      'Connectivity': 'WiFi, 2x HDMI, 1x USB',
    },
    features: ['webOS Smart Platform', 'Built-in WiFi', 'Energy Efficient', 'Slim Design'],
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
  },

  // Refrigerators
  {
    id: 'fridge-samsung-double',
    name: 'Samsung Double Door Refrigerator 350L',
    price: 125000,
    originalPrice: 140000,
    image: '/api/placeholder/400/300',
    category: 'refrigerators',
    brand: 'Samsung',
    description: 'Spacious double door refrigerator with digital inverter technology and frost-free cooling.',
    specifications: {
      'Capacity': '350 Liters',
      'Type': 'Double Door',
      'Energy Rating': '3 Star',
      'Cooling Technology': 'Frost Free',
      'Warranty': '2 Years Comprehensive',
    },
    features: ['Digital Inverter', 'Frost Free', 'LED Lighting', 'Vegetable Box'],
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
    isFeatured: true,
    discount: 11,
  },
  {
    id: 'fridge-lg-single',
    name: 'LG Single Door Refrigerator 190L',
    price: 55000,
    image: '/api/placeholder/400/300',
    category: 'refrigerators',
    brand: 'LG',
    description: 'Compact single door refrigerator perfect for small families with efficient cooling.',
    specifications: {
      'Capacity': '190 Liters',
      'Type': 'Single Door',
      'Energy Rating': '4 Star',
      'Cooling Technology': 'Direct Cool',
      'Warranty': '1 Year Comprehensive',
    },
    features: ['Smart Inverter', 'Toughened Glass', 'Anti-bacterial Gasket', 'Stabilizer Free'],
    inStock: true,
    rating: 4.3,
    reviewCount: 67,
  },

  // Washing Machines
  {
    id: 'washer-lg-7kg',
    name: 'LG 7kg Front Load Washing Machine',
    price: 85000,
    originalPrice: 95000,
    image: '/api/placeholder/400/300',
    category: 'washing-machines',
    brand: 'LG',
    description: 'Energy efficient front load washing machine with steam wash and AI DD technology.',
    specifications: {
      'Capacity': '7 kg',
      'Type': 'Front Load',
      'Energy Rating': '5 Star',
      'Spin Speed': '1000 RPM',
      'Warranty': '2 Years Comprehensive',
    },
    features: ['AI Direct Drive', 'Steam Wash', 'Smart Diagnosis', '14 Wash Programs'],
    inStock: true,
    rating: 4.7,
    reviewCount: 203,
    isFeatured: true,
    discount: 11,
  },
  {
    id: 'washer-samsung-top',
    name: 'Samsung 8kg Top Load Washing Machine',
    price: 65000,
    image: '/api/placeholder/400/300',
    category: 'washing-machines',
    brand: 'Samsung',
    description: 'High capacity top load washer with digital inverter motor and magic dispenser.',
    specifications: {
      'Capacity': '8 kg',
      'Type': 'Top Load',
      'Energy Rating': '4 Star',
      'Spin Speed': '700 RPM',
      'Warranty': '2 Years Comprehensive',
    },
    features: ['Digital Inverter Motor', 'Magic Dispenser', 'Wobble Technology', 'Smart Check'],
    inStock: true,
    rating: 4.4,
    reviewCount: 142,
  },

  // Sound Systems
  {
    id: 'speaker-jbl-party',
    name: 'JBL PartyBox 310 Bluetooth Speaker',
    price: 75000,
    originalPrice: 85000,
    image: '/api/placeholder/400/300',
    category: 'sound-systems',
    brand: 'JBL',
    description: 'Powerful portable party speaker with LED lights and wireless microphone capability.',
    specifications: {
      'Power Output': '240W RMS',
      'Battery Life': '18 hours',
      'Connectivity': 'Bluetooth 5.1, USB, AUX',
      'Features': 'LED Light Show, IPX4 Splash Proof',
      'Warranty': '1 Year',
    },
    features: ['LED Light Show', 'Wireless Mic Ready', 'True Wireless Stereo', 'Power Bank Function'],
    inStock: true,
    rating: 4.8,
    reviewCount: 91,
    discount: 12,
  },
  {
    id: 'soundbar-samsung',
    name: 'Samsung 2.1Ch Soundbar with Subwoofer',
    price: 35000,
    image: '/api/placeholder/400/300',
    category: 'sound-systems',
    brand: 'Samsung',
    description: 'Enhance your TV audio with this 2.1 channel soundbar featuring wireless subwoofer.',
    specifications: {
      'Channels': '2.1 Channel',
      'Power Output': '130W',
      'Connectivity': 'Bluetooth, HDMI ARC, Optical',
      'Subwoofer': 'Wireless',
      'Warranty': '1 Year',
    },
    features: ['Wireless Subwoofer', 'Game Mode', 'Night Mode', 'One Remote Control'],
    inStock: true,
    rating: 4.5,
    reviewCount: 76,
  },

  // Cooking Appliances
  {
    id: 'microwave-lg-solo',
    name: 'LG 28L Solo Microwave Oven',
    price: 25000,
    image: '/api/placeholder/400/300',
    category: 'cooking',
    brand: 'LG',
    description: 'Spacious solo microwave oven with auto cook menus and energy saving features.',
    specifications: {
      'Capacity': '28 Liters',
      'Type': 'Solo Microwave',
      'Power': '900 Watts',
      'Control': 'Touch Panel',
      'Warranty': '1 Year Comprehensive',
    },
    features: ['Auto Cook Menus', 'Child Lock', 'LED Display', 'Energy Saver'],
    inStock: true,
    rating: 4.3,
    reviewCount: 54,
  },
  {
    id: 'gas-cooker-double',
    name: 'Double Burner Gas Cooker with Oven',
    price: 45000,
    originalPrice: 50000,
    image: '/api/placeholder/400/300',
    category: 'cooking',
    brand: 'Generic',
    description: 'Efficient double burner gas cooker with spacious oven for all your cooking needs.',
    specifications: {
      'Burners': '2 Gas Burners',
      'Oven': 'Yes - Gas Oven',
      'Material': 'Stainless Steel',
      'Ignition': 'Auto Ignition',
      'Warranty': '1 Year',
    },
    features: ['Auto Ignition', 'Oven with Grill', 'Easy Clean Surface', 'Safety Valves'],
    inStock: true,
    rating: 4.1,
    reviewCount: 38,
    discount: 10,
  },

  // Irons
  {
    id: 'iron-philips-steam',
    name: 'Philips Steam Iron 2400W',
    price: 8500,
    originalPrice: 10000,
    image: '/api/placeholder/400/300',
    category: 'irons',
    brand: 'Philips',
    description: 'Powerful steam iron with ceramic soleplate for smooth gliding and wrinkle removal.',
    specifications: {
      'Power': '2400 Watts',
      'Soleplate': 'Ceramic',
      'Steam Output': '40g/min',
      'Water Tank': '300ml',
      'Warranty': '2 Years',
    },
    features: ['Ceramic Soleplate', 'Vertical Steam', 'Anti-Calc', 'Drip Stop'],
    inStock: true,
    rating: 4.4,
    reviewCount: 123,
    discount: 15,
  },

  // Other Electronics
  {
    id: 'fan-ceiling-remote',
    name: 'Remote Control Ceiling Fan 56"',
    price: 18000,
    image: '/api/placeholder/400/300',
    category: 'other',
    brand: 'Generic',
    description: 'Energy efficient ceiling fan with remote control and LED lighting.',
    specifications: {
      'Size': '56 inches',
      'Speeds': '3 Speed Control',
      'Control': 'Remote Control',
      'Lighting': 'LED Light',
      'Warranty': '1 Year Motor',
    },
    features: ['Remote Control', 'LED Lighting', 'Reverse Function', 'Energy Efficient'],
    inStock: true,
    rating: 4.0,
    reviewCount: 45,
    isNew: true,
  },
];

export const featuredProducts = products.filter(product => product.isFeatured);

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
