const express = require('express');
const mongoose = require('mongoose');
const { body, param } = require('express-validator');
const requireAdmin = require('../middleware/requireAdmin');
const { getAnnouncements, postAnnouncement } = require('../controllers/announcementController');

const router = express.Router();

const stationIdValidation = param('stationId')
  .custom((value) => mongoose.isValidObjectId(value))
  .withMessage('stationId must be a valid MongoDB ObjectId');

const announcementValidation = [
  stationIdValidation,
  body('text')
    .isString().withMessage('text must be a string')
    .trim()
    .notEmpty().withMessage('text is required')
    .isLength({ max: 500 }).withMessage('text must be 500 characters or less'),
];

router.get('/:stationId/announcements', stationIdValidation, getAnnouncements);
router.post('/:stationId/announcements', requireAdmin, announcementValidation, postAnnouncement);

module.exports = router;
