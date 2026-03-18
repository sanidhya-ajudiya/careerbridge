import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Job from './Job.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Job,
      key: 'id'
    }
  },
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    defaultValue: 'Pending'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  offerLetter: {
    type: DataTypes.JSON,
    defaultValue: {
      content: '',
      sentAt: null,
      status: 'Sent',
      salary: '',
      joiningDate: null
    }
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'applicantId']
    }
  ]
});

// Associations
Application.belongsTo(Job, { foreignKey: 'jobId' });
Job.hasMany(Application, { foreignKey: 'jobId' });

Application.belongsTo(User, { as: 'applicant', foreignKey: 'applicantId' });
User.hasMany(Application, { foreignKey: 'applicantId' });

export default Application;
