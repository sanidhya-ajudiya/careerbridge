import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { sequelize } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Import models to ensure they are registered with Sequelize
import './models/User.js';
import './models/Job.js';
import './models/Application.js';
import './models/Message.js';
import './models/Notification.js';

// Load env vars
dotenv.config();

// Connect to database and sync
const startServer = async () => {
    try {
        await connectDB();
        
        // Sync all models
        await sequelize.sync({ alter: true });
        console.log('✅ Database models synchronized');

        const app = express();

        // Get __dirname in ES modules
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Serve uploaded files statically
        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/jobs', jobRoutes);
        app.use('/api/applications', applicationRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/notifications', notificationRoutes);

        // Root route
        app.get('/', (req, res) => {
          res.json({ message: 'Job Portal API is running with MySQL...' });
        });

        // Error handling middleware
        app.use((err, req, res, next) => {
          console.error(err.stack);
          res.status(500).json({ message: 'Something went wrong!', error: err.message });
        });

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
          console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
