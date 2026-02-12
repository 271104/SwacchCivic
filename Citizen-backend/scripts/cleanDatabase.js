// scripts/cleanDatabase.js
// Script to clean all data from database for fresh testing

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smc_db';

async function cleanDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
    console.log(`📌 Database: ${mongoose.connection.name}`);

    console.log('\n🗑️  Deleting all data...');

    // Delete all data from collections
    const citizenResult = await mongoose.connection.db.collection('citizens').deleteMany({});
    console.log(`   Citizens deleted: ${citizenResult.deletedCount}`);

    const officerResult = await mongoose.connection.db.collection('officers').deleteMany({});
    console.log(`   Officers deleted: ${officerResult.deletedCount}`);

    const adminResult = await mongoose.connection.db.collection('admins').deleteMany({});
    console.log(`   Admins deleted: ${adminResult.deletedCount}`);

    const complaintResult = await mongoose.connection.db.collection('complaints').deleteMany({});
    console.log(`   Complaints deleted: ${complaintResult.deletedCount}`);

    const deptResult = await mongoose.connection.db.collection('departments').deleteMany({});
    console.log(`   Departments deleted: ${deptResult.deletedCount}`);

    console.log('\n✅ All data deleted successfully!');

    // Verify all collections are empty
    const citizenCount = await mongoose.connection.db.collection('citizens').countDocuments();
    const officerCount = await mongoose.connection.db.collection('officers').countDocuments();
    const adminCount = await mongoose.connection.db.collection('admins').countDocuments();
    const complaintCount = await mongoose.connection.db.collection('complaints').countDocuments();
    const deptCount = await mongoose.connection.db.collection('departments').countDocuments();

    console.log('\n📊 Database Status (After Cleanup):');
    console.log(`   Citizens: ${citizenCount}`);
    console.log(`   Officers: ${officerCount}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Complaints: ${complaintCount}`);
    console.log(`   Departments: ${deptCount}`);

    if (citizenCount === 0 && officerCount === 0 && adminCount === 0 && 
        complaintCount === 0 && deptCount === 0) {
      console.log('\n✅ Database is clean and ready for testing!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Run: node scripts/seedDepartments.js');
      console.log('   2. Run: node scripts/createAdmin.js');
      console.log('   3. Start testing!');
    } else {
      console.log('\n⚠️  Warning: Some data still exists!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the cleanup
cleanDatabase();
