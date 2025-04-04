const AppError = require('./../utils/appError');
const Review = require('./../models/reviewModel');
// const catchAsync = require('./../utils/catchAsync');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.getTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
