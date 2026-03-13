import { Op } from 'sequelize';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer & Admin)
export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      qualifications,
      responsibilities,
      jobType,
      location,
      salaryRange
    } = req.body;

    const job = await Job.create({
      title,
      description,
      qualifications,
      responsibilities,
      jobType,
      location,
      salaryMin: salaryRange?.min || 0,
      salaryMax: salaryRange?.max || 0,
      employerId: req.user.id
    });

    res.status(201).json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all jobs with search and filters
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, maxSalary } = req.query;
    
    let whereClause = { status: 'active' };

    // Keyword search
    if (keyword) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // Location filter
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    // Job type filter
    if (jobType) {
      whereClause.jobType = jobType;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      if (minSalary) {
        whereClause.salaryMin = { [Op.gte]: Number(minSalary) };
      }
      if (maxSalary) {
        whereClause.salaryMax = { [Op.lte]: Number(maxSalary) };
      }
    }

    const jobs = await Job.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['name', 'companyName', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'employer',
          attributes: ['name', 'companyName', 'companyDescription', 'email', 'website']
        }
      ]
    });

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get employer's jobs
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer only)
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { employerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const {
      title,
      description,
      qualifications,
      responsibilities,
      jobType,
      location,
      salaryRange,
      status
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (qualifications) job.qualifications = qualifications;
    if (responsibilities) job.responsibilities = responsibilities;
    if (jobType) job.jobType = jobType;
    if (location) job.location = location;
    if (salaryRange) {
      if (salaryRange.min !== undefined) job.salaryMin = salaryRange.min;
      if (salaryRange.max !== undefined) job.salaryMax = salaryRange.max;
    }
    if (status) job.status = status;

    await job.save();
    res.json(job);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();
    
    // Also delete all applications for this job
    await Application.destroy({ where: { jobId: req.params.id } });

    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
