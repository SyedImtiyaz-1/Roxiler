import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.rating.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@store-rating.com',
      address: '123 Admin Street, Tech City, TC 12345',
      passwordHash: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create store owners
  const storeOwner1Password = await bcrypt.hash('Owner123!', 10);
  const storeOwner1 = await prisma.user.create({
    data: {
      name: 'John Smith - Electronics Store Owner',
      email: 'john.smith@electronics.com',
      address: '456 Tech Avenue, Silicon Valley, CA 94025',
      passwordHash: storeOwner1Password,
      role: 'STORE_OWNER',
    },
  });

  const storeOwner2Password = await bcrypt.hash('Owner456!', 10);
  const storeOwner2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson - Fashion Boutique Owner',
      email: 'sarah.johnson@fashion.com',
      address: '789 Fashion Boulevard, Style District, NY 10001',
      passwordHash: storeOwner2Password,
      role: 'STORE_OWNER',
    },
  });

  const storeOwner3Password = await bcrypt.hash('Owner789!', 10);
  const storeOwner3 = await prisma.user.create({
    data: {
      name: 'Mike Wilson - Coffee Shop Owner',
      email: 'mike.wilson@coffee.com',
      address: '321 Brew Street, Coffee Corner, WA 98101',
      passwordHash: storeOwner3Password,
      role: 'STORE_OWNER',
    },
  });

  // Create normal users
  const user1Password = await bcrypt.hash('User123!', 10);
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Brown - Regular Customer',
      email: 'alice.brown@email.com',
      address: '111 Customer Lane, Shopping District, TX 75001',
      passwordHash: user1Password,
      role: 'NORMAL_USER',
    },
  });

  const user2Password = await bcrypt.hash('User456!', 10);
  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Davis - Tech Enthusiast',
      email: 'bob.davis@tech.com',
      address: '222 Tech Street, Innovation City, CA 90210',
      passwordHash: user2Password,
      role: 'NORMAL_USER',
    },
  });

  const user3Password = await bcrypt.hash('User789!', 10);
  const user3 = await prisma.user.create({
    data: {
      name: 'Carol White - Fashion Lover',
      email: 'carol.white@style.com',
      address: '333 Style Avenue, Fashion District, NY 10002',
      passwordHash: user3Password,
      role: 'NORMAL_USER',
    },
  });

  console.log('👥 Created users');

  // Create stores
  const electronicsStore = await prisma.store.create({
    data: {
      name: 'TechMart Electronics',
      address: '456 Tech Avenue, Silicon Valley, CA 94025',
      ownerId: storeOwner1.id,
    },
  });

  const fashionStore = await prisma.store.create({
    data: {
      name: 'Elegant Fashion Boutique',
      address: '789 Fashion Boulevard, Style District, NY 10001',
      ownerId: storeOwner2.id,
    },
  });

  const coffeeStore = await prisma.store.create({
    data: {
      name: 'Brew & Bean Coffee Shop',
      address: '321 Brew Street, Coffee Corner, WA 98101',
      ownerId: storeOwner3.id,
    },
  });

  const groceryStore = await prisma.store.create({
    data: {
      name: 'Fresh Market Grocery',
      address: '555 Fresh Lane, Market District, TX 75002',
      ownerId: storeOwner1.id,
    },
  });

  console.log('🏪 Created stores');

  // Create ratings
  const ratings = [
    // TechMart Electronics ratings
    { userId: user1.id, storeId: electronicsStore.id, ratingValue: 5 },
    { userId: user2.id, storeId: electronicsStore.id, ratingValue: 4 },
    { userId: user3.id, storeId: electronicsStore.id, ratingValue: 5 },

    // Elegant Fashion Boutique ratings
    { userId: user1.id, storeId: fashionStore.id, ratingValue: 4 },
    { userId: user2.id, storeId: fashionStore.id, ratingValue: 3 },
    { userId: user3.id, storeId: fashionStore.id, ratingValue: 5 },

    // Brew & Bean Coffee Shop ratings
    { userId: user1.id, storeId: coffeeStore.id, ratingValue: 5 },
    { userId: user2.id, storeId: coffeeStore.id, ratingValue: 4 },
    { userId: user3.id, storeId: coffeeStore.id, ratingValue: 4 },

    // Fresh Market Grocery ratings
    { userId: user1.id, storeId: groceryStore.id, ratingValue: 3 },
    { userId: user2.id, storeId: groceryStore.id, ratingValue: 4 },
    { userId: user3.id, storeId: groceryStore.id, ratingValue: 5 },
  ];

  for (const rating of ratings) {
    await prisma.rating.create({
      data: rating,
    });
  }

  console.log('⭐ Created ratings');

  console.log('\n✅ Database seeding completed!');
  console.log('\n📋 Sample Data Summary:');
  console.log(`👥 Users: ${await prisma.user.count()}`);
  console.log(`🏪 Stores: ${await prisma.store.count()}`);
  console.log(`⭐ Ratings: ${await prisma.rating.count()}`);

  console.log('\n🔑 Login Credentials:');
  console.log('Admin: admin@store-rating.com / Admin123!');
  console.log('Store Owner 1: john.smith@electronics.com / Owner123!');
  console.log('Store Owner 2: sarah.johnson@fashion.com / Owner456!');
  console.log('Store Owner 3: mike.wilson@coffee.com / Owner789!');
  console.log('User 1: alice.brown@email.com / User123!');
  console.log('User 2: bob.davis@tech.com / User456!');
  console.log('User 3: carol.white@style.com / User789!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 