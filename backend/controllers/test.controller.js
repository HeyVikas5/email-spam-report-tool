const Test = require('../models/Test.model');
const emailConfig = require('../config/email.config');
const { generateTestCode } = require('../utils/generateTestCode');
const detectionService = require('../services/detection.service');

/**
 * Get test inboxes
 */
exports.getTestInboxes = async (req, res) => {
  try {
    const inboxes = emailConfig.testInboxes.map(inbox => ({
      id: inbox.id,
      email: inbox.email,
      provider: inbox.provider
    }));

    res.json({
      success: true,
      data: inboxes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching test inboxes',
      error: error.message
    });
  }
};

/**
 * Create a new test
 */
exports.createTest = async (req, res) => {
  try {
    const { userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email is required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Generate unique test code
    const testCode = generateTestCode();

    // Prepare test inboxes
    const testInboxes = emailConfig.testInboxes.map(inbox => ({
      inboxId: inbox.id,
      email: inbox.email,
      provider: inbox.provider,
      status: 'pending',
      folder: null,
      checkCount: 0
    }));

    // Create test
    const test = new Test({
      testCode,
      userEmail,
      testInboxes
    });

    await test.save();

    res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: {
        testId: test._id,
        testCode: test.testCode,
        userEmail: test.userEmail,
        testInboxes: testInboxes.map(inbox => ({
          id: inbox.inboxId,
          email: inbox.email,
          provider: inbox.provider
        })),
        createdAt: test.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test',
      error: error.message
    });
  }
};

/**
 * Start test detection
 */
exports.startTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    if (test.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Test has already been started or completed'
      });
    }

    // Start detection process asynchronously
    detectionService.startDetection(testId).catch(error => {
      console.error('Detection error:', error);
    });

    res.json({
      success: true,
      message: 'Test detection started',
      data: {
        testId: test._id,
        testCode: test.testCode,
        status: 'processing'
      }
    });
  } catch (error) {
    console.error('Error starting test:', error);
    res.status(500).json({
      success: false,
      message: 'Error starting test',
      error: error.message
    });
  }
};

/**
 * Get test status
 */
exports.getTestStatus = async (req, res) => {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: {
        testId: test._id,
        testCode: test.testCode,
        userEmail: test.userEmail,
        status: test.status,
        testInboxes: test.testInboxes.map(inbox => ({
          id: inbox.inboxId,
          email: inbox.email,
          provider: inbox.provider,
          status: inbox.status,
          folder: inbox.folder,
          receivedAt: inbox.receivedAt,
          checkCount: inbox.checkCount
        })),
        deliverabilityScore: test.deliverabilityScore,
        reportUrl: test.reportUrl,
        completedAt: test.completedAt,
        createdAt: test.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching test status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test status',
      error: error.message
    });
  }
};

/**
 * Get test by code
 */
exports.getTestByCode = async (req, res) => {
  try {
    const { testCode } = req.params;

    const test = await Test.findOne({ testCode });
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      });
    }

    res.json({
      success: true,
      data: {
        testId: test._id,
        testCode: test.testCode,
        userEmail: test.userEmail,
        status: test.status,
        testInboxes: test.testInboxes.map(inbox => ({
          id: inbox.inboxId,
          email: inbox.email,
          provider: inbox.provider,
          status: inbox.status,
          folder: inbox.folder,
          receivedAt: inbox.receivedAt
        })),
        deliverabilityScore: test.deliverabilityScore,
        reportUrl: test.reportUrl,
        completedAt: test.completedAt,
        createdAt: test.createdAt
      }
    });
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching test',
      error: error.message
    });
  }
};