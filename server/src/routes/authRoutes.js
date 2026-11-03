const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, ObjectId } = require('../db');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Helper: validate password rules
function validatePassword(password) {
  if (!password || password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }
  return null;
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, photoURL, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Password validation check
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError,
      });
    }

    const db = getDB();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name: name.trim(),
      email: normalizedEmail,
      photoURL: photoURL && photoURL.trim() ? photoURL.trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      password: hashedPassword,
      bio: 'Active community volunteer committed to grassroots social impact.',
      phone: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(newUser);
    const userId = result.insertedId || result._id;

    const tokenPayload = {
      id: userId.toString(),
      email: newUser.email,
      name: newUser.name,
      photoURL: newUser.photoURL,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to KindredPulse.',
      token,
      user: {
        id: userId.toString(),
        name: newUser.name,
        email: newUser.email,
        photoURL: newUser.photoURL,
        bio: newUser.bio,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration. Please try again.',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.',
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'This account was signed up using Google/Social Login. Please sign in with Google.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password combination.',
      });
    }

    const tokenPayload = {
      id: (user._id || user.id).toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        bio: user.bio || '',
        phone: user.phone || '',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login.',
    });
  }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { email, name, photoURL } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google login requires a valid email address.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = getDB();
    const usersCollection = db.collection('users');

    let user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      const newUser = {
        name: (name || 'Community Member').trim(),
        email: normalizedEmail,
        photoURL: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Community volunteer connected via Google Authentication.',
        phone: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId || result._id };
    }

    const tokenPayload = {
      id: (user._id || user.id).toString(),
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Google login verified successfully!',
      token,
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        bio: user.bio || '',
        phone: user.phone || '',
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete Google authentication.',
    });
  }
});

// GET /api/auth/me (Protected route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: (user._id || user.id).toString(),
        name: user.name,
        email: user.email,
        photoURL: user.photoURL,
        bio: user.bio || '',
        phone: user.phone || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Fetch me error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching authenticated profile.',
    });
  }
});

// PUT /api/auth/profile (Protected route - Profile update optional requirement)
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, photoURL, bio, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Display name cannot be empty.',
      });
    }

    const db = getDB();
    const usersCollection = db.collection('users');
    const eventsCollection = db.collection('events');
    const joinedCollection = db.collection('joined_events');

    const updateFields = {
      name: name.trim(),
      updatedAt: new Date().toISOString(),
    };

    if (photoURL && photoURL.trim()) {
      updateFields.photoURL = photoURL.trim();
    }
    if (bio !== undefined) updateFields.bio = bio.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();

    await usersCollection.updateOne({ email: req.user.email }, { $set: updateFields });

    // Sync organizer updates to their created events
    await eventsCollection.updateOne(
      { organizerEmail: req.user.email },
      { $set: { organizerName: updateFields.name, organizerPhoto: updateFields.photoURL || req.user.photoURL } }
    );

    // Sync joined record attendee name
    await joinedCollection.updateOne(
      { userEmail: req.user.email },
      { $set: { userName: updateFields.name, userPhoto: updateFields.photoURL || req.user.photoURL } }
    );

    // Generate fresh token with updated name and photo
    const tokenPayload = {
      id: req.user.id,
      email: req.user.email,
      name: updateFields.name,
      photoURL: updateFields.photoURL || req.user.photoURL,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      token,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: updateFields.name,
        photoURL: updateFields.photoURL || req.user.photoURL,
        bio: updateFields.bio,
        phone: updateFields.phone,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
});

module.exports = router;
