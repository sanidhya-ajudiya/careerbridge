import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB, { sequelize } from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await connectDB();
        
        // Sync models
        await sequelize.sync({ alter: true });

        let admin = await User.findOne({ where: { email: 'admin@example.com' } });

        if (admin) {
            console.log('⚠️  Admin user already exists, updating password...');
            admin.password = 'password123';
            admin.name = 'Super Admin';
            admin.role = 'admin';
            admin.phone = '1234567890';
            admin.companyName = 'Admin Corp';
            await admin.save();
            console.log('✅ Admin user updated successfully');
        } else {
            admin = await User.create({
                name: 'Super Admin',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
                phone: '1234567890', 
                companyName: 'Admin Corp' 
            });
            console.log('✅ Admin user created successfully');
        }

        console.log('✅ Admin user setup finished');
        console.log('Email: admin@example.com');
        console.log('Password: password123');
        
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
