const express = require("express");
const router = express.Router();
const Fridge = require('../../models/fridge');

router.get("/test", (req, res) => res.json({ msg: "This is the fridge route" }));

router.get('/:userId', (req, res) => {
  Fridge.findOne({ userId: req.params.userId })
    .then(fridge => {
      if (fridge) {
        res.json(fridge);
      } else {
        res.status(400).json({ error: "NOT FOUND" });
      }
    })
    .catch(err => res.status(400).json(err));
});

router.patch('/:userId/addNewIngredient', async (req, res) => {
  let update = { "$set": {} };
  let options = { "upsert": true, new: true };
  update["$set"]["ingredients." + req.body.id] = req.body;

  try {
    const data = await Fridge.findOneAndUpdate({ userId: req.params.userId }, update, options);
    res.json(req.body);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.patch('/:userId/modifyIngredient', async (req, res) => {
  let update = { "$inc": {} };
  let options = { "upsert": true, new: true };
  update["$inc"]["ingredients." + req.body.id + ".amount"] = req.body.amount;

  try {
    const data = await Fridge.findOneAndUpdate({ userId: req.params.userId }, update, options);
    
    if (data.ingredients[req.body.id].amount <= 0) {
      let unset = { "$unset": {} };
      unset["$unset"]["ingredients." + req.body.id] = req.body.id;

      try {
        const updatedData = await Fridge.findOneAndUpdate({ userId: req.params.userId }, unset, { new: true });
        res.json(updatedData.ingredients[req.body.id]);
      } catch (err) {
        res.status(400).json(err);
      }
    } else {
      res.json(Object.assign(req.body, data.ingredients[req.body.id]));
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.patch('/:userId/modifyFridge', async (req, res) => {
  let update = { "$inc": {} };
  let options = { "upsert": true, new: true };
  let ingredients = req.body;

  Object.keys(ingredients).forEach(id => {
    update["$inc"]["ingredients." + id + ".amount"] = ingredients[id].amount;
  });

  try {
    const data = await Fridge.findOneAndUpdate({ userId: req.params.userId }, update, options);
    let unset = { "$unset": {} };
    let i = 0;

    Object.keys(data.ingredients).forEach(id => {
      if (data.ingredients[id].amount <= 0) {
        unset["$unset"]["ingredients." + id] = "";
        i++;
      }
    });

    if (i > 0) {
      try {
        const updatedData = await Fridge.findOneAndUpdate({ userId: req.params.userId }, unset, { new: true });
        res.json(updatedData);
      } catch (err) {
        res.status(400).json(err);
      }
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
