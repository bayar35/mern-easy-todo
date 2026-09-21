// 404 handler
const notFound = (req, res, next) => {
  const error = new Error(`Олдсонгүй: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Ерөнхий error handler
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    message:
      process.env.NODE_ENV === 'production'
        ? 'Серверийн алдаа гарлаа'
        : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };