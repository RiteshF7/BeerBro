const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
    databaseURL: "https://pleasebringmebooze-default-rtdb.firebaseio.com"
  });
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);
}

const db = admin.firestore();

// Indian Alcohol Products Data
const categories = [
  {
    id: 'whisky',
    name: 'Whisky',
    description: 'Premium Indian and international whisky brands',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    productCount: 0,
    isPopular: true
  },
  {
    id: 'rum',
    name: 'Rum',
    description: 'Dark, spiced, and white rums from India and around the world',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    productCount: 0,
    isPopular: true
  },
  {
    id: 'gin',
    name: 'Gin',
    description: 'Indian craft gins and premium international brands',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    productCount: 0,
    isPopular: false
  },
  {
    id: 'beer',
    name: 'Beer',
    description: 'Indian and international beer brands including craft varieties',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    productCount: 0,
    isPopular: true
  }
];

const products = [
  // WHISKY PRODUCTS
  // Mass-Market Leaders
  {
    name: 'Officer\'s Choice Whisky',
    description: 'One of the world\'s highest-selling whiskies by volume. Smooth and affordable.',
    price: 450,
    originalPrice: 500,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 50,
    inStock: true,
    rating: 4.2,
    reviewCount: 1250,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Officer\'s Choice',
    origin: 'India',
    tags: ['whisky', 'mass-market', 'affordable']
  },
  {
    name: 'McDowell\'s No.1 Whisky',
    description: 'Strong rural and urban reach with smooth taste and premium quality.',
    price: 520,
    originalPrice: 580,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 45,
    inStock: true,
    rating: 4.1,
    reviewCount: 980,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'McDowell\'s',
    origin: 'India',
    tags: ['whisky', 'mass-market', 'popular']
  },
  {
    name: 'Royal Stag Whisky',
    description: 'Popular among younger consumers with a smooth and contemporary taste.',
    price: 480,
    originalPrice: 520,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 60,
    inStock: true,
    rating: 4.3,
    reviewCount: 1100,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Royal Stag',
    origin: 'India',
    tags: ['whisky', 'youth', 'smooth']
  },
  {
    name: 'Imperial Blue Whisky',
    description: 'Affordable and widely available with consistent quality and taste.',
    price: 420,
    originalPrice: 460,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 55,
    inStock: true,
    rating: 4.0,
    reviewCount: 850,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Imperial Blue',
    origin: 'India',
    tags: ['whisky', 'affordable', 'consistent']
  },
  {
    name: 'Bagpiper Whisky',
    description: 'Legacy brand with deep distribution and traditional whisky taste.',
    price: 380,
    originalPrice: 420,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 40,
    inStock: true,
    rating: 3.9,
    reviewCount: 720,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Bagpiper',
    origin: 'India',
    tags: ['whisky', 'legacy', 'traditional']
  },
  {
    name: 'Director\'s Special Whisky',
    description: 'Budget-friendly and widely consumed with smooth finish.',
    price: 350,
    originalPrice: 390,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 35,
    inStock: true,
    rating: 3.8,
    reviewCount: 650,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Director\'s Special',
    origin: 'India',
    tags: ['whisky', 'budget', 'smooth']
  },
  // Premium & Semi-Premium
  {
    name: 'Blender\'s Pride Whisky',
    description: 'Smooth blend with urban appeal and premium quality.',
    price: 850,
    originalPrice: 950,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 30,
    inStock: true,
    rating: 4.5,
    reviewCount: 890,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Blender\'s Pride',
    origin: 'India',
    tags: ['whisky', 'premium', 'smooth']
  },
  {
    name: 'Antiquity Blue Whisky',
    description: 'Premium segment favorite with rich flavor and smooth finish.',
    price: 1200,
    originalPrice: 1350,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 25,
    inStock: true,
    rating: 4.6,
    reviewCount: 750,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Antiquity',
    origin: 'India',
    tags: ['whisky', 'premium', 'rich']
  },
  {
    name: 'Rockford Reserve Whisky',
    description: 'Mid-premium with a cult following and exceptional taste.',
    price: 950,
    originalPrice: 1050,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 20,
    inStock: true,
    rating: 4.4,
    reviewCount: 680,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Rockford',
    origin: 'India',
    tags: ['whisky', 'premium', 'cult']
  },
  {
    name: 'Signature Whisky',
    description: 'Known for its rich flavor profile and premium quality.',
    price: 1100,
    originalPrice: 1250,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 18,
    inStock: true,
    rating: 4.5,
    reviewCount: 620,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Signature',
    origin: 'India',
    tags: ['whisky', 'premium', 'rich']
  },
  // Single Malts & Craft
  {
    name: 'Amrut Fusion Single Malt',
    description: 'Internationally acclaimed Bangalore-based single malt whisky.',
    price: 4500,
    originalPrice: 5000,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 15,
    inStock: true,
    rating: 4.8,
    reviewCount: 450,
    isNew: true,
    isOnSale: true,
    alcoholContent: 50,
    volume: 750,
    brand: 'Amrut',
    origin: 'India',
    tags: ['whisky', 'single-malt', 'craft', 'premium']
  },
  {
    name: 'Paul John Single Malt',
    description: 'Goa-based globally respected single malt whisky.',
    price: 3800,
    originalPrice: 4200,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 12,
    inStock: true,
    rating: 4.7,
    reviewCount: 380,
    isNew: true,
    isOnSale: true,
    alcoholContent: 46,
    volume: 750,
    brand: 'Paul John',
    origin: 'India',
    tags: ['whisky', 'single-malt', 'craft', 'premium']
  },
  {
    name: 'Rampur Indian Single Malt',
    description: 'Premium North Indian single malt with exceptional character.',
    price: 5200,
    originalPrice: 5800,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 10,
    inStock: true,
    rating: 4.9,
    reviewCount: 320,
    isNew: true,
    isOnSale: true,
    alcoholContent: 43,
    volume: 750,
    brand: 'Rampur',
    origin: 'India',
    tags: ['whisky', 'single-malt', 'premium', 'north-india']
  },
  {
    name: 'Indri-Trini Triple Cask',
    description: 'New entrant with triple cask aging and premium quality.',
    price: 4800,
    originalPrice: 5300,
    category: 'whisky',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop',
    stockQuantity: 8,
    inStock: true,
    rating: 4.6,
    reviewCount: 280,
    isNew: true,
    isOnSale: true,
    alcoholContent: 46,
    volume: 750,
    brand: 'Indri',
    origin: 'India',
    tags: ['whisky', 'single-malt', 'triple-cask', 'new']
  },

  // RUM PRODUCTS
  // Dark & Spiced
  {
    name: 'Old Monk Rum',
    description: 'Cult classic with nostalgic appeal and rich dark rum taste.',
    price: 320,
    originalPrice: 360,
    category: 'rum',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    stockQuantity: 40,
    inStock: true,
    rating: 4.4,
    reviewCount: 1200,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Old Monk',
    origin: 'India',
    tags: ['rum', 'dark', 'cult', 'nostalgic']
  },
  {
    name: 'Captain Morgan Spiced Rum',
    description: 'Spiced rum with global popularity and smooth taste.',
    price: 1800,
    originalPrice: 2000,
    category: 'rum',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    stockQuantity: 25,
    inStock: true,
    rating: 4.3,
    reviewCount: 850,
    isNew: false,
    isOnSale: true,
    alcoholContent: 35,
    volume: 750,
    brand: 'Captain Morgan',
    origin: 'International',
    tags: ['rum', 'spiced', 'international', 'smooth']
  },
  {
    name: 'Contessa Rum',
    description: 'Popular among defense personnel with strong character.',
    price: 280,
    originalPrice: 320,
    category: 'rum',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    stockQuantity: 35,
    inStock: true,
    rating: 4.1,
    reviewCount: 650,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Contessa',
    origin: 'India',
    tags: ['rum', 'dark', 'defense', 'strong']
  },
  // White & Mixing Rums
  {
    name: 'McDowell\'s No.1 White Rum',
    description: 'Versatile and affordable white rum perfect for cocktails.',
    price: 450,
    originalPrice: 500,
    category: 'rum',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    stockQuantity: 30,
    inStock: true,
    rating: 4.0,
    reviewCount: 720,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'McDowell\'s',
    origin: 'India',
    tags: ['rum', 'white', 'versatile', 'cocktails']
  },
  {
    name: 'Bacardi White Rum',
    description: 'Ideal for cocktails and mixers with smooth taste.',
    price: 1200,
    originalPrice: 1350,
    category: 'rum',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=400&fit=crop',
    stockQuantity: 20,
    inStock: true,
    rating: 4.5,
    reviewCount: 950,
    isNew: false,
    isOnSale: true,
    alcoholContent: 40,
    volume: 750,
    brand: 'Bacardi',
    origin: 'International',
    tags: ['rum', 'white', 'international', 'cocktails']
  },

  // GIN PRODUCTS
  // Indian Craft Gins
  {
    name: 'Greater Than Gin',
    description: 'India\'s first craft gin, made in Goa with premium botanicals.',
    price: 2200,
    originalPrice: 2500,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 15,
    inStock: true,
    rating: 4.6,
    reviewCount: 420,
    isNew: true,
    isOnSale: true,
    alcoholContent: 43,
    volume: 750,
    brand: 'Greater Than',
    origin: 'India',
    tags: ['gin', 'craft', 'goa', 'first', 'premium']
  },
  {
    name: 'Hapusa Gin',
    description: 'Premium gin with Himalayan juniper and exotic botanicals.',
    price: 2800,
    originalPrice: 3200,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 12,
    inStock: true,
    rating: 4.7,
    reviewCount: 380,
    isNew: true,
    isOnSale: true,
    alcoholContent: 43,
    volume: 750,
    brand: 'Hapusa',
    origin: 'India',
    tags: ['gin', 'craft', 'himalayan', 'premium', 'exotic']
  },
  {
    name: 'Terai Gin',
    description: 'Botanical-forward gin made in Rajasthan with local ingredients.',
    price: 2400,
    originalPrice: 2700,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 10,
    inStock: true,
    rating: 4.5,
    reviewCount: 320,
    isNew: true,
    isOnSale: true,
    alcoholContent: 42,
    volume: 750,
    brand: 'Terai',
    origin: 'India',
    tags: ['gin', 'craft', 'rajasthan', 'botanical', 'local']
  },
  {
    name: 'Jaisalmer Indian Craft Gin',
    description: 'Luxury gin from Radico Khaitan with premium quality.',
    price: 3200,
    originalPrice: 3600,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 8,
    inStock: true,
    rating: 4.8,
    reviewCount: 280,
    isNew: true,
    isOnSale: true,
    alcoholContent: 43,
    volume: 750,
    brand: 'Jaisalmer',
    origin: 'India',
    tags: ['gin', 'craft', 'luxury', 'premium', 'radico']
  },
  // Legacy & Imported
  {
    name: 'Blue Riband Gin',
    description: 'Budget-friendly legacy brand with classic gin taste.',
    price: 450,
    originalPrice: 500,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 25,
    inStock: true,
    rating: 3.8,
    reviewCount: 580,
    isNew: false,
    isOnSale: true,
    alcoholContent: 42.8,
    volume: 750,
    brand: 'Blue Riband',
    origin: 'India',
    tags: ['gin', 'legacy', 'budget', 'classic']
  },
  {
    name: 'Bombay Sapphire Gin',
    description: 'Premium imported gin with distinctive blue bottle.',
    price: 1800,
    originalPrice: 2000,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 18,
    inStock: true,
    rating: 4.4,
    reviewCount: 750,
    isNew: false,
    isOnSale: true,
    alcoholContent: 40,
    volume: 750,
    brand: 'Bombay Sapphire',
    origin: 'International',
    tags: ['gin', 'imported', 'premium', 'distinctive']
  },
  {
    name: 'Tanqueray Gin',
    description: 'Popular in upscale bars with premium quality.',
    price: 2200,
    originalPrice: 2500,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 15,
    inStock: true,
    rating: 4.5,
    reviewCount: 680,
    isNew: false,
    isOnSale: true,
    alcoholContent: 43.1,
    volume: 750,
    brand: 'Tanqueray',
    origin: 'International',
    tags: ['gin', 'imported', 'premium', 'upscale']
  },
  {
    name: 'Beefeater Gin',
    description: 'Classic London dry gin with traditional taste.',
    price: 1600,
    originalPrice: 1800,
    category: 'gin',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 20,
    inStock: true,
    rating: 4.3,
    reviewCount: 620,
    isNew: false,
    isOnSale: true,
    alcoholContent: 40,
    volume: 750,
    brand: 'Beefeater',
    origin: 'International',
    tags: ['gin', 'imported', 'london-dry', 'classic']
  },

  // BEER PRODUCTS
  // Mass-Market & Premium
  {
    name: 'Kingfisher Premium Beer',
    description: 'Market leader with strong brand recall and refreshing taste.',
    price: 120,
    originalPrice: 140,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 100,
    inStock: true,
    rating: 4.2,
    reviewCount: 2500,
    isNew: false,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Kingfisher',
    origin: 'India',
    tags: ['beer', 'premium', 'market-leader', 'refreshing']
  },
  {
    name: 'Kingfisher Strong Beer',
    description: 'Stronger version of the popular Kingfisher brand.',
    price: 130,
    originalPrice: 150,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 80,
    inStock: true,
    rating: 4.1,
    reviewCount: 1800,
    isNew: false,
    isOnSale: true,
    alcoholContent: 8,
    volume: 650,
    brand: 'Kingfisher',
    origin: 'India',
    tags: ['beer', 'strong', 'popular', 'refreshing']
  },
  {
    name: 'Budweiser India Beer',
    description: 'Premium positioning with strong marketing and smooth taste.',
    price: 150,
    originalPrice: 170,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 60,
    inStock: true,
    rating: 4.3,
    reviewCount: 1200,
    isNew: false,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Budweiser',
    origin: 'International',
    tags: ['beer', 'premium', 'international', 'smooth']
  },
  {
    name: 'Tuborg Beer',
    description: 'Light lager popular in North India with crisp taste.',
    price: 110,
    originalPrice: 130,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 70,
    inStock: true,
    rating: 4.0,
    reviewCount: 950,
    isNew: false,
    isOnSale: true,
    alcoholContent: 4.6,
    volume: 650,
    brand: 'Tuborg',
    origin: 'International',
    tags: ['beer', 'light', 'lager', 'crisp']
  },
  {
    name: 'Carlsberg Beer',
    description: 'Premium European lager with smooth and refreshing taste.',
    price: 140,
    originalPrice: 160,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 50,
    inStock: true,
    rating: 4.2,
    reviewCount: 1100,
    isNew: false,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Carlsberg',
    origin: 'International',
    tags: ['beer', 'premium', 'european', 'smooth']
  },
  {
    name: 'Heineken Beer',
    description: 'Upscale international brand with distinctive taste.',
    price: 180,
    originalPrice: 200,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 40,
    inStock: true,
    rating: 4.4,
    reviewCount: 850,
    isNew: false,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Heineken',
    origin: 'International',
    tags: ['beer', 'upscale', 'international', 'distinctive']
  },
  // Indian Craft & Urban Favorites
  {
    name: 'Bira 91 White Beer',
    description: 'Urban craft beer with strong millennial appeal and wheat taste.',
    price: 200,
    originalPrice: 220,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 35,
    inStock: true,
    rating: 4.5,
    reviewCount: 680,
    isNew: true,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Bira 91',
    origin: 'India',
    tags: ['beer', 'craft', 'urban', 'millennial', 'wheat']
  },
  {
    name: 'Bira 91 Blonde Beer',
    description: 'Craft blonde beer with smooth and refreshing taste.',
    price: 190,
    originalPrice: 210,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 30,
    inStock: true,
    rating: 4.4,
    reviewCount: 620,
    isNew: true,
    isOnSale: true,
    alcoholContent: 4.5,
    volume: 650,
    brand: 'Bira 91',
    origin: 'India',
    tags: ['beer', 'craft', 'blonde', 'smooth']
  },
  {
    name: 'Simba Craft Beer',
    description: 'Craft beer from Madhya Pradesh with local ingredients.',
    price: 170,
    originalPrice: 190,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 25,
    inStock: true,
    rating: 4.3,
    reviewCount: 480,
    isNew: true,
    isOnSale: true,
    alcoholContent: 5.2,
    volume: 650,
    brand: 'Simba',
    origin: 'India',
    tags: ['beer', 'craft', 'madhya-pradesh', 'local']
  },
  {
    name: 'White Owl Beer',
    description: 'Mumbai-based craft brewery with premium quality.',
    price: 160,
    originalPrice: 180,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 20,
    inStock: true,
    rating: 4.2,
    reviewCount: 420,
    isNew: true,
    isOnSale: true,
    alcoholContent: 4.8,
    volume: 650,
    brand: 'White Owl',
    origin: 'India',
    tags: ['beer', 'craft', 'mumbai', 'premium']
  },
  {
    name: 'BeeYoung Beer',
    description: 'Rising star in North India with refreshing taste.',
    price: 140,
    originalPrice: 160,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 30,
    inStock: true,
    rating: 4.1,
    reviewCount: 380,
    isNew: true,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'BeeYoung',
    origin: 'India',
    tags: ['beer', 'craft', 'north-india', 'refreshing']
  },
  {
    name: 'Geist Beer',
    description: 'Bangalore-based craft brewery with innovative flavors.',
    price: 180,
    originalPrice: 200,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 18,
    inStock: true,
    rating: 4.4,
    reviewCount: 350,
    isNew: true,
    isOnSale: true,
    alcoholContent: 5.5,
    volume: 650,
    brand: 'Geist',
    origin: 'India',
    tags: ['beer', 'craft', 'bangalore', 'innovative']
  },
  {
    name: 'Susegado Beer',
    description: 'Goa\'s laid-back craft beer with tropical vibes.',
    price: 200,
    originalPrice: 220,
    category: 'beer',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=400&fit=crop',
    stockQuantity: 15,
    inStock: true,
    rating: 4.6,
    reviewCount: 320,
    isNew: true,
    isOnSale: true,
    alcoholContent: 5,
    volume: 650,
    brand: 'Susegado',
    origin: 'India',
    tags: ['beer', 'craft', 'goa', 'tropical', 'laid-back']
  }
];

