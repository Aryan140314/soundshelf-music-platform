const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

// Create a new user account and return a signed auth cookie.
router.post('/register', authController.registerUser)

// Authenticate an existing user and refresh the auth cookie.
router.post('/login', authController.loginUser)

// Remove the auth cookie from the current session.
router.post('/logout', authController.logoutUser)

module.exports = router;
