const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan());
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); //access static files in folder

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
// 3) Routes

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
