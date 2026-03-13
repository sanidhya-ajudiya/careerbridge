import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected successfully via Sequelize');
    
    // Sync models
    // await sequelize.sync({ alter: true }); // We will do this in server.js or individually
  } catch (error) {
    console.error(`❌ Error connecting to MySQL: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;
