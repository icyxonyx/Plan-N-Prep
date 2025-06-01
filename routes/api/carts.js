const express = require("express");
const router = express.Router();
const Cart = require("../../models/cart");

// Get cart by userId
router.get("/:userId", (req, res) => {
  Cart.findOne({ userId: req.params.userId })
    .then((cart) => {
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
      const reformatted = {
        id: cart._id,
        dates: cart.dates,
        userId: cart.userId,
      };
      res.json(reformatted);
    })
    .catch((err) => res.status(400).json(err));
});

// Add new date to the cart
router.patch("/:cartId/addDate/", (req, res) => {
  const options = { new: true }; // Return the updated document
  const date = req.body.date;

  // Create a dynamic update object
  const update = {
    $set: {
      [`dates.${date}`]: {
        BREAKFAST: null,
        LUNCH: null,
        DINNER: null,
        STATUS: {},
      },
    },
  };

  Cart.findOneAndUpdate({ _id: req.params.cartId }, update, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.json(result);
    })
    .catch((err) => res.status(400).json(err));
});

// Add a meal to a specific date and time
router.patch("/:cartId/addMeal/", (req, res) => {
  const options = { new: true };
  const update = { $set: {} };
  update["$set"][`dates.${req.body.date}.${req.body.time}`] = req.body.recipeId;

  Cart.findOneAndUpdate({ _id: req.params.cartId }, update, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.json(result);
    })
    .catch((err) => res.status(400).json(err));
});

// Delete a meal from a specific date and time in the cart
router.delete("/:cartId/meal", (req, res) => {
  const { cartId } = req.params;
  const { date, time } = req.body;

  const update = {
    $unset: {
      [`dates.${date}.${time}`]: 1, // Remove the meal at date/time
    },
  };

  Cart.findByIdAndUpdate(
    cartId,
    update,
    { new: true } // Return the updated document
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.json(result);
    })
    .catch((err) => res.status(400).json(err));
});

// Mark a meal as made or unmade
router.patch("/:cartId/setMealStatus", (req, res) => {
  const { date, time, status } = req.body; // status is true for 'made', false for 'unmade'
  const options = { new: true };

  const update = { $set: {} };
  update.$set[`dates.${date}.STATUS.${time}`] = status;

  Cart.findOneAndUpdate({ _id: req.params.cartId }, update, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: "Cart not found" });
      }
      res.json(result);
    })
    .catch((err) => res.status(400).json(err));
});

module.exports = router;
