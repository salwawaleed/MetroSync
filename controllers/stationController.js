const { getAllStations } = require('../services/stationService');

const getStations = async (req, res, next) => {
  try {
    const stations = await getAllStations();
    res.json({ success: true, data: stations });
  } catch (err) {
    next(err);
  }
};

module.exports = { getStations };
