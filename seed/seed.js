require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Station = require('../models/Station');
const Admin = require('../models/Admin');
const Announcement = require('../models/Announcement');

const stations = [
  { name: 'Central Station', line: 'Blue Line', order: 1 },
  { name: 'Park Street', line: 'Blue Line', order: 2 },
  { name: 'City Center', line: 'Green Line', order: 1 },
  { name: 'University', line: 'Green Line', order: 2 },
  { name: 'Riverside', line: 'Red Line', order: 1 },
  { name: 'Downtown', line: 'Red Line', order: 2 },
];

const seed = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is required');
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Announcement.deleteMany({});
  await Station.deleteMany({});
  const insertedStations = await Station.insertMany(stations);

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  const admin = await Admin.findOneAndUpdate(
    { email: process.env.ADMIN_EMAIL.toLowerCase().trim() },
    { email: process.env.ADMIN_EMAIL.toLowerCase().trim(), passwordHash, role: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seeded ${insertedStations.length} metro stations`);
  console.log(`Admin account seeded: ${admin.email}`);
  console.log('Admin password stored as a bcrypt hash.');

  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error(`Seed failed: ${err.message}`);
  process.exit(1);
});
