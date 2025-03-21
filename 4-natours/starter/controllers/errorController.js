const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.message.match(/"([^"]+)"/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValicationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Validation Error: ${errors.join('.  ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token, please log in again!', 401);
};

const handleJWTExpiredToken = () => {
  return new AppError('Token expired, please log in again!', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send error to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }
  // Programming or other errors: don't leak error details
  else {
    // 1) log to the console
    console.error('Error 💥', err);

    // 2) Send genetic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // manually copy non-enumerable properties of err
    let error = {
      message: err.message,
      name: err.name,
      stack: err.stack,
      ...err
    };

    // 1) MongoDB error, invalid ID
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
      error = handleValicationErrorDB(error);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredToken();
    }

    sendErrorProd(error, res);
  }

  next();
};
