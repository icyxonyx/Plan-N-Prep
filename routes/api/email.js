// email_routes.js (backend route)
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer"); // Use nodemailer for email
const router = express.Router();
const User = require("../../models/user"); // Assuming you have a User model

// POST route to send ingredient list via email
router.post("/send-ingredients", async (req, res) => {
  const { userId, ingredients } = req.body;

  try {
    // Fetch the user's email based on userId
    const user = await User.findById(userId);
    const userEmail = user.email;

    // Create a formatted ingredient list
    const ingredientList = Object.values(ingredients)
      .map((ing) => `${ing.name}: ${ing.amount} ${ing.unit}`)
      .join("\n");

    // Setup Nodemailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your Weekly Ingredient List",
      text: `Here is your ingredient list:\n\n${ingredientList}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
