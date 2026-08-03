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

module.exports = {
  tripsList,
  tripsFindByCode
};