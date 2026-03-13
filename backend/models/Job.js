import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a job title' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a job description' }
    }
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide qualifications' }
    }
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide responsibilities' }
    }
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Internship', 'Remote', 'hybrid'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Full-time', 'Part-time', 'Internship', 'Remote', 'hybrid']],
        msg: 'Please specify job type'
      }
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide location' }
    }
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  employerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  applicationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  indexes: [
    {
      type: 'FULLTEXT',
      name: 'job_search_index',
      fields: ['title', 'description', 'location']
    }
  ]
});

// Associations
Job.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
User.hasMany(Job, { foreignKey: 'employerId' });

export default Job;
