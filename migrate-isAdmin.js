const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./model/user.js');
require('dotenv').config();

const url = process.env.ATLAS_URI;

async function migrateIsAdmin() {
    try {
        await mongoose.connect(url);
        console.log('Connected to MongoDB');

        // Step 1: Update all existing users to have isAdmin = false
        const updateResult = await User.updateMany(
            { isAdmin: { $exists: false } },
            { $set: { isAdmin: false } }
        );
        console.log(`Updated ${updateResult.modifiedCount} users with isAdmin: false`);

        // Step 2: Create admin account with encrypted password
        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (existingAdmin) {
            console.log('Admin account already exists');
        } else {
            const hashedPassword = await bcrypt.hash('admin', 10);
            
            const adminUser = new User({
                username: 'admin',
                email: 'admin@system.local',
                phoneNumber: '0000000000',
                password: hashedPassword,
                avatar: '',
                imageCerti: [],
                description: [],
                userTopicSkill: [],
                learnTopicSkill: [],
                skill: [],
                rankElo: 0,
                isDelete: false,
                isAdmin: true
            });

            await adminUser.save();
            console.log('Admin account created successfully with encrypted password');
        }

        await mongoose.connection.close();
        console.log('Migration completed successfully');
        process.exit(0);

    } catch (error) {
        console.error('Migration failed:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

migrateIsAdmin();
