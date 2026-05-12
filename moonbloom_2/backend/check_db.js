const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/moonbloom');
  console.log('Connected to MongoDB');
  const db = mongoose.connection.db;
  const cycles = await db.collection('cycles').find({}).toArray();
  console.log('Cycles in DB:', cycles);
  process.exit(0);
}

run().catch(console.error);
