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

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // B) RENDERED WEBSITE
  console.error('Error 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  // Operational, trusted error: send error to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other errors: don't leak error details
    // 1) log to the console
    console.error('Error 💥', err);

    // 2) Send genetic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }

  // B) Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      status: 'Something went wrong!',
      msg: err.message
    });
  }
  // Programming or other errors: don't leak error details
  // 1) log to the console
  console.error('Error 💥', err);

  // 2) Send genetic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
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

    sendErrorProd(error, req, res);
  }

  next();
};
