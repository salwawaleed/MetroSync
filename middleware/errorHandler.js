const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const response = {
    success: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) response.errors = err.details;
  if (status === 500) console.error(err);

  res.status(status).json(response);
};

module.exports = errorHandler;
