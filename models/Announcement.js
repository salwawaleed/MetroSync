const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true, maxlength: 500 },
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true, index: true },
}, { timestamps: true });

announcementSchema.index({ stationId: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);
