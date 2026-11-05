import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const CURATED_ITEMS = [
  {
    name: 'Chicken Roast',
    description: 'Crispy golden oven-roasted chicken glazed with roasted spices, garlic, fresh herbs, and a subtle lemon zest.',
    price: 320,
    image: '/food-chicken-roast.jpg',
    category: 'starters',
    fileId: 'curated-starter-chicken-roast',
  },
  {
    name: 'Chicken White Sauce Pasta',
    description: 'Al dente penne pasta bathed in rich velvety garlic white sauce with tender grilled chicken slices and grated parmesan.',
    price: 350,
    image: '/food-white-sauce-pasta.jpg',
    category: 'starters',
    fileId: 'curated-starter-white-sauce-pasta',
  },
  {
    name: "Momo's Chicken Corn",
    description: 'Steamed Himalayan dumplings packed with juicy minced chicken, sweet golden corn, and herbs, served with spicy chili-sesame dip.',
    price: 240,
    image: '/food-chicken-corn-momos.jpg',
    category: 'starters',
    fileId: 'curated-starter-chicken-corn-momos',
  },
  {
    name: 'Black Forest Cake',
    description: 'Classic layered chocolate sponge infused with rich cherry compote, fresh chantilly cream, and dark chocolate curls.',
    price: 220,
    image: '/food-black-forest-cake.jpg',
    category: 'desserts',
    fileId: 'curated-dessert-black-forest-cake',
  },
  {
    name: 'Red Velvet Cake',
    description: 'Silky crimson cocoa sponge layered with luscious Madagascar vanilla cream cheese frosting and fine velvet crumb dust.',
    price: 240,
    image: '/food-red-velvet-cake.jpg',
    category: 'desserts',
    fileId: 'curated-dessert-red-velvet-cake',
  },
  {
    name: 'Lime Lemon Mojito',
    description: 'Refreshing muddled fresh mint, zesty lime wedges, sparkling soda, and crushed ice with a touch of raw cane sweetness.',
    price: 160,
    image: '/food-lime-lemon-mojito.jpg',
    category: 'beverages',
    fileId: 'curated-beverage-lime-lemon-mojito',
  },
  {
    name: 'Mix Fruit Juice with Smashed Kiwi',
    description: 'Freshly cold-pressed tropical fruits layered over freshly smashed ripe kiwi pulp and crushed ice for a zesty, vitamin-rich booster.',
    price: 190,
    image: '/food-mix-fruit-kiwi.jpg',
    category: 'beverages',
    fileId: 'curated-beverage-mix-fruit-kiwi',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'restaurantDB' });
  const db = mongoose.connection.db;

  const restaurant = await db.collection('restaurants').findOne({});
  if (!restaurant) {
    console.error('No restaurant found');
    process.exit(1);
  }

  console.log(`Using restaurant: ${restaurant.name} (${restaurant._id})`);

  // Update existing foods without category to 'main'
  await db.collection('foods').updateMany(
    { category: { $exists: false } },
    { $set: { category: 'main' } }
  );

  for (const item of CURATED_ITEMS) {
    const existing = await db.collection('foods').findOne({
      name: { $regex: new RegExp(`^${item.name}$`, 'i') },
      restaurant: restaurant._id,
    });

    if (existing) {
      console.log(`Item already exists: ${item.name}`);
      await db.collection('foods').updateOne(
        { _id: existing._id },
        { $set: { category: item.category, image: item.image, price: item.price } }
      );
    } else {
      const doc = {
        ...item,
        restaurant: restaurant._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection('foods').insertOne(doc);
      console.log(`Inserted: ${item.name} (${item.category})`);
    }
  }

  const allFoods = await db.collection('foods').find({ restaurant: restaurant._id }).toArray();
  console.log(`Total foods in DB now: ${allFoods.length}`);
  allFoods.forEach(f => console.log(` - [${f.category}] ${f.name} (₹${f.price})`));

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});

