const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  line: { type: String, required: true, trim: true },
  order: { type: Number, required: true, min: 1 },
});

stationSchema.index({ line: 1, order: 1 });

module.exports = mongoose.model('Station', stationSchema);
