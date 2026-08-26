function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message || err);
  if (err.stack) {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Something went wrong on the server. Please try again later.';

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;