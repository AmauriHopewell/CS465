const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  const q = await Trip
    .find({}) // No filter, return all records
    .exec();

  // Uncomment the following line to show results of query
  // console.log(q);

  if (!q) {
    // Database returned no data
    return res
      .status(404)
      .json({ message: 'No trips found' });
  } else {
    // Return resulting trip list
    return res
      .status(200)
      .json(q);
  }
};

// GET: /trips/:tripCode - returns a single trip
const tripsFindByCode = async (req, res) => {
  const q = await Trip
    .find({ 'code': req.params.tripCode })
    .exec();

  // console.log(q);

  if (!q || q.length === 0) {
    // Database returned no data
    return res
      .status(404)
      .json({ message: 'Trip not found' });
  } else {
    // Return resulting trip list
    return res
      .status(200)
      .json(q);
  }
};

// POST: /trips - Adds a new Trip
const tripsAddTrip = async (req, res) => {
  const newTrip = new Trip({
    code: req.body.code,
    name: req.body.name,
    length: req.body.length,
    start: req.body.start,
    resort: req.body.resort,
    perPerson: req.body.perPerson,
    image: req.body.image,
    description: req.body.description
  });

  try {
    const q = await newTrip.save();
    return res.status(201).json(q);
  } catch (err) {
    return res.status(400).json(err);
  }
};

// PUT: /trips/:tripCode - Updates an existing Trip
const tripsUpdateTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndUpdate(
      { 'code': req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }   // return the updated document
    ).exec();

    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    } else {
      return res.status(200).json(q);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

// DELETE: /trips/:tripCode - Deletes an existing Trip
const tripsDeleteTrip = async (req, res) => {
  try {
    const q = await Trip.findOneAndDelete({ 'code': req.params.tripCode }).exec();

    if (!q) {
      return res.status(404).json({ message: 'Trip not found' });
    } else {
      return res.status(200).json(q);
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};