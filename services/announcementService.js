const mongoose = require('mongoose');
const Announcement = require('../models/Announcement');
const Station = require('../models/Station');

const getAnnouncementsByStation = async (stationId, query = {}) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
  const skip = (page - 1) * limit;

  const filter = { stationId };
  if (query.search && String(query.search).trim()) {
    filter.text = { $regex: String(query.search).trim(), $options: 'i' };
  }

  const [data, total] = await Promise.all([
    Announcement.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Announcement.countDocuments(filter),
  ]);

  return {
    data,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
  };
};

const createAnnouncement = async ({ text, stationId }) => {
  if (!mongoose.isValidObjectId(stationId)) {
    const err = new Error('Invalid station id');
    err.status = 400;
    throw err;
  }

  const station = await Station.findById(stationId).select('_id').lean();
  if (!station) {
    const err = new Error('Station not found');
    err.status = 404;
    throw err;
  }

  return Announcement.create({ text, stationId });
};

module.exports = { getAnnouncementsByStation, createAnnouncement };
