const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testCode: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  testInboxes: [{
    inboxId: Number,
    email: String,
    provider: String,
    status: {
      type: String,
      enum: ['pending', 'checking', 'detected', 'not_found', 'error'],
      default: 'pending'
    },
    folder: {
      type: String,
      enum: ['inbox', 'spam', 'promotions', 'not_found'],
      default: null
    },
    receivedAt: Date,
    checkCount: {
      type: Number,
      default: 0
    },
    lastCheckedAt: Date,
    error: String
  }],
  deliverabilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  reportUrl: String,
  completedAt: Date,
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Index for faster queries
testSchema.index({ createdAt: -1 });
testSchema.index({ userEmail: 1, createdAt: -1 });
testSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Calculate deliverability score before saving
testSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    const totalInboxes = this.testInboxes.length;
    const deliveredToInbox = this.testInboxes.filter(
      inbox => inbox.folder === 'inbox'
    ).length;
    
    this.deliverabilityScore = Math.round((deliveredToInbox / totalInboxes) * 100);
  }
  next();
});

module.exports = mongoose.model('Test', testSchema);