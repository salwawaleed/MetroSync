const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { getAnnouncementsByStation, createAnnouncement } = require('../services/announcementService');
const { getIO } = require('../sockets/socket');

const getAnnouncements = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.stationId)) {
      const err = new Error('Invalid station id');
      err.status = 400;
      throw err;
    }

    const result = await getAnnouncementsByStation(req.params.stationId, req.query);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

const postAnnouncement = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error('Invalid announcement input');
      err.status = 400;
      err.details = errors.array();
      throw err;
    }

    const announcement = await createAnnouncement({
      text: req.body.text,
      stationId: req.params.stationId,
    });

    const data = announcement.toObject();

    try {
      getIO()
        .to(req.params.stationId.toString())
        .emit('announcement', data);
    } catch (socketError) {
      console.warn(
        'Socket.io not initialized; skipping realtime broadcast during this request.'
      );
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnnouncements, postAnnouncement };