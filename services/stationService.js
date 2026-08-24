const Station = require('../models/Station');

const getAllStations = async () => Station.find().sort({ line: 1, order: 1 }).lean();

const getStationById = async (stationId) => Station.findById(stationId).lean();

module.exports = { getAllStations, getStationById };
