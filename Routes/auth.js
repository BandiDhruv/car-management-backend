import express from "express";
import user from "../models/user.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const userr = new user({ username, email });
  await userr.setPassword(password);
  await userr.save();
  res.status(201).json({ message: 'User created successfully' });
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userr = await user.findOne({ username });
  if (!userr || !(await userr.validatePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: userr._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user: { id: userr._id, username: userr.username } });
});

// Token Verification Route
router.get('/verify-token', authMiddleware, async (req, res) => {
  const user = await user.findById(req.user._id).select('username email'); // Fetch user data without password
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ user });
});

export default router;
