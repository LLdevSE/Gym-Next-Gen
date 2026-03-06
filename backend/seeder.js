const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const CoachProfile = require('./models/CoachProfile');
const Product = require('./models/Product');
const Booking = require('./models/Booking');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // 1. CLEAR COLLECTIONS
    await User.deleteMany();
    await CoachProfile.deleteMany();
    await Product.deleteMany();
    await Booking.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin123', salt);
    const coachPassword = await bcrypt.hash('Coach123', salt);

    // 2. SEED ADMIN
    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@gymnextgen.com',
      password: hashedPassword,
      role: 'Admin',
    });
    await adminUser.save();

    // 3. SEED ML-READY COACHES
    const coaches = [
      {
        name: 'Marcus "The Mountain" Vance',
        email: 'marcus@gymnextgen.com',
        spec: 'Strength',
        bio: 'Former strongman competitor specializing in absolute power, hypertrophic scaling, and Advanced Strength & Power protocols.',
        img: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Elena Rostova',
        email: 'elena@gymnextgen.com',
        spec: 'Yoga',
        bio: 'Master of mobility and breathwork. Essential for active recovery, flexibility, and foundational biomechanics.',
        img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Jax "Viper" Toretto',
        email: 'jax@gymnextgen.com',
        spec: 'CrossFit',
        bio: 'High-octane CrossFit athlete. I will push your cardiovascular threshold and functional conditioning to the absolute limit.',
        img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200&auto=format&fit=crop'
      },
      {
        name: 'Sarah Chen',
        email: 'sarah@gymnextgen.com',
        spec: 'HIIT',
        bio: 'Specialist in High-Intensity Interval Training. Fat-loss optimization through extreme metabolic conditioning.',
        img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200&auto=format&fit=crop'
      }
    ];

    for (const c of coaches) {
       const user = await User.create({
          name: c.name,
          email: c.email,
          password: coachPassword,
          role: 'Coach',
          profileImage: c.img
       });

       await CoachProfile.create({
          user: user._id,
          specialization: c.spec,
          bio: c.bio,
          availableSessions: ['Morning', 'Evening']
       });
    }

    // 4. SEED STORE PRODUCTS
    const storeProducts = [
      {
         name: 'NextGen Pre-Workout Supernova',
         category: 'Supplement',
         price: 45.99,
         stock: 120,
         imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=500&auto=format&fit=crop',
         description: 'Advanced thermogenic pre-workout complex designed to ignite your metabolism and tunnel your focus.'
      },
      {
         name: '100% Isolate Hydro-Whey (Vanilla)',
         category: 'Supplement',
         price: 65.00,
         stock: 85,
         imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=500&auto=format&fit=crop',
         description: 'Rapid-absorption protein matrix for immediate post-workout recovery and muscle protein synthesis.'
      },
      {
         name: 'Onyx Elite Lifting Belt',
         category: 'Equipment',
         price: 89.95,
         stock: 30,
         imageUrl: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=500&auto=format&fit=crop',
         description: 'Premium leather powerlifting belt with a quick-release lever. Unmatched core stability for heavy lifts.'
      },
      {
         name: 'Hexagon Dumbbell Set (Pair, 25kg)',
         category: 'Equipment',
         price: 150.00,
         stock: 15,
         imageUrl: 'https://images.unsplash.com/photo-1583454122781-806443c72635?q=80&w=500&auto=format&fit=crop',
         description: 'Commercial-grade rubber encased hex dumbbells. Engineered for durability and reduced noise.'
      },
      {
         name: 'NextGen Compression Sleeves',
         category: 'Apparel',
         price: 24.50,
         stock: 200,
         imageUrl: 'https://images.unsplash.com/photo-1616683696767-466fa86ab48d?q=80&w=500&auto=format&fit=crop',
         description: 'Targeted joint compression technology for knees and elbows to maintain warmth and reduce fatigue.'
      },
      {
         name: 'Cyber-Core Stealth Hoodie',
         category: 'Apparel',
         price: 55.00,
         stock: 50,
         imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=500&auto=format&fit=crop',
         description: 'Breathable, sweat-wicking training hoodie. Features a tailored athletic fit and subtle reflective branding.'
      }
    ];

    await Product.insertMany(storeProducts);

    console.log('--- DATABASE SUCCESSFULLY SEEDED ---');
    console.log('1x Admin inserted');
    console.log('4x ML-Ready Coaches inserted');
    console.log('6x Store Products inserted');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

seedData();
