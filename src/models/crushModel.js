const { default: mongoose } = require('mongoose');

const crushSchema = new mongoose.Schema({
  crushId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other']
  },
  relationshipStatus: {
    type: String,
    enum: ['single', 'in-relationship', 'complicated', 'unknown'],
    default: 'unknown'
  },
  firstMet: {
    type: Date
  },
  whereMetContext: {
    type: String,
    maxlength: 500
  },
  personality: {
    type: String,
    enum: ['introvert', 'extrovert', 'analytical', 'spontaneous', 'cautious', 'direct', 'unknown'],
    default: 'unknown'
  },
  interests: [String],
  notes: {
    type: String,
    maxlength: 2000
  },
  currentStage: {
    type: String,
    enum: ['early_stage', 'getting_to_know', 'friend_zone', 'progressing', 'dating', 'rejected', 'inactive'],
    default: 'early_stage'
  },
  lastInteraction: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for querying user's crushes
crushSchema.index({ userId: 1, createdAt: -1 });

// Update timestamp on save
crushSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Crush', crushSchema);