async function clearExistingData() {
  console.log('🗑️ Clearing existing products and categories...');
  
  try {
    // Clear products
    const productsSnapshot = await db.collection('products').get();
    const productBatch = db.batch();
    productsSnapshot.docs.forEach(doc => {
      productBatch.delete(doc.ref);
    });
    await productBatch.commit();
    console.log(`✅ Deleted ${productsSnapshot.docs.length} existing products`);

    // Clear categories
    const categoriesSnapshot = await db.collection('categories').get();
    const categoryBatch = db.batch();
    categoriesSnapshot.docs.forEach(doc => {
      categoryBatch.delete(doc.ref);
    });
    await categoryBatch.commit();
    console.log(`✅ Deleted ${categoriesSnapshot.docs.length} existing categories`);
  } catch (error) {
    console.error('❌ Error clearing existing data:', error);
    throw error;
  }
}

async function createCategories() {
  console.log('📁 Creating categories...');
  
  try {
    const batch = db.batch();
    
    categories.forEach(category => {
      const categoryRef = db.collection('categories').doc(category.id);
      batch.set(categoryRef, {
        ...category,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`✅ Created ${categories.length} categories`);
  } catch (error) {
    console.error('❌ Error creating categories:', error);
    throw error;
  }
}

async function createProducts() {
  console.log('🍺 Creating products...');
  
  try {
    const batch = db.batch();
    
    products.forEach(product => {
      const productRef = db.collection('products').doc();
      batch.set(productRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log(`✅ Created ${products.length} products`);
  } catch (error) {
    console.error('❌ Error creating products:', error);
    throw error;
  }
}

async function updateCategoryCounts() {
  console.log('📊 Updating category product counts...');
  
  try {
    const categoryCounts = {};
    
    // Count products per category
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    // Update category documents
    const batch = db.batch();
    Object.entries(categoryCounts).forEach(([categoryId, count]) => {
      const categoryRef = db.collection('categories').doc(categoryId);
      batch.update(categoryRef, {
        productCount: count,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log('✅ Updated category product counts');
  } catch (error) {
    console.error('❌ Error updating category counts:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('🚀 Starting Indian Alcohol Products Population...');
    
    await clearExistingData();
    await createCategories();
    await createProducts();
    await updateCategoryCounts();
    
    console.log('🎉 Successfully populated database with Indian alcohol products!');
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Products: ${products.length}`);
    console.log(`   - Whisky: ${products.filter(p => p.category === 'whisky').length}`);
    console.log(`   - Rum: ${products.filter(p => p.category === 'rum').length}`);
    console.log(`   - Gin: ${products.filter(p => p.category === 'gin').length}`);
    console.log(`   - Beer: ${products.filter(p => p.category === 'beer').length}`);
    
  } catch (error) {
    console.error('❌ Error in main process:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
