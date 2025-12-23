const User = require('../models/userModel');
const Crush = require('../models/crushModel');
const { customAlphabet } = require('nanoid');

// Generate unique IDs
const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 12);

/**
 * Create a new user
 */
const createUser = async (req, res) => {
  try {
    const { name, email, age, gender, bio } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    }

    // Generate unique userId
    const userId = `user_${nanoid()}`;

    // Create user
    const user = new User({
      userId,
      name,
      email,
      age,
      gender,
      bio
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      message: error.message
    });
  }
};

/**
 * Get user by userId
 */
const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: error.message
    });
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow userId update
    delete updates.userId;
    delete updates._id;

    const user = await User.findOneAndUpdate(
      { userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      error: 'Failed to update user',
      message: error.message
    });
  }
};

/**
 * Create a new crush profile
 */
const createCrush = async (req, res) => {
  try {
    const { userId, name, age, gender, relationshipStatus, personality, interests, notes, whereMetContext } = req.body;

    // Validate required fields
    if (!userId || !name) {
      return res.status(400).json({
        error: 'userId and name are required'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ userId });
    if (!userExists) {
      return res.status(404).json({
        error: 'User not found. Create user first.'
      });
    }

    // Generate unique crushId
    const crushId = `crush_${nanoid()}`;

    // Create crush
    const crush = new Crush({
      crushId,
      userId,
      name,
      age,
      gender,
      relationshipStatus,
      personality,
      interests: interests || [],
      notes,
      whereMetContext
    });

    await crush.save();

    res.status(201).json({
      success: true,
      message: 'Crush profile created successfully',
      crush: {
        crushId: crush.crushId,
        userId: crush.userId,
        name: crush.name,
        age: crush.age,
        gender: crush.gender,
        relationshipStatus: crush.relationshipStatus,
        personality: crush.personality,
        currentStage: crush.currentStage,
        createdAt: crush.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating crush:', error);
    res.status(500).json({
      error: 'Failed to create crush profile',
      message: error.message
    });
  }
};

/**
 * Get crush by crushId
 */
const getCrushProfile = async (req, res) => {
  try {
    const { crushId } = req.params;

    const crush = await Crush.findOne({ crushId });

    if (!crush) {
      return res.status(404).json({
        error: 'Crush profile not found'
      });
    }

    res.json({
      success: true,
      crush
    });
  } catch (error) {
    console.error('Error fetching crush:', error);
    res.status(500).json({
      error: 'Failed to fetch crush profile',
      message: error.message
    });
  }
};

/**
 * Get all crushes for a user
 */
const getUserCrushes = async (req, res) => {
  try {
    const { userId } = req.params;

    const crushes = await Crush.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: crushes.length,
      crushes
    });
  } catch (error) {
    console.error('Error fetching crushes:', error);
    res.status(500).json({
      error: 'Failed to fetch crushes',
      message: error.message
    });
  }
};

/**
 * Update crush profile
 */
const updateCrush = async (req, res) => {
  try {
    const { crushId } = req.params;
    const updates = req.body;

    // Don't allow crushId or userId update
    delete updates.crushId;
    delete updates.userId;
    delete updates._id;

    const crush = await Crush.findOneAndUpdate(
      { crushId },
      updates,
      { new: true, runValidators: true }
    );

    if (!crush) {
      return res.status(404).json({
        error: 'Crush profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Crush profile updated successfully',
      crush
    });
  } catch (error) {
    console.error('Error updating crush:', error);
    res.status(500).json({
      error: 'Failed to update crush profile',
      message: error.message
    });
  }
};

/**
 * Delete crush profile
 */
const deleteCrush = async (req, res) => {
  try {
    const { crushId } = req.params;

    const crush = await Crush.findOneAndDelete({ crushId });

    if (!crush) {
      return res.status(404).json({
        error: 'Crush profile not found'
      });
    }

    res.json({
      success: true,
      message: 'Crush profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crush:', error);
    res.status(500).json({
      error: 'Failed to delete crush profile',
      message: error.message
    });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  createCrush,
  getCrushProfile,
  getUserCrushes,
  updateCrush,
  deleteCrush
};
