import Application from '../models/Application.js';
import Job from '../models/Job.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (Job Seeker only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId,
        applicantId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: req.user.id,
      coverLetter
    });

    // Update job applications count
    job.applicationsCount += 1;
    await job.save();

    const populatedApplication = await Application.findByPk(application.id, {
      include: [
        { model: Job, attributes: ['title', 'location'] },
        { model: User, as: 'applicant', attributes: ['name', 'email'] }
      ]
    });

    res.status(201).json(populatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get job seeker's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker only)
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [
        {
          model: Job,
          include: [
            {
              model: User,
              as: 'employer',
              attributes: ['name', 'companyName', 'email']
            }
          ]
        }
      ],
      order: [['appliedAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
export const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job owner or an admin
    if (job.employerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.findAll({
      where: { jobId: req.params.jobId },
      include: [
        { model: User, as: 'applicant', attributes: ['name', 'email', 'phone', 'resume', 'skills', 'experience'] }
      ],
      order: [['appliedAt', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized (employer owner or applicant)
    const isOwner = application.Job.employerId === req.user.id;
    const isApplicant = application.applicantId === req.user.id;

    if (!isOwner && !isApplicant) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    // Job seekers can only accept or reject an offer
    if (isApplicant && !['Accepted', 'Rejected'].includes(status)) {
      return res.status(403).json({ message: 'You can only accept or reject an offer' });
    }

    application.status = status;
    await application.save();

    const updatedApplication = await Application.findByPk(application.id, {
      include: [
        { model: User, as: 'applicant', attributes: ['name', 'email'] },
        { model: Job, attributes: ['title'] }
      ]
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/applications/:id/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { content, messageType, imageUrl } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized (applicant or job owner)
    const isApplicant = application.applicantId === req.user.id;
    const isOwner = application.Job.employerId === req.user.id;

    if (!isApplicant && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to send messages here' });
    }

    const message = await Message.create({
      applicationId: application.id,
      senderId: req.user.id,
      content,
      messageType: messageType || 'text',
      imageUrl
    });

    // Create notification for the recipient
    const recipientId = isApplicant ? application.Job.employerId : application.applicantId;
    
    await Notification.create({
      recipientId,
      senderId: req.user.id,
      applicationId: application.id,
      message: messageType === 'image' ? 'Sent you an image' : content.substring(0, 50) + (content.length > 50 ? '...' : '')
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get messages for an application
// @route   GET /api/applications/:id/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is authorized
    const isApplicant = application.applicantId === req.user.id;
    const isOwner = application.Job.employerId === req.user.id;

    if (!isApplicant && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    const messages = await Message.findAll({
      where: { applicationId: req.params.id },
      include: [{ model: User, as: 'sender', attributes: ['name', 'role'] }],
      order: [['sentAt', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send an offer letter
// @route   POST /api/applications/:id/offer
// @access  Private (Employer only)
export const sendOfferLetter = async (req, res) => {
  try {
    const { content, salary, joiningDate } = req.body;
    const application = await Application.findByPk(req.params.id, {
      include: [{ model: Job }]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the job owner
    if (application.Job.employerId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to send offer letters for this job' });
    }

    application.offerLetter = {
      content,
      salary,
      joiningDate,
      sentAt: new Date(),
      status: 'Sent'
    };

    // Automatically mark application as Accepted when offer is sent
    application.status = 'Accepted';

    await application.save();

    res.json({ message: 'Offer letter sent successfully', offerLetter: application.offerLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
