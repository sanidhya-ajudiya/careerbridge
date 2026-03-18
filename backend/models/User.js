import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a name' }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Please provide an email' }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 100],
        msg: 'Password must be at least 6 characters'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('jobseeker', 'employer', 'admin'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['jobseeker', 'employer', 'admin']],
        msg: 'Please specify role'
      }
    }
  },
  // Job Seeker specific fields
  phone: {
    type: DataTypes.STRING,
    allowNull: true // Logic for conditional required handled in controller or custom validator
  },
  resume: {
    type: DataTypes.STRING,
    defaultValue: null
  },
  skills: {
    type: DataTypes.JSON, // Storing arrays as JSON for simplicity in MySQL
    defaultValue: []
  },
  experience: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  // Employer specific fields
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyDescription: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  website: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  timestamps: true
});

// Compare password method
User.prototype.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User;
