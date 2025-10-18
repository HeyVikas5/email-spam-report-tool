const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  testCode: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  summary: {
    totalInboxes: Number,
    inbox: Number,
    spam: Number,
    promotions: Number,
    notFound: Number,
    deliverabilityScore: Number
  },
  details: [{
    provider: String,
    email: String,
    folder: String,
    receivedAt: Date,
    status: String
  }],
  reportUrl: String,
  pdfUrl: String,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date
}, {
  timestamps: true
});

reportSchema.index({ testId: 1 });
reportSchema.index({ testCode: 1 });
reportSchema.index({ userEmail: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);