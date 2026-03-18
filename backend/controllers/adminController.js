import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalCompanies = await User.count({ where: { role: 'employer' } });
    const totalJobs = await Job.count();
    const totalApplications = await Application.count();
    
    // Revenue logic: $100 per job, $50 per accepted app
    const acceptedAppsCount = await Application.count({ where: { status: 'Accepted' } });
    const revenue = (totalJobs * 100) + (acceptedAppsCount * 50);

    // Get some recent activity (last 5 jobs)
    const recentJobs = await Job.findAll({
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['name', 'companyName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      stats: {
        totalUsers,
        totalCompanies,
        totalJobs,
        totalApplications,
        revenue
      },
      recentJobs
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a job seeker
// @route   POST /api/admin/jobseeker
// @access  Private (Admin only)
export const createJobSeeker = async (req, res) => {
  try {
    const { name, email, password, phone, skills, experience } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'jobseeker',
      phone,
      skills: skills || [],
      experience: experience || ''
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};